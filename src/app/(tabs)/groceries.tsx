import { useState } from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    TextInput,
} from 'react-native';

import { useFoods } from '../../context/FoodContext';
import FoodCard from '../../components/FoodCard/FoodCard';

import { COLORS } from '../../styles/colors'; 
import { SPACING } from '../../styles/spacing'; 
import { TYPOGRAPHY } from '../../styles/typography';

import { router } from 'expo-router';

export default function GroceriesScreen() {
    const { foods, removeFood } = useFoods();

    const [search, setSearch] = useState('');

    const filteredFoods = foods.filter((food) =>
        food.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleDeleteFood = (foodId: number) => {
        Alert.alert(
            'Obriši namirnicu',
            'Da li ste sigurni da želite da obrišete ovu namirnicu?',
            [
                {
                    text: 'Otkaži',
                    style: 'cancel',
                },
                {
                    text: 'Obriši',
                    style: 'destructive',
                    onPress: () => removeFood(foodId),
                },
            ]
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>
                Namirnice
            </Text>

            <Text style={styles.subtitle}>
                Pregled namirnica koje trenutno imate.
            </Text>

            <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Pretraži namirnice..."
                placeholderTextColor={COLORS.textSecondary}
            />

            <Pressable 
                style={styles.addButton}
                onPress={() => router.push('/add-food')}
            >
                <Text style={styles.addButtonText}>
                    + Dodaj namirnicu
                </Text>
            </Pressable>

            <View style={styles.listContainer}>
                {filteredFoods.length === 0 ? (
                    <Text style={styles.emptyText}>
                        Nema pronađenih namirnica.
                    </Text>
                ) : (
                    filteredFoods.map((food) => (
                        <FoodCard
                            key={food.id}
                            food={food}
                            onPress={() =>
                                router.push({
                                    pathname: '/add-food',
                                    params: {
                                        foodId: food.id.toString(),
                                    },
                                })
                            }
                            onDelete={() => handleDeleteFood(food.id)}
                        />
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        backgroundColor: COLORS.background,
    }, 
    
    content: { 
        padding: SPACING.lg, 
        paddingBottom: SPACING.xxl, 
    }, 
    
    title: { 
        fontSize: TYPOGRAPHY.headingLarge, 
        fontWeight: '700', 
        color: COLORS.text, 
        marginBottom: SPACING.sm, 
    }, 
    
    subtitle: { 
        fontSize: TYPOGRAPHY.body, 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.xl, 
    }, 

    searchInput: {
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

    emptyText: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    
    listContainer: { 
        gap: SPACING.md, 
    }, 

    addButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        marginBottom: SPACING.xl,
    },

    addButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
    },
});