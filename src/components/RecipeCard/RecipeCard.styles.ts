import { StyleSheet } from 'react-native';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },

    name: {
        fontSize: TYPOGRAPHY.headingSmall,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },

    description: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        lineHeight: 20,
        marginBottom: SPACING.md,
    },

    infoContainer: {
        flexDirection: 'row',
        gap: SPACING.lg,
    },

    info: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: '600',
        color: COLORS.primary,
    },

    actions: {
        marginTop: SPACING.md,
        alignItems: 'flex-end',
    },

    deleteText: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: '600',
        color: COLORS.error,
    },

    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
},

recipeInfo: {
    flex: 1,
},

favoriteButton: {
    marginLeft: SPACING.md,
    padding: SPACING.xs,
},

});