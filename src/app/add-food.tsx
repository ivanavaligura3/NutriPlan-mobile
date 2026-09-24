import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import KeyboardAwareScreen from '../components/KeyboardAwareScreen/KeyboardAwareScreen';

import { useFoods } from '../context/FoodContext';

import { COLORS } from '../styles/colors'; 
import { SPACING } from '../styles/spacing'; 
import { TYPOGRAPHY } from '../styles/typography'; 

export default function AddFoodScreen() {
    const { foods, addFood, updateFood } = useFoods();
    const { foodId } = useLocalSearchParams<{
        foodId?: string;
    }>();
    const isEditMode = Boolean(foodId);
    const existingFood = foods.find(
        (food) => food.id === Number(foodId)
    );

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');

    useEffect(() => {
        if (existingFood) {
            setName(existingFood.name);
            setQuantity(existingFood.quantity.toString());
            setUnit(existingFood.unit);
        }
    }, [existingFood]);

    const handleAddFood = () => {
        if (!name.trim() || !quantity.trim() || !unit.trim()) {
            Alert.alert(
                'Greška',
                'Molimo popunite sva polja.'
            );
            return;
        }

        const quantityNumber = Number(quantity);

        if (
            Number.isNaN(quantityNumber) ||
            quantityNumber <= 0
        ) {
            Alert.alert(
                'Greška',
                'Količina mora biti pozitivan broj.'
            );
            return;
        }

        if (isEditMode && existingFood) {
            updateFood({
                id: existingFood.id,
                name: name.trim(),
                quantity: quantityNumber,
                unit: unit.trim(),
            });
        } else {
        addFood({
                id: Date.now(),
                name: name.trim(),
                quantity: quantityNumber,
                unit: unit.trim(),
            });
        }

        router.replace('/(tabs)/groceries');
    };

    return (
        <KeyboardAwareScreen>
            <View style={styles.container}>
                <Text style={styles.title}>
                    {isEditMode
                        ? 'Izmeni namirnicu'
                        : 'Dodaj namirnicu'}
                </Text>

                <Text style={styles.label}>
                    Naziv namirnice
                </Text>

                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="npr. Pileći file"
                    placeholderTextColor={COLORS.textSecondary}
                />

                <Text style={styles.label}>
                    Količina
                </Text>

                <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="npr. 500"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>
                    Jedinica mere
                </Text>

                <TextInput
                    style={styles.input} 
                    value={unit} 
                    onChangeText={setUnit} 
                    placeholder="npr. g, kg, kom, l" 
                    placeholderTextColor={COLORS.textSecondary}
                />

                <Pressable
                    style={styles.button}
                    onPress={handleAddFood}
                >
                    <Text style={styles.buttonText}>
                        {isEditMode
                            ? 'Sačuvaj izmene'
                            : 'Dodaj namirnicu'}
                    </Text>
                </Pressable>
            </View>
        </KeyboardAwareScreen>
    );
}

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xxl,
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
    },

    input: {
        width: '100%', 
        borderWidth: 1, 
        borderColor: COLORS.border, 
        borderRadius: 10, 
        paddingHorizontal: SPACING.md, 
        paddingVertical: SPACING.md, 
        fontSize: TYPOGRAPHY.body, 
        color: COLORS.text, 
        backgroundColor: COLORS.background, 
        marginBottom: SPACING.lg,
    },

    button: {
        width: '100%', 
        paddingVertical: SPACING.md, 
        borderRadius: 10, 
        alignItems: 'center', 
        backgroundColor: COLORS.primary, 
        marginTop: SPACING.md,
    },

    buttonText: {
        fontSize: TYPOGRAPHY.body, 
        fontWeight: '600', 
        color: COLORS.white,
    },
});
