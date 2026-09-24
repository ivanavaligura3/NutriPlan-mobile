import { StyleSheet } from 'react-native';

import { COLORS } from '../../styles/colors'; 
import { SPACING } from '../../styles/spacing'; 
import { TYPOGRAPHY } from '../../styles/typography';

export const styles = StyleSheet.create({
    container: { 
        padding: SPACING.md, 
        borderRadius: 12, 
        backgroundColor: COLORS.surface, 
        borderWidth: 1, 
        borderColor: COLORS.border, 
    }, 
    
    foodName: { 
        fontSize: TYPOGRAPHY.body, 
        fontWeight: '700', 
        color: COLORS.text, 
        marginBottom: SPACING.xs, 
    }, 
    
    quantity: { 
        fontSize: TYPOGRAPHY.bodySmall, 
        color: COLORS.textSecondary, 
    },

    deleteButton: {
        marginTop: SPACING.md,
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
        backgroundColor: COLORS.error,
    },

    deleteButtonText: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: '600',
        color: COLORS.white,
    },
});