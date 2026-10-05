import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useRecipes } from '../../context/RecipeContext';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

// Ekran za pregled i upravljanje receptima.

export default function RecipesScreen() {
    const { recipes } = useRecipes();
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPreparationTime, setMaxPreparationTime] = useState<number | null>(
        null
    );

    const [maxCalories, setMaxCalories] = useState<number | null>(
        null
    );

    const filteredRecipes = recipes.filter((recipe) => {
        const matchesSearch = recipe.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesPreparationTime =
            maxPreparationTime === null ||
            recipe.preparationTime <= maxPreparationTime;

        const matchesCalories =
            maxCalories === null ||
            recipe.calories <= maxCalories;

        return (
            matchesSearch &&
            matchesPreparationTime &&
            matchesCalories
        );
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Recepti
                </Text>

                <Pressable
                    style={styles.favoriteButton}
                    onPress={() => router.push('/favorites')}
                >
                    <Ionicons
                        name="heart-outline"
                        size={28}
                        color={COLORS.primary}
                    />
                </Pressable>
            </View>

            <Pressable
                style={styles.addButton}
                onPress={() => router.push('/add-recipe')}
            >
                <Text style={styles.addButtonText}>
                    + Dodaj recept
                </Text>
            </Pressable>

            <View style={styles.searchContainer}>
                <Ionicons
                    name="search-outline"
                    size={22}
                    color={COLORS.textSecondary}
                />

                <TextInput
                    style={styles.searchInput}
                    placeholder="Pretraži recepte..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                {searchQuery.length > 0 && (
                    <Pressable
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                    >
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color={COLORS.textSecondary}
                        />
                    </Pressable>
                )}
            </View>

            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>
                    Vreme pripreme
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {[
                        { label: 'Sve', value: null },
                        { label: '≤ 15 min', value: 15 },
                        { label: '≤ 30 min', value: 30 },
                        { label: '≤ 60 min', value: 60 },
                    ].map((filter) => {
                        const isSelected =
                            maxPreparationTime === filter.value;

                        return (
                            <Pressable
                                key={filter.label}
                                style={[
                                    styles.filterButton,
                                    isSelected && styles.filterButtonSelected,
                                ]}
                                onPress={() =>
                                    setMaxPreparationTime(filter.value)
                                }
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        isSelected &&
                                            styles.filterButtonTextSelected,
                                    ]}
                                >
                                    {filter.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.filterSection}>
    <Text style={styles.filterTitle}>
        Kalorije
    </Text>

    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
    >
        {[
            { label: 'Sve', value: null },
            { label: '≤ 300 kcal', value: 300 },
            { label: '≤ 500 kcal', value: 500 },
            { label: '≤ 700 kcal', value: 700 },
        ].map((filter) => {
            const isSelected =
                maxCalories === filter.value;

            return (
                <Pressable
                    key={filter.label}
                    style={[
                        styles.filterButton,
                        isSelected &&
                            styles.filterButtonSelected,
                    ]}
                    onPress={() =>
                        setMaxCalories(filter.value)
                    }
                >
                    <Text
                        style={[
                            styles.filterButtonText,
                            isSelected &&
                                styles.filterButtonTextSelected,
                        ]}
                    >
                        {filter.label}
                    </Text>
                </Pressable>
            );
        })}
    </ScrollView>
</View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                {filteredRecipes.length > 0 ? (
    filteredRecipes.map((recipe) => (
        <RecipeCard
            key={recipe.id}
            recipe={recipe}
        />
    ))
) : (
    <View style={styles.emptyState}>
        <Ionicons
            name="search-outline"
            size={40}
            color={COLORS.textSecondary}
        />

        <Text style={styles.emptyTitle}>
            Nema pronađenih recepata
        </Text>

        <Text style={styles.emptyText}>
            Pokušajte sa drugačijom pretragom
            ili promenite filtere.
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
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },

    favoriteButton: {
        padding: SPACING.xs,
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

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: SPACING.md,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.lg,
    },

    searchInput: {
        flex: 1,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
        color: COLORS.text,
        fontSize: TYPOGRAPHY.body,
    },

    clearButton: {
        padding: SPACING.xs,
    },

    filterSection: {
    marginBottom: SPACING.lg,
    },

    filterTitle: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },

    filterContainer: {
        gap: SPACING.sm,
    },

    filterButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },

    filterButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },

    filterButtonText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.text,
    },

    filterButtonTextSelected: {
        color: COLORS.white,
        fontWeight: '600',
    },

    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },

    emptyTitle: {
        marginTop: SPACING.md,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center',
    },

    emptyText: {
        marginTop: SPACING.xs,
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});