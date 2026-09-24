import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useRecipes } from '../context/RecipeContext';

import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { TYPOGRAPHY } from '../styles/typography';

export default function RecipeDetailsScreen() {
    const { recipeId } = useLocalSearchParams<{
        recipeId: string;
    }>();

    const { recipes, removeRecipe } = useRecipes();

    const recipe = recipes.find(
        (item) => item.id === Number(recipeId)
    );

    if (!recipe) {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>
                    Recept nije pronađen.
                </Text>

                <Pressable onPress={() => router.back()}>
                    <Text style={styles.backText}>
                        ← Nazad
                    </Text>
                </Pressable>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <Text style={styles.backText}>
                    ← Nazad
                </Text>
            </Pressable>

            <Text style={styles.title}>
                {recipe.name}
            </Text>

            <Text style={styles.description}>
                {recipe.description}
            </Text>

            <View style={styles.infoContainer}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>
                        Kalorije
                    </Text>

                    <Text style={styles.infoValue}>
                        {recipe.calories} kcal
                    </Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>
                        Vreme pripreme
                    </Text>

                    <Text style={styles.infoValue}>
                        {recipe.preparationTime} min
                    </Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>
                Sastojci
            </Text>

            <View style={styles.ingredientsContainer}>
                {recipe.ingredients.map((ingredient) => (
                    <View
                        key={ingredient.id}
                        style={styles.ingredientRow}
                    >
                        <Text style={styles.ingredientName}>
                            {ingredient.name}
                        </Text>

                        <Text style={styles.ingredientQuantity}>
                            {ingredient.quantity} {ingredient.unit}
                        </Text>
                    </View>
                ))}
            </View>

            <Text style={styles.sectionTitle}>
                Postupak pripreme
            </Text>

            <View style={styles.stepsContainer}>
                {recipe.preparationSteps.map((step, index) => (
                    <View
                        key={index}
                        style={styles.stepRow}
                    >
                        <Text style={styles.stepNumber}>
                            {index + 1}.
                        </Text>

                        <Text style={styles.stepText}>
                            {step}
                        </Text>
                    </View>
                ))}
            </View>

            <Pressable
                style={styles.editButton}
                onPress={() =>
                    router.push({
                        pathname: '/add-recipe',
                        params: {
                            recipeId: recipe.id.toString(),
                        },
                    })
                }
            >
                <Text style={styles.editButtonText}>
                    Izmeni recept
                </Text>
            </Pressable>

            <Pressable
                style={styles.deleteButton}
                onPress={() => {
                    removeRecipe(recipe.id);
                    router.replace('/(tabs)/recipes');
                }}
            >
                <Text style={styles.deleteButtonText}>
                    Obriši recept
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    content: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        paddingBottom: 60,
    },

    backButton: {
        marginBottom: SPACING.xl,
    },

    backText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.primary,
    },

    title: {
        fontSize: TYPOGRAPHY.headingLarge,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },

    description: {
        fontSize: TYPOGRAPHY.body,
        lineHeight: 24,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
    },

    infoContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
    },

    infoCard: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    infoLabel: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },

    infoValue: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
        color: COLORS.primary,
    },

    sectionTitle: {
        fontSize: TYPOGRAPHY.headingSmall,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: SPACING.xl,
        marginBottom: SPACING.md,
    },

    ingredientsContainer: {
        width: '100%',
    },

    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    ingredientName: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.text,
    },

    ingredientQuantity: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: '600',
        color: COLORS.primary,
    },

    stepsContainer: {
        width: '100%',
    },

    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },

    stepNumber: {
        width: 28,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
        color: COLORS.primary,
    },

    stepText: {
        flex: 1,
        fontSize: TYPOGRAPHY.body,
        lineHeight: 24,
        color: COLORS.text,
    },

    deleteButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.error,
        marginTop: SPACING.xl,
    },

    deleteButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
    },

    editButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        marginTop: SPACING.xl,
    },

    editButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
    },
});