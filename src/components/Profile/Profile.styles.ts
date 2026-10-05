import { StyleSheet } from "react-native";

import { COLORS } from "../../styles/colors";
import { SPACING } from "../../styles/spacing";
import { TYPOGRAPHY } from "../../styles/typography";

// Stilovi Profile ekrana.

export const createProfileStyles = (colors: typeof COLORS) =>
  StyleSheet.create({
    // =====================================================
    // GLAVNI KONTEJNER
    // =====================================================

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.xxl,
    },

    // =====================================================
    // NASLOV
    // =====================================================

    title: {
      fontSize: TYPOGRAPHY.headingLarge,
      fontWeight: "700",
      color: colors.text,
      marginBottom: SPACING.lg,
    },

    // =====================================================
    // PROFILNA KARTICA
    // =====================================================

    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: SPACING.md,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: SPACING.md,
    },

    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      marginRight: SPACING.md,
    },

    avatarText: {
      fontSize: TYPOGRAPHY.headingSmall,
      fontWeight: "700",
      color: colors.white,
    },

    profileInfo: {
      flex: 1,
    },

    profileName: {
      fontSize: TYPOGRAPHY.bodyLarge,
      fontWeight: "700",
      color: colors.text,
      marginBottom: SPACING.xs,
    },

    profileDescription: {
      fontSize: TYPOGRAPHY.bodySmall,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    // =====================================================
    // SEKCIJE
    // =====================================================

    sectionTitle: {
      fontSize: TYPOGRAPHY.headingSmall,
      fontWeight: "700",
      color: colors.text,
      marginTop: SPACING.lg,
      marginBottom: SPACING.sm,
    },

    // =====================================================
    // DUGME ZA IZMENU PROFILA
    // =====================================================

    editButton: {
      paddingVertical: SPACING.md,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
      marginBottom: SPACING.md,
    },

    editButtonText: {
      fontSize: TYPOGRAPHY.body,
      fontWeight: "600",
      color: colors.primary,
    },

    // =====================================================
    // INPUT POLJA
    // =====================================================

    input: {
      height: 44,
      paddingHorizontal: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.background,
      color: colors.text,
      fontSize: TYPOGRAPHY.bodySmall,
      marginBottom: SPACING.sm,
    },

    // =====================================================
    // AKCIJE IZMENJIVANJA PROFILA
    // =====================================================

    editActions: {
      marginBottom: SPACING.md,
      gap: SPACING.sm,
    },

    saveButton: {
      paddingVertical: SPACING.md,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.primary,
    },

    saveButtonText: {
      fontSize: TYPOGRAPHY.body,
      fontWeight: "600",
      color: colors.white,
    },

    cancelButton: {
      paddingVertical: SPACING.md,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cancelButtonText: {
      fontSize: TYPOGRAPHY.body,
      fontWeight: "600",
      color: colors.text,
    },

    // =====================================================
    // KARTICE SA PODEŠAVANJIMA
    // =====================================================

    settingsCard: {
      paddingHorizontal: SPACING.md,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 60,
      paddingVertical: SPACING.sm,
    },

    settingTextContainer: {
      flex: 1,
      marginRight: SPACING.md,
    },

    settingTitle: {
      fontSize: TYPOGRAPHY.body,
      fontWeight: "600",
      color: colors.text,
    },

    settingDescription: {
      marginTop: SPACING.xs,
      fontSize: TYPOGRAPHY.caption,
      color: colors.textSecondary,
    },

    settingValue: {
      fontSize: TYPOGRAPHY.bodySmall,
      color: colors.textSecondary,
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
    },

    // =====================================================
    // STATISTIKA
    // =====================================================

    statsCard: {
      padding: SPACING.md,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    statsRow: {
      flexDirection: "row",
      gap: SPACING.sm,
    },

    statItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: SPACING.sm,
    },

    statValue: {
      fontSize: TYPOGRAPHY.headingSmall,
      fontWeight: "700",
      color: colors.primary,
    },

    statLabel: {
      marginTop: SPACING.xs,
      fontSize: TYPOGRAPHY.caption,
      color: colors.textSecondary,
      textAlign: "center",
    },

    // =====================================================
    // NALOG
    // =====================================================

    passwordForm: {
      paddingVertical: SPACING.md,
    },

    passwordActions: {
      gap: SPACING.sm,
    },

    accountCard: {
      paddingHorizontal: SPACING.md,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    accountButton: {
      minHeight: 56,
      justifyContent: "center",
    },

    accountButtonText: {
      fontSize: TYPOGRAPHY.body,
      fontWeight: "600",
      color: colors.text,
    },

    deleteAccountText: {
      color: colors.error,
    },

    // =====================================================
    // ODJAVA
    // =====================================================

    logoutButton: {
      marginTop: SPACING.lg,
    },
  });
