import { StyleSheet } from "react-native";

import { COLORS } from "../../styles/colors";
import { SPACING } from "../../styles/spacing";
import { TYPOGRAPHY } from "../../styles/typography";

// Stilovi pojedinačnog obroka u dnevnom planu.

export const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  info: {
    marginBottom: SPACING.sm,
  },

  mealType: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  mealName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },

  nutritionInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },

  servings: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },

  calories: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  editText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "600",
  },

  completeText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "600",
  },

  completedText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "600",
  },

  deleteText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: "600",
  },
});
