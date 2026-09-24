import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Card from '../../components/Card/Card';
import MealCard from '../../components/MealCard/MealCard';

import { Meal } from '../../types/meal';
import { calculateTotalCalories } from '../../utils/calories';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

// Početni ekran aplikacije.
// Prikazuje kratak pregled najvažnijih informacija,
// koje će korisniku biti dostupne nakon prijave.

const todayMeals: Meal[] = [
    {
        id: 1,
        dateId: 1,
        mealType: 'Doručak',
        mealName: 'Ovsena kaša sa bananom',
        calories: 420,
    },
    {
        id: 2,
        dateId: 1,
        mealType: 'Ručak',
        mealName: 'Piletina sa povrćem i pirinčem',
        calories: 580,
    },
    {
        id: 3,
        dateId: 1,
        mealType: 'Večera',
        mealName: 'Omlet sa povrćem',
        calories: 350,
    },
];


const totalCalories = calculateTotalCalories(todayMeals);

export default function HomeScreen() {
    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.greeting}>
                Zdravo! 👋
            </Text>

            <Text style={styles.subtitle}>
                Dobrodošli u NutriPlan.
            </Text>

            <Card>
                <Text style={styles.cardTitle}>
                    Današnji plan
                </Text>

                <Text style={styles.caloriesTotal}>
                    Ukupno: {totalCalories} kcal
                </Text>

                {todayMeals.map((meal) => (
                    <MealCard
                        key={meal.id}
                        meal={meal}
                    />
                ))}
            </Card>

            <Card>
                <Text style={styles.cardTitle}>
                    Namirnice
                </Text>

                <Text style={styles.cardText}>
                    Ovde će se prikazivati pregled namirnica
                    koje trenutno imate na raspolaganju.
                </Text>
            </Card>

            <Card>
                <Text style={styles.cardTitle}>
                    Recepti
                </Text>

                <Text style={styles.cardText}>
                    Ovde će se prikazivati vaši omiljeni
                    i nedavno korišćeni recepti.
                </Text>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.background,
    },

    content: {
        paddingHorizontal: SPACING.xs,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xl,
    },

    greeting: {
        fontSize: TYPOGRAPHY.headingLarge,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },

    subtitle: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
    },

    cardTitle: {
        fontSize: TYPOGRAPHY.headingSmall,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },

    cardText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },

    caloriesTotal: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },
});

