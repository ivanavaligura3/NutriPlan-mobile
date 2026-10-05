import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useMeals } from "../context/MealContext";
import { useRecipes } from "../context/RecipeContext";
import { Meal } from "../types/meal";

import KeyboardAwareScreen from "../components/KeyboardAwareScreen/KeyboardAwareScreen";

import { COLORS } from "../styles/colors";
import { SPACING } from "../styles/spacing";
import { TYPOGRAPHY } from "../styles/typography";
import { roundNutrition } from "../utils/nutrition";

const getTimeAsDate = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date;
};

export default function AddMealScreen() {
  const { meals, addMeal, updateMeal } = useMeals();
  const { recipes } = useRecipes();

  const { date, mealId } = useLocalSearchParams<{
    date: string;
    mealId?: string;
  }>();

  const mealToEdit = mealId
    ? meals.find((meal) => meal.id === Number(mealId))
    : undefined;

  const [mealType, setMealType] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [time, setTime] = useState("08:00");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [servings, setServings] = useState(1);
  const [error, setError] = useState("");

  // Ako uređujemo postojeći obrok, automatski učitavamo njegov tip i povezani recept.
  useEffect(() => {
    if (!mealToEdit) {
      return;
    }

    setMealType(mealToEdit.mealType);
    setSelectedRecipeId(mealToEdit.recipeId);
    setTime(mealToEdit.time);
    setServings(mealToEdit.servings);
  }, [mealToEdit]);

  // Pronalazimo trenutno izabrani recept.
  const selectedRecipe = recipes.find(
    (recipe) => recipe.id === selectedRecipeId,
  );

  const handleSelectRecipe = (recipeId: number) => {
    const recipe = recipes.find((item) => item.id === recipeId);

    setSelectedRecipeId(recipeId);
    setError("");

    if (recipe) {
      setServings((currentServings) =>
        Math.min(currentServings, recipe.servings),
      );
    }
  };

  const handleSaveMeal = async () => {
    setError("");

    if (!mealType) {
      setError("Molimo vas izaberite tip obroka.");
      return;
    }

    if (!selectedRecipeId) {
      setError("Molimo vas izaberite recept.");
      return;
    }

    if (!selectedRecipe) {
      setError("Izabrani recept nije pronađen.");
      return;
    }

    if (servings < 1 || servings > selectedRecipe.servings) {
      setError(`Broj porcija mora biti između 1 i ${selectedRecipe.servings}.`);
      return;
    }

    if (mealId && mealToEdit) {
      const updatedMeal: Meal = {
        id: mealToEdit.id,
        date: mealToEdit.date,
        mealType,
        time,
        recipeId: selectedRecipe.id,
        mealName: selectedRecipe.name,
        calories: selectedRecipe.calories,
        servings,
        recipeServings: selectedRecipe.servings,
        protein: selectedRecipe.protein,
        carbohydrates: selectedRecipe.carbohydrates,
        fat: selectedRecipe.fat,
        isCompleted: mealToEdit.isCompleted,
      };

      try {
        await updateMeal(updatedMeal);
        router.back();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Nije moguće izmeniti obrok.",
        );
      }

      return;
    }

    const newMeal: Meal = {
      id: Date.now(),
      date: date,
      mealType,
      time,
      recipeId: selectedRecipe.id,
      mealName: selectedRecipe.name,
      calories: selectedRecipe.calories,
      servings,
      recipeServings: selectedRecipe.servings,
      protein: selectedRecipe.protein,
      carbohydrates: selectedRecipe.carbohydrates,
      fat: selectedRecipe.fat,
      isCompleted: false,
    };

    try {
      await addMeal(newMeal);
      router.back();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Nije moguće dodati obrok.",
      );
    }
  };
  return (
    <KeyboardAwareScreen>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Nazad</Text>
        </Pressable>

        <Text style={styles.title}>
          {mealId ? "Izmeni obrok" : "Dodaj obrok"}
        </Text>

        <Text style={styles.sectionTitle}>Izaberite recept</Text>

        <View style={styles.recipeContainer}>
          {recipes.map((recipe) => {
            const isSelected = selectedRecipeId === recipe.id;

            return (
              <Pressable
                key={recipe.id}
                onPress={() => handleSelectRecipe(recipe.id)}
                style={[
                  styles.recipeButton,
                  isSelected && styles.recipeButtonSelected,
                ]}
              >
                <View style={styles.recipeInfo}>
                  <Text
                    style={[
                      styles.recipeName,
                      isSelected && styles.recipeNameSelected,
                    ]}
                  >
                    {recipe.name}
                  </Text>

                  <Text
                    style={[
                      styles.recipeCalories,
                      isSelected && styles.recipeCaloriesSelected,
                    ]}
                  >
                    {recipe.calories} kcal · {recipe.servings}{" "}
                    {recipe.servings === 1 ? "porcija" : "porcije"}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Tip obroka</Text>

        <View style={styles.typeContainer}>
          {["Doručak", "Užina", "Ručak", "Večera"].map((type) => {
            const isSelected = mealType === type;

            return (
              <Pressable
                key={type}
                onPress={() => {
                  setMealType(type);
                  setError("");
                }}
                style={[
                  styles.typeButton,
                  isSelected && styles.typeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    isSelected && styles.typeButtonTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Vreme obroka</Text>

        <Pressable
          style={styles.timeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeButtonText}>{time}</Text>
        </Pressable>

        {showTimePicker && (
          <DateTimePicker
            value={getTimeAsDate(time)}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selectedDate) => {
              setShowTimePicker(Platform.OS === "ios");

              if (selectedDate) {
                const hours = String(selectedDate.getHours()).padStart(2, "0");

                const minutes = String(selectedDate.getMinutes()).padStart(
                  2,
                  "0",
                );

                setTime(`${hours}:${minutes}`);
              }
            }}
          />
        )}

        <Text style={styles.label}>Broj porcija</Text>

        <View style={styles.servingsContainer}>
          <Pressable
            style={styles.servingsButton}
            onPress={() => {
              if (servings > 1) {
                setServings(servings - 1);
              }
            }}
          >
            <Text style={styles.servingsButtonText}>−</Text>
          </Pressable>

          <View style={styles.servingsValueContainer}>
            <Text style={styles.servingsValue}>{servings}</Text>

            <Text style={styles.servingsText}>
              {servings === 1 ? "porcija" : "porcije"}
            </Text>
          </View>

          <Pressable
            style={styles.servingsButton}
            onPress={() => {
              if (selectedRecipe && servings < selectedRecipe.servings) {
                setServings(servings + 1);
              }
            }}
          >
            <Text style={styles.servingsButtonText}>+</Text>
          </Pressable>
        </View>

        {selectedRecipe && (
          <View style={styles.selectedRecipeInfo}>
            <Text style={styles.selectedRecipeLabel}>Izabrani recept</Text>

            <Text style={styles.selectedRecipeName}>{selectedRecipe.name}</Text>

            <Text style={styles.selectedRecipeCalories}>
              {roundNutrition(selectedRecipe.calories)} kcal ·{" "}
              {selectedRecipe.servings}{" "}
              {selectedRecipe.servings === 1 ? "porcija" : "porcije"}
            </Text>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.addButton} onPress={handleSaveMeal}>
          <Text style={styles.addButtonText}>
            {mealId ? "Sačuvaj izmene" : "Dodaj obrok"}
          </Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Otkaži</Text>
        </Pressable>
      </View>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
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

  sectionTitle: {
    fontSize: TYPOGRAPHY.headingSmall,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  recipeContainer: {
    gap: SPACING.sm,
  },

  recipeButton: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  recipeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  recipeInfo: {
    gap: SPACING.xs,
  },

  recipeName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },

  recipeNameSelected: {
    color: COLORS.white,
  },

  recipeCalories: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },

  recipeCaloriesSelected: {
    color: COLORS.white,
  },

  label: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
  },

  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  typeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  typeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  typeButtonText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.text,
  },

  selectedRecipeLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  typeButtonTextSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },

  timeButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  timeButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },

  selectedRecipeInfo: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedRecipeName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  selectedRecipeCalories: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  errorText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.error,
  },

  addButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    marginTop: SPACING.xl,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },

  addButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.white,
  },

  cancelButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  servingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
  },

  servingsButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  servingsButtonText: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.primary,
  },

  servingsValueContainer: {
    alignItems: "center",
    minWidth: 80,
  },

  servingsValue: {
    fontSize: TYPOGRAPHY.headingSmall,
    fontWeight: "700",
    color: COLORS.text,
  },

  servingsText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
