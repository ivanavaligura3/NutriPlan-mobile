import { StyleSheet } from 'react-native';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

// Stilovi reusable Input komponente.
// Ovi stilovi predstavljaju osnovni izgled svih input polja
// u NutriPlan aplikaciji.

export const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 52,
        paddingHorizontal: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },
});