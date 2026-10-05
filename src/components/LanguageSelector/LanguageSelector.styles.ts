import { StyleSheet } from "react-native";

import { COLORS } from "../../styles/colors";
import { SPACING } from "../../styles/spacing";
import { TYPOGRAPHY } from "../../styles/typography";

// Stilovi za izbor jezika.

export const createLanguageSelectorStyles = () =>
  StyleSheet.create({
    container: {
      width: 150,
      position: "relative",
    },

    selector: {
      minHeight: 44,
      paddingHorizontal: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 10,
      backgroundColor: COLORS.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    selectedLanguage: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    flag: {
      fontSize: 20,
      marginRight: SPACING.sm,
    },

    selectedLabel: {
      fontSize: TYPOGRAPHY.bodySmall,
      color: COLORS.text,
      fontWeight: "500",
    },

    arrow: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },

    optionsContainer: {
      position: "absolute",
      top: 50,
      left: 0,
      right: 0,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 10,
      backgroundColor: COLORS.background,
      overflow: "hidden",
      zIndex: 1000,
      elevation: 5,
    },

    option: {
      minHeight: 44,
      paddingHorizontal: SPACING.sm,
      flexDirection: "row",
      alignItems: "center",
    },

    selectedOption: {
      backgroundColor: COLORS.surface,
    },

    optionLabel: {
      flex: 1,
      fontSize: TYPOGRAPHY.bodySmall,
      color: COLORS.text,
    },

    selectedOptionLabel: {
      fontWeight: "600",
      color: COLORS.primary,
    },

    checkmark: {
      fontSize: 16,
      fontWeight: "700",
      color: COLORS.primary,
    },
  });
