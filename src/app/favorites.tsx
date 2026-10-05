import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { router } from 'expo-router';

import RecipeCard from '../components/RecipeCard/RecipeCard';
import { useRecipes } from '../context/RecipeContext';

import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { TYPOGRAPHY } from '../styles/typography';

// Ekran za prikaz omiljenih recepata.

export default function FavoritesScreen() {
    const {
        recipes,
        favoriteRecipeIds,
    } = useRecipes();

    // Filtriramo sve recepte i zadržavamo samo
    // one koji se nalaze među omiljenima.
    const favoriteRecipes = recipes.filter(
        (recipe) =>
            favoriteRecipeIds.includes(recipe.id)
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backText}>
                        ‹
                    </Text>
                </Pressable>

                <Text style={styles.title}>
                    Omiljeni recepti
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                {favoriteRecipes.length > 0 ? (
                    favoriteRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>
                            ♡
                        </Text>

                        <Text style={styles.emptyTitle}>
                            Još nema omiljenih recepata
                        </Text>

                        <Text style={styles.emptyText}>
                            Označi recepte srcem kako bi ih
                            pronašla ovde.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.lg,
        backgroundColor: COLORS.background,
    },

    title: {
        fontSize: TYPOGRAPHY.headingLarge,
        fontWeight: '700' as const,
        color: COLORS.text,
        marginBottom: SPACING.lg,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },

    backButton: {
        marginRight: SPACING.sm,
        padding: SPACING.xs,
    },

    backText: {
        fontSize: 32,
        color: COLORS.primary,
        lineHeight: 32,
    },

    list: {
        paddingBottom: SPACING.xl,
    },

    emptyContainer: {
        alignItems: 'center',
        paddingTop: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },

    emptyIcon: {
        fontSize: 48,
        color: COLORS.primary,
        marginBottom: SPACING.md,
    },

    emptyTitle: {
        fontSize: TYPOGRAPHY.headingSmall,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },

    emptyText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});