import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMeals } from '../context/MealContext';
import { Meal } from '../types/meal';

import Input from '../components/Input/Input';
import KeyboardAwareScreen from '../components/KeyboardAwareScreen/KeyboardAwareScreen';

import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { TYPOGRAPHY } from '../styles/typography';

export default function AddMealScreen() {
    const { meals, addMeal, updateMeal } = useMeals();
    const { dateId, mealId } = useLocalSearchParams<{
        dateId: string;
        mealId?: string;
    }>();
    const mealToEdit = mealId
        ? meals.find((meal) => meal.id === Number(mealId))
        : undefined;
    useEffect(() => {
        if (mealToEdit) {
            setMealName(mealToEdit.mealName);
            setMealType(mealToEdit.mealType);
            setCalories(mealToEdit.calories.toString());
        }
    }, [mealToEdit]);
    const [mealName, setMealName] = useState('');
    const [mealType, setMealType] = useState('');
    const [calories, setCalories] = useState('');
    const [error, setError] = useState('');

    const handleAddMeal = () => {
        setError('');

        if (!mealName.trim() || !mealType || !calories.trim()) {
            setError('Molimo vas popunite sva polja.');
            return;
        }

        const caloriesNumber = Number(calories);

        if (isNaN(caloriesNumber) || caloriesNumber <= 0) {
            setError('Unesite ispravan broj kalorije.');
            return;
        }

        if (mealId && mealToEdit) {
            const updatedMeal: Meal = {
                id: mealToEdit.id,
                dateId: mealToEdit.dateId,
                mealType,
                mealName: mealName.trim(),
                calories: caloriesNumber,
            };

            updateMeal(updatedMeal);
        }   else {
            const newMeal = {
                id: Date.now(),
                dateId: Number(dateId),
                mealType,
                mealName: mealName.trim(),
                calories: caloriesNumber,
            };

            addMeal(newMeal);
        }

        router.back();
    };

    return (
        <KeyboardAwareScreen>
            <View style={styles.container}>
                <Text style={styles.title}>
                    {mealId ? 'Izmeni obrok' : 'Dodaj obrok'}
                </Text>

                <Text style={styles.label}>
                    Naziv obroka
                </Text>

                <Input
                    placeholder="Npr. Ovsena kaša sa bananom"
                    placeholderTextColor={COLORS.textSecondary}
                    value={mealName}
                    onChangeText={setMealName}
                />

                <Text style={styles.label}>
                    Tip oborka
                </Text>

                <View style={styles.typeContainer}>
                    {['Doručak', 'Užina', 'Ručak', 'Večera'].map((type) => {
                        const isSelected = mealType === type;

                        return (
                            <Pressable
                                key={type}
                                onPress={() => setMealType(type)}
                                style={[
                                    styles.typeButton,
                                    isSelected && styles.typeButtonSelected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        isSelected &&
                                            styles.typeButtonTextSelected,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </Pressable>
                        );
                    } )}
                </View>

                <Text style={styles.label}>
                    Kalorije
                </Text>

                <Input
                    placeholder="Npr. 450"
                    placeholderTextColor={COLORS.textSecondary}
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                />

                {error ? (
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                ) : null}

                <Pressable
                    style={styles.addButton}
                    onPress={handleAddMeal}
                >
                    <Text style={styles.addButtonText}>
                        {mealId ? 'Sačuvaj izmene' : 'Dodaj obrok'}
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
        flex: 1,
        padding: SPACING.lg,
        backgroundColor: COLORS.background,
    },

    title: {
        fontSize: TYPOGRAPHY.headingLarge,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xl,
    },

    label: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
        marginTop: SPACING.md,
    },

    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },

    typeButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },

    typeButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },

    typeButtonText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.text,
    },

    typeButtonTextSelected: {
        color: COLORS.white,
        fontWeight: '600',
    },

    errorText: {
        marginTop: SPACING.sm,
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.error,
    },

    addButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        marginTop: SPACING.xl,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: COLORS.primary,
    },

    addButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
    },

    cancelButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        marginTop: SPACING.sm,
        alignItems: 'center',
    },

    cancelButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
});