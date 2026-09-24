import { StyleSheet } from 'react-native';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

// Stilovi pojedinačnog obroka u dnevnom planu.

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    info: {
        flex: 1,
        marginRight: SPACING.md,
    },

    mealType: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },

    mealName: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
    },

    calories: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.primary,
        fontWeight: '600',
    },

    deleteText: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.error,
        fontWeight: '600',
        marginLeft: SPACING.sm,
    },

    editText: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: SPACING.sm,
    },
});