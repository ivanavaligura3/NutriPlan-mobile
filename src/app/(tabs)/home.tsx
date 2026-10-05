import { ScrollView, StyleSheet, Text, View } from "react-native";

import Card from "../../components/Card/Card";
import MealCard from "../../components/MealCard/MealCard";

import NutritionSummary from "../../components/NutritionSummary/NutritionSummary";
import { useFoods } from "../../context/FoodContext";
import { useMeals } from "../../context/MealContext";
import { useRecipes } from "../../context/RecipeContext";

import { getDateString } from "../../constants/dateData";
import { calculateNutritionTotals } from "../../utils/calories";
import { getShoppingIngredientsForDay } from "../../utils/mealUtils";

import { COLORS } from "../../styles/colors";
import { SPACING } from "../../styles/spacing";
import { TYPOGRAPHY } from "../../styles/typography";
import { roundNutrition } from "../../utils/nutrition";

// Početni ekran aplikacije.
// Prikazuje kratak pregled najvažnijih informacija
// za današnji dan.

export default function HomeScreen() {
  const { meals } = useMeals();
  const { recipes } = useRecipes();
  const { foods } = useFoods();

  // Trenutni datum.
  const today = new Date();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  // Datum u formatu YYYY-MM-DD.
  const todayDate = getDateString(todayYear, todayMonth, todayDay);

  // Uzimamo samo obroke koji pripadaju današnjem datumu.
  const todayMeals = meals.filter((meal) => meal.date === todayDate);

  // Računamo ukupne nutritivne vrednosti
  // za današnje obroke.
  const nutritionTotals = calculateNutritionTotals(todayMeals, recipes);

  // Ukupan broj kalorija uzimamo iz nutritivnog pregleda,
  // kako bi se pravilno računao i broj porcija.
  const totalCalories = nutritionTotals.calories;

  // Računamo koje namirnice nedostaju za današnje obroke.
  const shoppingIngredients = getShoppingIngredientsForDay(
    meals,
    recipes,
    foods,
    todayDate,
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Zdravo! 👋</Text>

      <Text style={styles.subtitle}>Dobrodošli u NutriPlan.</Text>

      {/* Današnji plan */}
      <Card>
        <Text style={styles.cardTitle}>Današnji plan</Text>

        <Text style={styles.caloriesTotal}>
          Ukupno: {roundNutrition(totalCalories)} kcal
        </Text>
        {todayMeals.length > 0 ? (
          todayMeals.map((meal) => <MealCard key={meal.id} meal={meal} />)
        ) : (
          <Text style={styles.cardText}>
            Za danas još nema planiranih obroka.
          </Text>
        )}
      </Card>

      {/* Današnji nutritivni pregled */}
      <Card>
        <Text style={styles.cardTitle}>Današnji nutritivni pregled</Text>

        <NutritionSummary
          totalCalories={totalCalories}
          mealCount={todayMeals.length}
          meals={todayMeals}
          protein={nutritionTotals.protein}
          carbohydrates={nutritionTotals.carbohydrates}
          fat={nutritionTotals.fat}
        />
      </Card>

      {/* Potrebne namirnice */}
      <Card>
        <Text style={styles.cardTitle}>Potrebne namirnice</Text>

        {shoppingIngredients.length > 0 ? (
          <View style={styles.ingredientsList}>
            {shoppingIngredients.map((ingredient) => (
              <View key={ingredient.id} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>

                <Text style={styles.ingredientQuantity}>
                  {ingredient.quantity} {ingredient.unit}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.cardText}>
            Sve potrebne namirnice su trenutno dostupne.
          </Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: SPACING.xs,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  greeting: {
    fontSize: TYPOGRAPHY.headingLarge,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },

  cardTitle: {
    fontSize: TYPOGRAPHY.headingSmall,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  cardText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  caloriesTotal: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },

  ingredientsList: {
    gap: SPACING.sm,
  },

  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },

  ingredientName: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },

  ingredientQuantity: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    color: COLORS.primary,
    marginLeft: SPACING.md,
  },
});
