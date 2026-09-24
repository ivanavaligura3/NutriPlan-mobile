import { StyleSheet } from 'react-native';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { setParams } from 'expo-router/build/global-state/router';

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
});