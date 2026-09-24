import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';

import { useFoods } from '../../context/FoodContext';
import FoodCard from '../../components/FoodCard/FoodCard';

import { COLORS } from '../../styles/colors'; 
import { SPACING } from '../../styles/spacing'; 
import { TYPOGRAPHY } from '../../styles/typography';

import { router } from 'expo-router';

export default function GroceriesScreen() {
    const { foods, removeFood } = useFoods();
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

            <Pressable 
                style={styles.addButton}
                onPress={() => router.push('/add-food')}
            >
                <Text style={styles.addButtonText}>
                    + Dodaj namirnicu
                </Text>
            </Pressable>

            <View style={styles.listContainer}>
                {foods.map((food) => (
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
                ))}
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