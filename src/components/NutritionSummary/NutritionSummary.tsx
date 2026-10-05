import { StyleSheet, Text, View } from "react-native";

import { Meal } from "../../types/meal";

import { COLORS } from "../../styles/colors";
import { SPACING } from "../../styles/spacing";
import { TYPOGRAPHY } from "../../styles/typography";
import { roundNutrition } from "../../utils/nutrition";

type NutritionSummaryProps = {
  totalCalories: number;
  mealCount: number;
  meals: Meal[];
  protein: number;
  carbohydrates: number;
  fat: number;
};

export default function NutritionSummary({
  totalCalories,
  mealCount,
  meals,
  protein,
  carbohydrates,
  fat,
}: NutritionSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <View style={styles.item}>
          <Text style={styles.value}>{roundNutrition(totalCalories)}</Text>
          <Text style={styles.label}>kcal</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.item}>
          <Text style={styles.value}>{mealCount}</Text>

          <Text style={styles.label}>obroka</Text>
        </View>
      </View>

      <View style={styles.macrosRow}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{roundNutrition(protein)} g</Text>
          <Text style={styles.macroLabel}>proteini</Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>
            {roundNutrition(carbohydrates)} g
          </Text>
          <Text style={styles.macroLabel}>ugljeni hidrati</Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{roundNutrition(fat)} g</Text>
          <Text style={styles.macroLabel}>masti</Text>
        </View>
      </View>

      <View style={styles.mealsList}>
        {meals.map((meal) => (
          <View key={meal.id} style={styles.mealRow}>
            <Text style={styles.mealName}>{meal.mealType}</Text>
            <Text style={styles.mealCalories}>
              {meal.recipeServings > 0
                ? roundNutrition(
                    (meal.calories / meal.recipeServings) * meal.servings,
                  )
                : 0}{" "}
              kcal
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: SPACING.md,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  item: {
    alignItems: "center",
    flex: 1,
  },

  value: {
    fontSize: TYPOGRAPHY.headingMedium,
    fontWeight: "700",
    color: COLORS.primary,
  },

  label: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },

  mealsList: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },

  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  mealName: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },

  mealCalories: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    color: COLORS.primary,
  },

  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },

  macroItem: {
    alignItems: "center",
    flex: 1,
  },

  macroValue: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.primary,
  },

  macroLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
});
