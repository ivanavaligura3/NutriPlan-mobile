import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import KeyboardAwareScreen from "../components/KeyboardAwareScreen/KeyboardAwareScreen";

import { useFoods } from "../context/FoodContext";
import {
    OpenFoodFactsProduct,
    searchOpenFoodFacts,
} from "../services/openFoodFacts.service";

import {
    FoodDatabaseItem,
    searchFoodDatabase,
} from "../services/foodDatabase.service";

import { COLORS } from "../styles/colors";
import { SPACING } from "../styles/spacing";
import { TYPOGRAPHY } from "../styles/typography";

export default function AddFoodScreen() {
  const { foods, addFood, updateFood } = useFoods();
  const { foodId } = useLocalSearchParams<{
    foodId?: string;
  }>();
  const isEditMode = Boolean(foodId);
  const existingFood = foods.find((food) => food.id === Number(foodId));

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [fat, setFat] = useState("");

  const [foodSearch, setFoodSearch] = useState("");
  const [foodResults, setFoodResults] = useState<OpenFoodFactsProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<OpenFoodFactsProduct | null>(null);
  const [selectedDatabaseFood, setSelectedDatabaseFood] =
    useState<FoodDatabaseItem | null>(null);

  const [databaseResults, setDatabaseResults] = useState<FoodDatabaseItem[]>(
    [],
  );

  useEffect(() => {
    if (existingFood) {
      setName(existingFood.name);
      setQuantity(existingFood.quantity.toString());
      setUnit(existingFood.unit);

      setCalories(
        existingFood.calories !== null ? existingFood.calories.toString() : "",
      );

      setProtein(
        existingFood.protein !== null ? existingFood.protein.toString() : "",
      );

      setCarbohydrates(
        existingFood.carbohydrates !== null
          ? existingFood.carbohydrates.toString()
          : "",
      );

      setFat(existingFood.fat !== null ? existingFood.fat.toString() : "");
    }
  }, [existingFood]);

  const handleSearchFoods = async () => {
    if (!foodSearch.trim()) {
      setFoodResults([]);
      setDatabaseResults([]);
      return;
    }

    try {
      setIsSearching(true);

      const [offResults, databaseResults] = await Promise.all([
        searchOpenFoodFacts(foodSearch.trim()),
        searchFoodDatabase(foodSearch.trim()),
      ]);

      setFoodResults(offResults);
      setDatabaseResults(databaseResults);
    } catch (error) {
      console.error("Greška pri pretrazi namirnica:", error);

      Alert.alert("Greška", "Nije moguće pretražiti namirnice.");
    } finally {
      setIsSearching(false);
    }
  };

  const getSelectedProductNutrition = () => {
    if (selectedDatabaseFood) {
      return {
        calories: selectedDatabaseFood.calories,
        protein: selectedDatabaseFood.protein,
        carbohydrates: selectedDatabaseFood.carbohydrates,
        fat: selectedDatabaseFood.fat,
      };
    }

    const nutriments = selectedProduct?.nutriments;

    if (!nutriments) {
      return null;
    }

    return {
      calories: nutriments["energy-kcal_100g"] ?? null,
      protein: nutriments.proteins_100g ?? null,
      carbohydrates: nutriments.carbohydrates_100g ?? null,
      fat: nutriments.fat_100g ?? null,
    };
  };

  const handleAddFood = async () => {
    if (!name.trim() || !quantity.trim() || !unit.trim()) {
      Alert.alert("Greška", "Molimo popunite sva polja.");
      return;
    }

    const quantityNumber = Number(quantity);

    if (Number.isNaN(quantityNumber) || quantityNumber <= 0) {
      Alert.alert("Greška", "Količina mora biti pozitivan broj.");
      return;
    }

    const nutritionValues = [
      { value: calories, name: "Kalorije" },
      { value: protein, name: "Proteini" },
      { value: carbohydrates, name: "Ugljeni hidrati" },
      { value: fat, name: "Masti" },
    ];

    for (const nutrition of nutritionValues) {
      if (!nutrition.value.trim()) {
        continue;
      }

      const number = Number(nutrition.value.replace(",", "."));

      if (Number.isNaN(number) || number < 0) {
        Alert.alert("Greška", `${nutrition.name} moraju biti broj 0 ili veći.`);
        return;
      }
    }

    if (isEditMode && existingFood) {
      await updateFood({
        id: existingFood.id,
        name: name.trim(),
        quantity: quantityNumber,
        unit: unit.trim(),
        calories: calories.trim() ? Number(calories.replace(",", ".")) : null,
        protein: protein.trim() ? Number(protein.replace(",", ".")) : null,
        carbohydrates: carbohydrates.trim()
          ? Number(carbohydrates.replace(",", "."))
          : null,
        fat: fat.trim() ? Number(fat.replace(",", ".")) : null,
      });
    } else {
      const nutrition = getSelectedProductNutrition();

      await addFood({
        id: Date.now(),
        name: name.trim(),
        quantity: quantityNumber,
        unit: unit.trim(),
        calories: nutrition?.calories ?? null,
        protein: nutrition?.protein ?? null,
        carbohydrates: nutrition?.carbohydrates ?? null,
        fat: nutrition?.fat ?? null,
      });
    }

    router.replace("/(tabs)/groceries");
  };
  return (
    <KeyboardAwareScreen>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isEditMode ? "Izmeni namirnicu" : "Dodaj namirnicu"}
        </Text>

        {!isEditMode && (
          <>
            <Text style={styles.label}>Pretraži namirnicu</Text>

            <TextInput
              style={styles.input}
              value={foodSearch}
              onChangeText={setFoodSearch}
              placeholder="npr. Banana"
              placeholderTextColor={COLORS.textSecondary}
            />

            <Pressable
              style={styles.button}
              onPress={handleSearchFoods}
              disabled={isSearching}
            >
              <Text style={styles.buttonText}>
                {isSearching ? "Pretraživanje..." : "Pretraži"}
              </Text>
            </Pressable>
          </>
        )}

        {!isEditMode &&
          (foodResults.length > 0 || databaseResults.length > 0) && (
            <View style={styles.resultsContainer}>
              {foodResults.map((product, index) => (
                <Pressable
                  key={`${product.code}-${index}`}
                  style={styles.resultItem}
                  onPress={() => {
                    setSelectedProduct(product);

                    setSelectedDatabaseFood(null);

                    console.log("IZABRANI OFF PROIZVOD:", product);

                    setName(product.product_name || "");

                    setFoodResults([]);
                    setFoodSearch("");
                  }}
                >
                  <Text style={styles.resultName}>
                    {product.product_name || "Nepoznat proizvod"}
                  </Text>

                  {product.brands && (
                    <Text style={styles.resultBrand}>{product.brands}</Text>
                  )}
                </Pressable>
              ))}

              {databaseResults.map((food) => (
                <Pressable
                  key={food.id}
                  style={styles.resultItem}
                  onPress={() => {
                    setName(food.name);

                    setSelectedProduct(null);

                    setDatabaseResults([]);
                    setFoodSearch("");
                  }}
                >
                  <Text style={styles.resultName}>{food.name}</Text>

                  <Text style={styles.resultBrand}>{food.category}</Text>

                  <Text style={styles.resultBrand}>
                    {food.calories !== null
                      ? `${food.calories} kcal / 100 g`
                      : "Kalorije nisu dostupne"}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

        {selectedProduct && (
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>
              Nutritivne vrednosti na 100 g
            </Text>

            {(() => {
              const nutrition = getSelectedProductNutrition();

              if (!nutrition) {
                return (
                  <Text style={styles.nutritionEmpty}>
                    Nutritivne vrednosti nisu dostupne.
                  </Text>
                );
              }

              return (
                <>
                  <Text style={styles.nutritionText}>
                    Kalorije: {nutrition.calories} kcal
                  </Text>

                  <Text style={styles.nutritionText}>
                    Proteini: {nutrition.protein} g
                  </Text>

                  <Text style={styles.nutritionText}>
                    Ugljeni hidrati: {nutrition.carbohydrates} g
                  </Text>

                  <Text style={styles.nutritionText}>
                    Masti: {nutrition.fat} g
                  </Text>
                </>
              );
            })()}
          </View>
        )}

        <Text style={styles.label}>Naziv namirnice</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="npr. Pileći file"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Količina</Text>

        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="npr. 500"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Jedinica mere</Text>

        <TextInput
          style={styles.input}
          value={unit}
          onChangeText={setUnit}
          placeholder="npr. g, kg, kom, l"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Kalorije (kcal / 100 g)</Text>

        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={setCalories}
          placeholder="npr. 165"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Proteini (g / 100 g)</Text>

        <TextInput
          style={styles.input}
          value={protein}
          onChangeText={setProtein}
          placeholder="npr. 31"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Ugljeni hidrati (g / 100 g)</Text>

        <TextInput
          style={styles.input}
          value={carbohydrates}
          onChangeText={setCarbohydrates}
          placeholder="npr. 0"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Masti (g / 100 g)</Text>

        <TextInput
          style={styles.input}
          value={fat}
          onChangeText={setFat}
          placeholder="npr. 3.6"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="decimal-pad"
        />

        <Pressable style={styles.button} onPress={handleAddFood}>
          <Text style={styles.buttonText}>
            {isEditMode ? "Sačuvaj izmene" : "Dodaj namirnicu"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAwareScreen>
  );
}

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },

  resultsContainer: {
    width: "100%",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },

  resultItem: {
    width: "100%",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  resultName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },

  resultBrand: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  title: {
    fontSize: TYPOGRAPHY.headingLarge,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },

  label: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.lg,
  },

  button: {
    width: "100%",
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: SPACING.md,
  },

  buttonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.white,
  },

  nutritionContainer: {
    width: "100%",
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.lg,
  },

  nutritionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  nutritionText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  nutritionEmpty: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});
