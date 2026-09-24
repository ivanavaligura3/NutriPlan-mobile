import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import Input from '../components/Input/Input';
import KeyboardAwareScreen from '../components/KeyboardAwareScreen/KeyboardAwareScreen';

import { useRecipes } from '../context/RecipeContext';

import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { TYPOGRAPHY } from '../styles/typography';

export default function AddRecipeScreen() {
    const { recipeId } = useLocalSearchParams<{
        recipeId?: string;
    }>();

    const {
        recipes,
        addRecipe,
        updateRecipe,
    } = useRecipes();

    const isEditMode = Boolean(recipeId);

    const existingRecipe = recipes.find(
        (recipe) => recipe.id === Number(recipeId)
    );

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [calories, setCalories] = useState('');
    const [preparationTime, setPreparationTime] = useState('');

    const [ingredients, setIngredients] = useState([
        {
            name: '',
            quantity: '',
            unit: '',
        },
    ]);

    const [preparationSteps, setPreparationSteps] = useState([
        '',
    ]);

    const [error, setError] = useState('');

    useEffect(() => {
        if (!existingRecipe) {
            return;
        }

        setName(existingRecipe.name);
        setDescription(existingRecipe.description);
        setCalories(existingRecipe.calories.toString());
        setPreparationTime(
            existingRecipe.preparationTime.toString()
        );

        setIngredients(
            existingRecipe.ingredients.map((ingredient) => ({
                name: ingredient.name,
                quantity: ingredient.quantity.toString(),
                unit: ingredient.unit,
            }))
        );

        setPreparationSteps([
            ...existingRecipe.preparationSteps,
        ]);
    }, [existingRecipe]);

    const handleSaveRecipe = () => {
        setError('');

        if (
            !name.trim() ||
            !description.trim() ||
            !calories.trim() ||
            !preparationTime.trim()
        ) {
            setError('Molimo vas popunite sva polja.');
            return;
        }

        const caloriesNumber = Number(calories);
        const preparationTimeNumber = Number(preparationTime);

        if (
            isNaN(caloriesNumber) ||
            caloriesNumber <= 0
        ) {
            setError('Unesite ispravan broj kalorija.');
            return;
        }

        if (
            isNaN(preparationTimeNumber) ||
            preparationTimeNumber <= 0
        ) {
            setError('Unesite ispravno vreme pripreme.');
            return;
        }

        const hasInvalidIngredientQuantity = ingredients.some(
            (ingredient) =>
                isNaN(Number(ingredient.quantity)) ||
                Number(ingredient.quantity) <= 0
        );

        const hasInvalidIngredient = ingredients.some(
            (ingredient) =>
                !ingredient.name.trim() ||
                !ingredient.quantity.trim() ||
                !ingredient.unit.trim()
        );

        if (hasInvalidIngredient) {
            setError('Molimo vas popunite sva polja za sastojke.');
            return;
        }

        if (hasInvalidIngredientQuantity) {
            setError('Količina sastojaka mora biti veća od 0.');
            return;
        }

        const hasInvalidPreparationStep = preparationSteps.some(
            (step) => !step.trim()
        );

        if (hasInvalidPreparationStep) {
            setError('Molimo vas unesite sve korake pripreme.');
            return;
        }

        const recipeIdNumber = isEditMode
            ? Number(recipeId)
            : Date.now();

        const newRecipe = {
            id: recipeIdNumber,
            name: name.trim(),
            description: description.trim(),
            calories: caloriesNumber,
            preparationTime: preparationTimeNumber,
            ingredients: ingredients.map((ingredient, index) => ({
                id: isEditMode
                    ? existingRecipe?.ingredients[index]
                        ?.id ?? Date.now() + index
                    : Date.now() + index,
                name: ingredient.name.trim(),
                quantity: Number(ingredient.quantity),
                unit: ingredient.unit.trim(),
            })
        ),
            preparationSteps: preparationSteps.map((step) => step.trim()),
        };

        if (isEditMode) {
            updateRecipe(newRecipe);
        } else {
            addRecipe(newRecipe);
        }
        router.replace('/(tabs)/recipes');
    };

    const handleAddIngredient = () => {
        setIngredients((currentIngredients) => [
            ...currentIngredients,
            {
                name: '',
                quantity: '',
                unit: '',
            },
        ]);
    };

    const handleAddPreparationStep = () => {
        setPreparationSteps((currentSteps) => [
            ...currentSteps,
            '',
        ]);
    };

    return (
        <KeyboardAwareScreen>
            <View style={styles.container}>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>
                        ← Nazad
                    </Text>
                </Pressable>

                <Text style={styles.title}>
                    {isEditMode
                        ? 'Izmeni recept'
                        : 'Dodaj recept'}
                </Text>

                <Text style={styles.label}>
                    Naziv recepta
                </Text>

                <Input
                    placeholder="Npr. Piletina sa povrćem"
                    placeholderTextColor={COLORS.textSecondary}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>
                    Opis
                </Text>

                <Input
                    placeholder="Kratak opis recepta"
                    placeholderTextColor={COLORS.textSecondary}
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>
                    Kalorije
                </Text>

                <Input
                    placeholder="Npr. 450"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    value={calories}
                    onChangeText={setCalories}
                />

                <Text style={styles.label}>
                    Vreme pripreme (min)
                </Text>

                <Input
                    placeholder="Npr. 30"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    value={preparationTime}
                    onChangeText={setPreparationTime}
                />

                <Text style={styles.sectionTitle}>
                    Sastojci
                </Text>

                {ingredients.map((ingredient, index) => (
                    <View key={index}>
                        <Text style={styles.ingredientTitle}>
                            Sastojak {index + 1}
                        </Text>

                        <Text style={styles.label}>
                            Naziv sastojka
                        </Text>

                        <Input
                            placeholder="Npr. Pileći file"
                            placeholderTextColor={COLORS.textSecondary}
                            value={ingredient.name}
                            onChangeText={(value) => {
                                setIngredients((currentIngredients) =>
                                    currentIngredients.map(
                                        (item, itemIndex) =>
                                            itemIndex === index
                                                ? {
                                                      ...item,
                                                      name: value,
                                                  }
                                                : item
                                    )
                                );
                            }}
                        />

                        <Text style={styles.label}>
                            Količina
                        </Text>

                        <Input
                            placeholder="Npr. 200"
                            placeholderTextColor={COLORS.textSecondary}
                            value={ingredient.quantity}
                            onChangeText={(value) => {
                                setIngredients((currentIngredients) =>
                                    currentIngredients.map(
                                        (item, itemIndex) =>
                                            itemIndex === index
                                                ? {
                                                      ...item,
                                                      quantity: value,
                                                  }
                                                : item
                                    )
                                );
                            }}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>
                            Jedinica
                        </Text>

                        <Input
                            placeholder="Npr. g, ml, kom"
                            placeholderTextColor={COLORS.textSecondary}
                            value={ingredient.unit}
                            onChangeText={(value) => {
                                setIngredients((currentIngredients) =>
                                    currentIngredients.map(
                                        (item, itemIndex) =>
                                            itemIndex === index
                                                ? {
                                                      ...item,
                                                      unit: value,
                                                  }
                                                : item
                                    )
                                );
                            }}
                        />
                    </View>
                ))}

                <Pressable
                    style={styles.addIngredientButton}
                    onPress={handleAddIngredient}
                >
                    <Text style={styles.addIngredientText}>
                        + Dodaj sastojak
                    </Text>
                </Pressable>

                <Text style={styles.sectionTitle}>
                    Postupak pripreme
                </Text>

                {preparationSteps.map((step, index) => (
                    <View key={index}>
                        <Text style={styles.ingredientTitle}>
                            Korak {index + 1}
                        </Text>

                        <Input 
                            placeholder="Opišite korak pripreme"
                            placeholderTextColor={COLORS.textSecondary}
                            value={step}
                            onChangeText={(value) => {
                            setPreparationSteps((currentSteps) => {
                                const updatedSteps = [...currentSteps];
                                updatedSteps[index] = value;
                                return updatedSteps;
                            });
                        }}
                        />
                    </View>
                ))}

                <Pressable 
                    style={styles.addIngredientButton}
                    onPress={handleAddPreparationStep}
                >
                    <Text style={styles.addIngredientText}>
                        + Dodaj korak
                    </Text>
                </Pressable>

                {error ? (
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                ) : null}

                <Pressable
                    style={styles.saveButton}
                    onPress={handleSaveRecipe}
                >
                    <Text style={styles.saveButtonText}>
                        {isEditMode
                        ? 'Sačuvaj recept'
                        : 'Sačuvaj recept'} 
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>
                        Otkaži
                    </Text>
                </Pressable>
            </View>
        </KeyboardAwareScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SPACING.lg,
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
        marginBottom: SPACING.xl,
    },

    label: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
        marginTop: SPACING.md,
    },

    sectionTitle: {
        fontSize: TYPOGRAPHY.headingSmall,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: SPACING.xl,
        marginBottom: SPACING.md,
    },

    ingredientTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
        color: COLORS.primary,
        marginTop: SPACING.md,
    },

    addIngredientButton: {
        paddingVertical: SPACING.sm,
        marginTop: SPACING.md,
        alignItems: 'center',
    },

    addIngredientText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.primary,
    },

    saveButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        marginTop: SPACING.xl,
    },

    saveButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
    },

    cancelButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },

    cancelButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },

    errorText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.error,
        marginTop: SPACING.md,
    },
});

