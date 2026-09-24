import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { router } from 'expo-router';

import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useRecipes } from '../../context/RecipeContext';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

// Ekran za pregled i upravljanje receptima.

export default function RecipesScreen() {
    const { recipes } = useRecipes();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Recepti
            </Text>

            <Pressable
                style={styles.addButton}
                onPress={() => router.push('/add-recipe')}
            >
                <Text style={styles.addButtonText}>
                    + Dodaj recept
                </Text>
            </Pressable>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                    />
                ))}
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

    list: {
        paddingBottom: SPACING.xl,
    },

    addButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        marginBottom: SPACING.lg,
    },

    addButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
    },
});