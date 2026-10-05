import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { searchOpenFoodFacts } from "../services/openFoodFacts.service";

import { searchFoodDatabase } from "../services/foodDatabase.service";

import type { FoodDatabaseItem } from "../services/foodDatabase.service";

import type { OpenFoodFactsProduct } from "../services/openFoodFacts.service";

import Input from "../components/Input/Input";
import KeyboardAwareScreen from "../components/KeyboardAwareScreen/KeyboardAwareScreen";

import { useRecipes } from "../context/RecipeContext";

import {
    addRecipeIngredient,
    addRecipeStep,
    createRecipe,
    deleteRecipeIngredient,
    deleteRecipeStep,
    updateRecipeIngredient,
    updateRecipeNutrition,
    updateRecipe as updateRecipeService,
    updateRecipeStep,
} from "../services/recipe.service";

import { COLORS } from "../styles/colors";
import { SPACING } from "../styles/spacing";
import { TYPOGRAPHY } from "../styles/typography";
import { roundNutrition } from "../utils/nutrition";

import type { RecipeIngredient, RecipeStep } from "../types/recipe";

type IngredientForm = {
  id?: number;
  name: string;
  quantity: string;
  unit: string;

  // Nutritivne vrednosti preuzete sa Open Food Facts-a
  offCalories?: number;
  offProtein?: number;
  offCarbohydrates?: number;
  offFat?: number;
};

