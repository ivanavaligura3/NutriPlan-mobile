import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { styles } from './MealCard.styles';
import { Meal } from '../../types/meal';
import { useMeals } from '../../context/MealContext';

// Prikazuje jedan obrok dnevnog plana.
// Komponenta prima osnovne podatke o obrooku kako bi mogla
// da se koristi za doručak, ručak, večeru ili užinu.

type MealCardProps = {
    meal: Meal;
};

export default function MealCard({ meal }: MealCardProps) {
    const { removeMeal } = useMeals();

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.mealType}>
                    {meal.mealType}
                </Text>

                <Text style={styles.mealName}>
                    {meal.mealName}
                </Text>
            </View>

            <Text style={styles.calories}>
                {meal.calories} kcal
            </Text>

            <Pressable onPress={() => router.push({
                    pathname: '/add-meal',
                    params: {
                        mealId: meal.id.toString(),
                        dateId: meal.dateId.toString(),
                    },
                })
            }
            >
                <Text style={styles.editText}>
                    Izmeni
                </Text>
            </Pressable>

            <Pressable onPress={() => removeMeal(meal.id)}>
                <Text style={styles.deleteText}>
                    Obriši
                </Text>
            </Pressable>
        </View>
    );
}