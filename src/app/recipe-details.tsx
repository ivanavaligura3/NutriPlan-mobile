import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useUnits } from "../context/UnitContext";

import { useRecipes } from "../context/RecipeContext";
import { Recipe } from "../types/recipe";

import { COLORS } from "../styles/colors";
import { SPACING } from "../styles/spacing";
import { TYPOGRAPHY } from "../styles/typography";
import { roundNutrition } from "../utils/nutrition";
import { formatQuantityForDisplay } from "../utils/unitConversion";

export default function RecipeDetailsScreen() {
  const { recipeId } = useLocalSearchParams<{
    recipeId: string;
  }>();

  const { recipes, removeRecipe, favoriteRecipeIds, toggleFavorite } =
    useRecipes();
  const { unitSystem } = useUnits();
  const recipe = recipes.find((item) => item.id === Number(recipeId));

  const calculateIngredientNutrition = (
    ingredient: Recipe["ingredients"][number],
  ) => {
    // Ako sastojak nema podatke sa Open Food Facts-a,
    // ne možemo izračunati njegove nutritivne vrednosti.
    if (
      ingredient.offCalories === undefined ||
      ingredient.offProtein === undefined ||
      ingredient.offCarbohydrates === undefined ||
      ingredient.offFat === undefined
    ) {
      return null;
    }

    // Open Food Facts vrednosti su izražene na 100 g.
    // Zato ih preračunavamo prema količini u receptu.
    if (ingredient.unit.toLowerCase() !== "g") {
      return null;
    }

    const multiplier = Number(ingredient.quantity) / 100;

    return {
      calories: ingredient.offCalories * multiplier,

      protein: ingredient.offProtein * multiplier,

      carbohydrates: ingredient.offCarbohydrates * multiplier,

      fat: ingredient.offFat * multiplier,
    };
  };

  const getDisplayQuantity = (quantity: number, unit: string) => {
    return formatQuantityForDisplay(quantity, unit, unitSystem);
  };

  if (!recipe) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Recept nije pronađen.</Text>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Nazad</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Nazad</Text>
      </Pressable>

      <Text style={styles.title}>{recipe.name}</Text>

      <Pressable
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(recipe.id)}
      >
        <Ionicons
          name={
            favoriteRecipeIds.includes(recipe.id) ? "heart" : "heart-outline"
          }
          size={28}
          color={COLORS.primary}
        />
      </Pressable>

      <Text style={styles.description}>{recipe.description}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Kalorije</Text>
          <Text style={styles.infoValue}>
            {roundNutrition(Number(recipe.calories))} kcal
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Vreme pripreme</Text>

          <Text style={styles.infoValue}>{recipe.preparationTime} min</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Nutritivne vrednosti recepta</Text>

      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionLabel}>Kalorije</Text>

          <Text style={styles.nutritionValue}>
            {roundNutrition(Number(recipe.calories))} kcal{" "}
          </Text>
        </View>

        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionLabel}>Proteini</Text>

          <Text style={styles.nutritionValue}>
            {roundNutrition(Number(recipe.protein))} g{" "}
          </Text>
        </View>

        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionLabel}>Ugljeni hidrati</Text>

          <Text style={styles.nutritionValue}>
            {roundNutrition(Number(recipe.carbohydrates))} g{" "}
          </Text>
        </View>

        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionLabel}>Masti</Text>

          <Text style={styles.nutritionValue}>
            {roundNutrition(Number(recipe.fat))} g{" "}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Sastojci</Text>

      <View style={styles.ingredientsContainer}>
        {recipe.ingredients.map((ingredient) => {
          const nutrition = calculateIngredientNutrition(ingredient);

          return (
            <View key={ingredient.id} style={styles.ingredientCard}>
              <View style={styles.ingredientHeader}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>

                <Text style={styles.ingredientQuantity}>
                  {
                    getDisplayQuantity(ingredient.quantity, ingredient.unit)
                      .quantity
                  }{" "}
                  {
                    getDisplayQuantity(ingredient.quantity, ingredient.unit)
                      .unit
                  }
                </Text>
              </View>

              {nutrition ? (
                <View style={styles.ingredientNutrition}>
                  <Text style={styles.ingredientNutritionText}>
                    {nutrition.calories.toFixed(2)} kcal
                  </Text>

                  <Text style={styles.ingredientNutritionText}>
                    {nutrition.protein.toFixed(2)} g proteina
                  </Text>

                  <Text style={styles.ingredientNutritionText}>
                    {nutrition.carbohydrates.toFixed(2)} g UH
                  </Text>

                  <Text style={styles.ingredientNutritionText}>
                    {nutrition.fat.toFixed(2)} g masti
                  </Text>
                </View>
              ) : (
                <Text style={styles.noNutritionText}>
                  Nutritivne vrednosti nisu dostupne
                </Text>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Postupak pripreme</Text>

      <View style={styles.stepsContainer}>
        {recipe.preparationSteps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <Text style={styles.stepNumber}>{index + 1}.</Text>

            <Text style={styles.stepText}>{step.description}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: "/add-recipe",
            params: {
              recipeId: recipe.id.toString(),
            },
          })
        }
      >
        <Text style={styles.editButtonText}>Izmeni recept</Text>
      </Pressable>

      <Pressable
        style={styles.deleteButton}
        onPress={() => {
          removeRecipe(recipe.id);
          router.replace("/(tabs)/recipes");
        }}
      >
        <Text style={styles.deleteButtonText}>Obriši recept</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: 60,
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
    marginBottom: SPACING.md,
  },

  description: {
    fontSize: TYPOGRAPHY.body,
    lineHeight: 24,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },

  infoContainer: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  infoCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  infoLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  infoValue: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.primary,
  },

  nutritionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  nutritionCard: {
    width: "48%",
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  nutritionLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  nutritionValue: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.primary,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.headingSmall,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },

  ingredientsContainer: {
    width: "100%",
  },

  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  ingredientName: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },

  ingredientQuantity: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    color: COLORS.primary,
  },

  ingredientCard: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  ingredientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.sm,
  },

  ingredientNutrition: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  ingredientNutritionText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },

  noNutritionText: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.bodySmall,
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },

  stepsContainer: {
    width: "100%",
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },

  stepNumber: {
    width: 28,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.primary,
  },

  stepText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 24,
    color: COLORS.text,
  },

  deleteButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.error,
    marginTop: SPACING.xl,
  },

  deleteButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.white,
  },

  editButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: SPACING.xl,
  },

  editButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.white,
  },

  favoriteButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },

  favoriteButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
