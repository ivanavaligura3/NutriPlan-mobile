import { StyleSheet } from 'react-native';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';

// Zajednički stil Card komponente.
// Isti izgled možemo koristiti na Home, Plan, Recepti
// i drugim ekranima gde je potrebno grupisati sadržaj.

export const styles = StyleSheet.create({
    card: {
        width:'100%',
        padding: SPACING.lg,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
    },
});