import { StyleSheet } from 'react-native';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

// Stilovi reusable Button komponente.
// Ovde definišemo osnovni izgled glavnih dugmadi u aplikaciji.

export const styles = StyleSheet.create({
    button: {
        width: '100%',
        paddingVertical: SPACING.md,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
    },

    buttonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
    },
});