export default function AddRecipeScreen() {
  const { recipeId } = useLocalSearchParams<{
    recipeId?: string;
  }>();

  const { recipes, addRecipe, updateRecipe } = useRecipes();

  const isEditMode = Boolean(recipeId);

  const existingRecipe = recipes.find(
    (recipe) => recipe.id === Number(recipeId),
  );

  // =====================================================
  // OSNOVNI PODACI RECEPTA
  // =====================================================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preparationTime, setPreparationTime] = useState("");

  // Broj porcija koje ceo recept daje.
  const [servings, setServings] = useState("1");

  // =====================================================
  // SASTOJCI
  // =====================================================

  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    {
      id: undefined,
      name: "",
      quantity: "",
      unit: "",
    },
  ]);

  // Rezultati Open Food Facts pretrage.
  const [openFoodFactsResults, setOpenFoodFactsResults] = useState<
    OpenFoodFactsProduct[]
  >([]);

  const [databaseFoodResults, setDatabaseFoodResults] = useState<
    FoodDatabaseItem[]
  >([]);

  const [activeIngredientIndex, setActiveIngredientIndex] = useState<
    number | null
  >(null);

  const [activeUnitIndex, setActiveUnitIndex] = useState<number | null>(null);

  // Tekst pretrage za svaki sastojak.
  const [foodSearch, setFoodSearch] = useState<Record<number, string>>({});

  // =====================================================
  // KORACI PRIPREME
  // =====================================================

  const [preparationSteps, setPreparationSteps] = useState<RecipeStep[]>([
    {
      id: 0,
      stepNumber: 1,
      description: "",
    },
  ]);

  const [error, setError] = useState("");

  // =====================================================
  // PRETRAGA OPEN FOOD FACTS
  // =====================================================

  const handleFoodSearch = async (value: string, ingredientIndex: number) => {
    setFoodSearch((currentSearch) => ({
      ...currentSearch,
      [ingredientIndex]: value,
    }));

    // Ako je polje prazno, brišemo prethodne rezultate.
    if (!value.trim()) {
      setOpenFoodFactsResults([]);
      setDatabaseFoodResults([]);
      return;
    }

    try {
      const [products, databaseFoods] = await Promise.all([
        searchOpenFoodFacts(value.trim()),
        searchFoodDatabase(value.trim()),
      ]);

      setOpenFoodFactsResults(products);
      setDatabaseFoodResults(databaseFoods);
    } catch (error) {
      console.error("Greška pri Open Food Facts pretrazi:", error);

      setOpenFoodFactsResults([]);
      setDatabaseFoodResults([]);
    }
  };

  // =====================================================
  // UČITAVANJE POSTOJEĆEG RECEPTA
  // =====================================================

  useEffect(() => {
    if (!existingRecipe) {
      return;
    }

    setName(existingRecipe.name);

    setDescription(existingRecipe.description);

    setPreparationTime(existingRecipe.preparationTime.toString());

    setServings(existingRecipe.servings.toString());

    setIngredients(
      existingRecipe.ingredients.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.quantity.toString(),
        unit: ingredient.unit,

        // Učitavamo i OFF nutritivne vrednosti.
        offCalories: ingredient.offCalories,
        offProtein: ingredient.offProtein,
        offCarbohydrates: ingredient.offCarbohydrates,
        offFat: ingredient.offFat,
      })),
    );

    setPreparationSteps(
      existingRecipe.preparationSteps.map((step) => ({
        id: step.id,
        stepNumber: step.stepNumber,
        description: step.description,
      })),
    );
  }, [existingRecipe]);

  // =====================================================
  // ČUVANJE RECEPTA
  // =====================================================

  const handleSaveRecipe = async () => {
    setError("");

    // Provera osnovnih polja.
    if (
      !name.trim() ||
      !description.trim() ||
      !preparationTime.trim() ||
      !servings.trim()
    ) {
      setError("Molimo vas popunite sva polja.");
      return;
    }

    const preparationTimeNumber = Number(preparationTime);

    const servingsNumber = Number(servings);

    // Provera vremena pripreme.
    if (isNaN(preparationTimeNumber) || preparationTimeNumber <= 0) {
      setError("Unesite ispravno vreme pripreme.");
      return;
    }

    // Provera broja porcija.
    if (
      isNaN(servingsNumber) ||
      servingsNumber <= 0 ||
      !Number.isInteger(servingsNumber)
    ) {
      setError("Broj porcija mora biti ceo broj veći od 0.");
      return;
    }

    // Provera količine sastojaka.
    const hasInvalidIngredientQuantity = ingredients.some(
      (ingredient) =>
        isNaN(Number(ingredient.quantity)) || Number(ingredient.quantity) <= 0,
    );

    // Provera svih polja sastojaka.
    const hasInvalidIngredient = ingredients.some(
      (ingredient) =>
        !ingredient.name.trim() ||
        !ingredient.quantity.trim() ||
        !ingredient.unit.trim(),
    );

    if (hasInvalidIngredient) {
      setError("Molimo vas popunite sva polja za sastojke.");
      return;
    }

    if (hasInvalidIngredientQuantity) {
      setError("Količina sastojaka mora biti veća od 0.");
      return;
    }

    // Provera koraka pripreme.
    const hasInvalidPreparationStep = preparationSteps.some(
      (step) => !step.description.trim(),
    );

    if (hasInvalidPreparationStep) {
      setError("Molimo vas unesite sve korake pripreme.");
      return;
    }

    // =====================================================
    // PRIPREMA LOKALNOG OBJEKTA RECEPTA
    // =====================================================

    const recipeIdNumber = isEditMode ? Number(recipeId) : Date.now();

    const newRecipe = {
      id: recipeIdNumber,

      name: name.trim(),

      description: description.trim(),

      // Backend automatski računa nutritivne vrednosti.
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,

      preparationTime: preparationTimeNumber,

      // Ukupan broj porcija koje recept daje.
      servings: servingsNumber,

      ingredients: ingredients.map(
        (ingredient, index): RecipeIngredient => ({
          id: ingredient.id ?? Date.now() + index,

          name: ingredient.name.trim(),

          quantity: Number(ingredient.quantity),

          unit: ingredient.unit.trim(),

          offCalories: ingredient.offCalories,

          offProtein: ingredient.offProtein,

          offCarbohydrates: ingredient.offCarbohydrates,

          offFat: ingredient.offFat,
        }),
      ),

      preparationSteps: preparationSteps.map(
        (step, index): RecipeStep => ({
          id: step.id || Date.now() + index,

          stepNumber: index + 1,

          description: step.description.trim(),
        }),
      ),
    };

    // =====================================================
    // IZMENА POSTOJEĆEG RECEPTA
    // =====================================================

    if (isEditMode && existingRecipe) {
      try {
        // 1. Izmena osnovnih podataka recepta.

        await updateRecipeService(
          existingRecipe.id,
          name.trim(),
          description.trim(),
          0,
          preparationTimeNumber,
          servingsNumber,
        );

        // 2. Izmena postojećih
        // i dodavanje novih sastojaka.

        const savedIngredients: RecipeIngredient[] = [];

        for (const ingredient of ingredients) {
          if (ingredient.id !== undefined) {
            // Postojeći sastojak - izmena.

            await updateRecipeIngredient(
              existingRecipe.id,
              ingredient.id,
              ingredient.name.trim(),
              Number(ingredient.quantity),
              ingredient.unit.trim(),
              ingredient.offCalories,
              ingredient.offProtein,
              ingredient.offCarbohydrates,
              ingredient.offFat,
            );

            savedIngredients.push({
              id: ingredient.id,
              name: ingredient.name.trim(),
              quantity: Number(ingredient.quantity),
              unit: ingredient.unit.trim(),

              offCalories: ingredient.offCalories,

              offProtein: ingredient.offProtein,

              offCarbohydrates: ingredient.offCarbohydrates,

              offFat: ingredient.offFat,
            });
          } else {
            // Novi sastojak - dodavanje.

            const response = await addRecipeIngredient(
              existingRecipe.id,
              ingredient.name.trim(),
              Number(ingredient.quantity),
              ingredient.unit.trim(),
              ingredient.offCalories,
              ingredient.offProtein,
              ingredient.offCarbohydrates,
              ingredient.offFat,
            );

            savedIngredients.push({
              id: response.ingredientId,

              name: ingredient.name.trim(),

              quantity: Number(ingredient.quantity),

              unit: ingredient.unit.trim(),

              offCalories: ingredient.offCalories,

              offProtein: ingredient.offProtein,

              offCarbohydrates: ingredient.offCarbohydrates,

              offFat: ingredient.offFat,
            });
          }
        }

        // 3. Pronalaženje obrisanih sastojaka.

        const currentIngredientIds = ingredients
          .filter((ingredient) => ingredient.id !== undefined)
          .map((ingredient) => ingredient.id);

        const deletedIngredients = existingRecipe.ingredients.filter(
          (ingredient) => !currentIngredientIds.includes(ingredient.id),
        );

        // 4. Brisanje sastojaka.

        for (const ingredient of deletedIngredients) {
          await deleteRecipeIngredient(existingRecipe.id, ingredient.id);
        }

        // 5. Ponovni obračun nutritivnih vrednosti.

        const nutrition = await updateRecipeNutrition(existingRecipe.id);

        // 6. Izmena, dodavanje i brisanje
        // koraka pripreme.

        const savedPreparationSteps: RecipeStep[] = [];

        for (let index = 0; index < preparationSteps.length; index++) {
          const step = preparationSteps[index];

          // Postojeći korak - izmena.

          if (step.id !== 0) {
            await updateRecipeStep(
              existingRecipe.id,
              step.id,
              index + 1,
              step.description.trim(),
            );

            savedPreparationSteps.push({
              id: step.id,
              stepNumber: index + 1,
              description: step.description.trim(),
            });
          } else {
            // Novi korak - dodavanje.

            const response = await addRecipeStep(
              existingRecipe.id,
              index + 1,
              step.description.trim(),
            );

            savedPreparationSteps.push({
              id: response.stepId,
              stepNumber: index + 1,
              description: step.description.trim(),
            });
          }
        }

        // 7. Pronalaženje obrisanih koraka.

        const currentStepIds = preparationSteps
          .filter((step) => step.id !== 0)
          .map((step) => step.id);

        const deletedSteps = existingRecipe.preparationSteps.filter(
          (step) => !currentStepIds.includes(step.id),
        );

        // 8. Brisanje obrisanih koraka.

        for (const step of deletedSteps) {
          await deleteRecipeStep(existingRecipe.id, step.id);
        }

        // 9. Ažuriranje lokalnog state-a.

        updateRecipe({
          ...newRecipe,
          id: existingRecipe.id,

          calories: nutrition.calories,

          protein: nutrition.protein,

          carbohydrates: nutrition.carbohydrates,

          fat: nutrition.fat,

          ingredients: savedIngredients,

          preparationSteps: savedPreparationSteps,
        });

        // 10. Povratak na listu recepata.

        router.replace("/(tabs)/recipes");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Došlo je do greške pri izmeni recepta.",
        );
      }

      return;
    }

    // =====================================================
    // KREIRANJE NOVOG RECEPTA
    // =====================================================

    try {
      // 1. Kreiramo recept.

      const response = await createRecipe(
        name.trim(),
        description.trim(),
        0,
        preparationTimeNumber,
        servingsNumber,
      );

      const createdRecipeId = response.recipeId;

      // 2. Dodajemo sastojke u bazu.

      const savedIngredients: RecipeIngredient[] = [];

      for (const ingredient of ingredients) {
        const response = await addRecipeIngredient(
          createdRecipeId,
          ingredient.name.trim(),
          Number(ingredient.quantity),
          ingredient.unit.trim(),
          ingredient.offCalories,
          ingredient.offProtein,
          ingredient.offCarbohydrates,
          ingredient.offFat,
        );

        savedIngredients.push({
          id: response.ingredientId,

          name: ingredient.name.trim(),

          quantity: Number(ingredient.quantity),

          unit: ingredient.unit.trim(),

          offCalories: ingredient.offCalories,

          offProtein: ingredient.offProtein,

          offCarbohydrates: ingredient.offCarbohydrates,

          offFat: ingredient.offFat,
        });
      }

      // 3. Automatski obračun nutritivnih vrednosti.

      const nutrition = await updateRecipeNutrition(createdRecipeId);

      // 4. Dodajemo korake pripreme.

      for (let index = 0; index < preparationSteps.length; index++) {
        await addRecipeStep(
          createdRecipeId,
          index + 1,
          preparationSteps[index].description.trim(),
        );
      }

      // 5. Priprema koraka za lokalni state.

      const savedPreparationSteps: RecipeStep[] = preparationSteps.map(
        (step, index) => ({
          id: step.id || Date.now() + index,

          stepNumber: index + 1,

          description: step.description.trim(),
        }),
      );

      // 6. Ažuriranje lokalnog state-a.

      addRecipe({
        ...newRecipe,
        id: createdRecipeId,

        calories: nutrition.calories,

        protein: nutrition.protein,

        carbohydrates: nutrition.carbohydrates,

        fat: nutrition.fat,

        ingredients: savedIngredients,

        preparationSteps: savedPreparationSteps,
      });

      // 7. Povratak na listu recepata.

      router.replace("/(tabs)/recipes");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Došlo je do greške pri čuvanju recepta.",
      );
    }
  };

  // =====================================================
  // DODAVANJE SASTOJKA
  // =====================================================

  const handleAddIngredient = () => {
    setIngredients((currentIngredients) => [
      ...currentIngredients,
      {
        id: undefined,
        name: "",
        quantity: "",
        unit: "",
      },
    ]);
  };

  // =====================================================
  // UKLANJANJE SASTOJKA
  // =====================================================

  const handleRemoveIngredient = (index: number) => {
    setIngredients((currentIngredients) =>
      currentIngredients.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  // =====================================================
  // IZBOR OPEN FOOD FACTS PROIZVODA
  // =====================================================

  const handleSelectFood = (
    product: OpenFoodFactsProduct,
    ingredientIndex: number,
  ) => {
    const productName = product.product_name?.trim();

    if (!productName) {
      return;
    }

    const nutriments = product.nutriments;

    const offCalories = nutriments?.["energy-kcal_100g"];

    const offProtein = nutriments?.proteins_100g;

    const offCarbohydrates = nutriments?.carbohydrates_100g;

    const offFat = nutriments?.fat_100g;

    setIngredients((currentIngredients) =>
      currentIngredients.map((item, itemIndex) =>
        itemIndex === ingredientIndex
          ? {
              ...item,
              name: productName,
              offCalories,
              offProtein,
              offCarbohydrates,
              offFat,
            }
          : item,
      ),
    );

    setFoodSearch((currentSearch) => ({
      ...currentSearch,
      [ingredientIndex]: "",
    }));

    setOpenFoodFactsResults([]);

    setActiveIngredientIndex(null);
  };

  // =====================================================
  // DODAVANJE KORAKA
  // =====================================================

  const handleAddPreparationStep = () => {
    setPreparationSteps((currentSteps) => [
      ...currentSteps,
      {
        id: 0,
        stepNumber: currentSteps.length + 1,
        description: "",
      },
    ]);
  };

  // =====================================================
  // BRISANJE KORAKA
  // =====================================================

  const handleRemovePreparationStep = (index: number) => {
    setPreparationSteps((currentSteps) =>
      currentSteps
        .filter((_, stepIndex) => stepIndex !== index)
        .map((step, stepIndex) => ({
          ...step,
          stepNumber: stepIndex + 1,
        })),
    );
  };

  return (
    <KeyboardAwareScreen>
      <View style={styles.container}>
        {/* Nazad */}

        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Nazad</Text>
        </Pressable>

        {/* Naslov */}

        <Text style={styles.title}>
          {isEditMode ? "Izmeni recept" : "Dodaj recept"}
        </Text>

        {/* Naziv recepta */}

        <Text style={styles.label}>Naziv recepta</Text>

        <Input
          placeholder="Npr. Piletina sa povrćem"
          placeholderTextColor={COLORS.textSecondary}
          value={name}
          onChangeText={setName}
        />

        {/* Opis */}

        <Text style={styles.label}>Opis</Text>

        <Input
          placeholder="Kratak opis recepta"
          placeholderTextColor={COLORS.textSecondary}
          value={description}
          onChangeText={setDescription}
        />

        {/* Vreme pripreme */}

        <Text style={styles.label}>Vreme pripreme (min)</Text>

        <Input
          placeholder="Npr. 30"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
          value={preparationTime}
          onChangeText={setPreparationTime}
        />

        {/* Broj porcija */}

        <Text style={styles.label}>Broj porcija</Text>

        <Input
          placeholder="Npr. 4"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
          value={servings}
          onChangeText={setServings}
        />

        {/* =================================================
                    SASTOJCI
                ================================================= */}

        <Text style={styles.sectionTitle}>Sastojci</Text>

        {ingredients.map((ingredient, index) => (
          <View key={index}>
            <Text style={styles.ingredientTitle}>Sastojak {index + 1}</Text>

            {/* Naziv sastojka */}

            <Text style={styles.label}>Naziv sastojka</Text>

            <Pressable
              style={styles.foodSelector}
              onPress={() => {
                setActiveIngredientIndex(
                  activeIngredientIndex === index ? null : index,
                );

                setOpenFoodFactsResults([]);
                setDatabaseFoodResults([]);
              }}
            >
              <Text
                style={[
                  styles.foodSelectorText,
                  !ingredient.name && styles.foodSelectorPlaceholder,
                ]}
              >
                {ingredient.name || "Izaberi namirnicu"}
              </Text>

              <Text style={styles.foodSelectorArrow}>
                {activeIngredientIndex === index ? "▲" : "▼"}
              </Text>
            </Pressable>

            {activeIngredientIndex === index && (
              <View style={styles.foodOptions}>
                <Input
                  placeholder="Pretraži namirnicu..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={foodSearch[index] || ""}
                  onChangeText={(value) => handleFoodSearch(value, index)}
                />

                {foodSearch[index]?.trim() ? (
                  <>
                    {/* =========================================
                                                REZULTATI INTERNE BAZE
                                            ========================================= */}

                    {databaseFoodResults.map((food) => (
                      <Pressable
                        key={`database-${food.id}`}
                        style={styles.foodOption}
                        onPress={() => {
                          setIngredients((currentIngredients) =>
                            currentIngredients.map((item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    name: food.name,
                                    offCalories: food.calories ?? undefined,
                                    offProtein: food.protein ?? undefined,
                                    offCarbohydrates:
                                      food.carbohydrates ?? undefined,
                                    offFat: food.fat ?? undefined,
                                  }
                                : item,
                            ),
                          );

                          setFoodSearch((currentSearch) => ({
                            ...currentSearch,
                            [index]: "",
                          }));

                          setDatabaseFoodResults([]);
                          setOpenFoodFactsResults([]);
                          setActiveIngredientIndex(null);
                        }}
                      >
                        <Text style={styles.foodOptionText}>{food.name}</Text>

                        <Text style={styles.foodOptionBrand}>Interna baza</Text>

                        <Text style={styles.foodOptionQuantity}>
                          {roundNutrition(food.calories ?? 0)} kcal / 100 g
                        </Text>
                      </Pressable>
                    ))}

                    {/* =========================================
                                                REZULTATI OPEN FOOD FACTS
                                            ========================================= */}

                    {openFoodFactsResults.map((product, productIndex) => (
                      <Pressable
                        key={product.code || `off-${productIndex}`}
                        style={styles.foodOption}
                        onPress={() => handleSelectFood(product, index)}
                      >
                        <Text style={styles.foodOptionText}>
                          {product.product_name || "Nepoznat proizvod"}
                        </Text>

                        {product.brands && (
                          <Text style={styles.foodOptionBrand}>
                            {product.brands}
                          </Text>
                        )}

                        {product.quantity && (
                          <Text style={styles.foodOptionQuantity}>
                            {product.quantity}
                          </Text>
                        )}
                      </Pressable>
                    ))}

                    {/* Ako nema rezultata ni u jednoj bazi */}

                    {databaseFoodResults.length === 0 &&
                      openFoodFactsResults.length === 0 && (
                        <Text style={styles.noFoodResults}>
                          Nema pronađenih namirnica.
                        </Text>
                      )}
                  </>
                ) : (
                  <Text style={styles.searchHint}>
                    Unesite naziv namirnice za pretragu.
                  </Text>
                )}
              </View>
            )}

            {/* Količina */}

            <Text style={styles.label}>Količina</Text>

            <Input
              placeholder="Npr. 200"
              placeholderTextColor={COLORS.textSecondary}
              value={ingredient.quantity}
              onChangeText={(value) => {
                setIngredients((currentIngredients) =>
                  currentIngredients.map((item, itemIndex) =>
                    itemIndex === index
                      ? {
                          ...item,
                          quantity: value,
                        }
                      : item,
                  ),
                );
              }}
              keyboardType="numeric"
            />

            {/* Jedinica */}

            <Text style={styles.label}>Jedinica</Text>

            <Pressable
              style={styles.unitSelector}
              onPress={() =>
                setActiveUnitIndex(activeUnitIndex === index ? null : index)
              }
            >
              <Text
                style={[
                  styles.unitSelectorText,
                  !ingredient.unit && styles.unitSelectorPlaceholder,
                ]}
              >
                {ingredient.unit || "Izaberi jedinicu"}
              </Text>

              <Text style={styles.unitSelectorArrow}>
                {activeUnitIndex === index ? "▲" : "▼"}
              </Text>
            </Pressable>

            {activeUnitIndex === index && (
              <View style={styles.unitOptions}>
                {["g", "kg", "ml", "l", "kom"].map((unit) => (
                  <Pressable
                    key={unit}
                    style={styles.unitOption}
                    onPress={() => {
                      setIngredients((currentIngredients) =>
                        currentIngredients.map((item, itemIndex) =>
                          itemIndex === index
                            ? {
                                ...item,
                                unit,
                              }
                            : item,
                        ),
                      );

                      setActiveUnitIndex(null);
                    }}
                  >
                    <Text style={styles.unitOptionText}>{unit}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Uklanjanje sastojka */}

            <Pressable
              style={styles.removeIngredientButton}
              onPress={() => handleRemoveIngredient(index)}
            >
              <Text style={styles.removeIngredientText}>− Ukloni sastojak</Text>
            </Pressable>
          </View>
        ))}

        {/* Dodavanje sastojka */}

        <Pressable
          style={styles.addIngredientButton}
          onPress={handleAddIngredient}
        >
          <Text style={styles.addIngredientText}>+ Dodaj sastojak</Text>
        </Pressable>

        {/* =================================================
                    POSTUPAK PRIPREME
                ================================================= */}

        <Text style={styles.sectionTitle}>Postupak pripreme</Text>

        {preparationSteps.map((step, index) => (
          <View key={step.id || index}>
            <Text style={styles.ingredientTitle}>Korak {index + 1}</Text>

            <Input
              placeholder="Opišite korak pripreme"
              placeholderTextColor={COLORS.textSecondary}
              value={step.description}
              onChangeText={(value) => {
                setPreparationSteps((currentSteps) =>
                  currentSteps.map((item, itemIndex) =>
                    itemIndex === index
                      ? {
                          ...item,
                          description: value,
                        }
                      : item,
                  ),
                );
              }}
            />

            <Pressable
              onPress={() => handleRemovePreparationStep(index)}
              style={styles.removeStepButton}
            >
              <Text style={styles.removeStepButtonText}>Obriši korak</Text>
            </Pressable>
          </View>
        ))}

        {/* Dodavanje koraka */}

        <Pressable
          style={styles.addIngredientButton}
          onPress={handleAddPreparationStep}
        >
          <Text style={styles.addIngredientText}>+ Dodaj korak</Text>
        </Pressable>

        {/* Poruka o grešci */}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Sačuvaj */}

        <Pressable style={styles.saveButton} onPress={handleSaveRecipe}>
          <Text style={styles.saveButtonText}>Sačuvaj recept</Text>
        </Pressable>

        {/* Otkaži */}

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Otkaži</Text>
        </Pressable>
      </View>
    </KeyboardAwareScreen>
  );
}

// =====================================================
// STILOVI
// =====================================================

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },

  backButton: {
    marginBottom: SPACING.xl,
  },

  backText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.primary,
  },

  title: {
    fontSize: TYPOGRAPHY.headingLarge,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },

  label: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.headingSmall,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },

  ingredientTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: SPACING.md,
  },

  addIngredientButton: {
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
    alignItems: "center",
  },

  addIngredientText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.primary,
  },

  removeIngredientButton: {
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
    alignItems: "center",
  },

  removeIngredientText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    color: COLORS.error,
  },

  removeStepButton: {
    alignSelf: "flex-start",
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
  },

  removeStepButtonText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    color: COLORS.error,
  },

  saveButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: SPACING.xl,
  },

  saveButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.white,
  },

  cancelButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.sm,
  },

  cancelButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  errorText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    marginTop: SPACING.md,
  },

  // =====================================================
  // IZBOR NAMIRNICE
  // =====================================================

  foodSelector: {
    minHeight: 50,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  foodSelectorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },

  foodSelectorPlaceholder: {
    color: COLORS.textSecondary,
  },

  foodSelectorArrow: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },

  foodOptions: {
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },

  foodOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  foodOptionText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "600",
  },

  foodOptionBrand: {
    marginTop: 4,
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },

  foodOptionQuantity: {
    marginTop: 2,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },

  noFoodResults: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  searchHint: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  // =====================================================
  // JEDINICA
  // =====================================================

  unitSelector: {
    minHeight: 50,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  unitSelectorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },

  unitSelectorPlaceholder: {
    color: COLORS.textSecondary,
  },

  unitSelectorArrow: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },

  unitOptions: {
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },

  unitOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  unitOptionText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },
});
