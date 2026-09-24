import { useState } from 'react';
import {
    Alert,
    Pressable,
    Text,
    TextInput,
    StyleSheet,
    View,
} from 'react-native';
import { router } from 'expo-router';

import { useShopping } from '../context/ShoppingContext';
import KeyboardAwareScreen from '../components/KeyboardAwareScreen/KeyboardAwareScreen';

import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { TYPOGRAPHY } from '../styles/typography';

export default function AddShoppingItemScreen() {
    const { addItem } = useShopping();

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');

    const handleAddItem = () => {
        if (!name.trim() || !quantity.trim() || !unit.trim()) {
            Alert.alert(
                'Greška',
                'Molimo popunite sva polja.'
            );
            return;
        }

        const quantityNumber = Number(quantity);

        addItem({
            id: Date.now(),
            name: name.trim(),
            quantity: quantityNumber,
            unit: unit.trim(),
            isPurchased: false,
        });

        router.replace('/(tabs)/shopping');
    };

    return (
        <KeyboardAwareScreen>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Dodaj stavku
                </Text>

                <Text style={styles.label}>
                    Naziv namirnice
                </Text>

                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="npr. Jogurt"
                    placeholderTextColor={COLORS.textSecondary}
                />

                <Text style={styles.label}>
                    Količina
                </Text>

                <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="npr. 2"
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
                    placeholder="npr. kom, kg, l"
                    placeholderTextColor={COLORS.textSecondary}
                />

                <Pressable
                    style={styles.button}
                    onPress={handleAddItem}
                >
                    <Text style={styles.buttonText}>
                        Dodaj stavku
                    </Text>
                </Pressable>
            </View>
        </KeyboardAwareScreen>
    );
}

const styles = StyleSheet.create({
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