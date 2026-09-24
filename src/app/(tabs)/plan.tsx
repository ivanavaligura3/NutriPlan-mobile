import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import MealCard from '../../components/MealCard/MealCard';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Meal } from '../../types/meal';
import { useMeals } from '../../context/MealContext';

// Privremeni podaci za prikaz plana.
// Kasnije će ove podatke obezbeđivati backend.

const days = [
    {
        id: 1,
        shortName: 'PON',
        date: '21',
        fullDate: 'Ponedeljak, 21. septembar',
    },
    {
        id: 2,
        shortName: 'UTO',
        date: '22',
        fullDate: 'Utorak, 22. septembar',
    },
    {
        id: 3,
        shortName: 'SRE',
        date: '23',
        fullDate: 'Sreda, 23. septembar',
    },
    {
        id: 4,
        shortName: 'ČET',
        date: '24',
        fullDate: 'Četvrtak, 24. septembar',
    },
    {
        id: 5,
        shortName: 'PET',
        date: '25',
        fullDate: 'Petak, 25. septembar',
    },
    {
        id: 6,
        shortName: 'SUB',
        date: '26',
        fullDate: 'Subota, 26. septembar',
    },
    {
        id: 7,
        shortName: 'NED',
        date: '27',
        fullDate: 'Nedelja, 27. septembar',
    },
];

// Ekran za planiranje obroka.
// Korisnik može da izabere dan i vidi obroke planirane za taj dan.
// Podaci su za sada statični i kasnije će biti povezani sa backend-om.

export default function PlanScreen() {
    const [selectedDay, setSelectedDay] = useState(1);
    const { meals } = useMeals();

    const selectedDayData = days.find(
        (day) => day.id === selectedDay
    );

    const selectedMeals = meals.filter(
        (meal) => meal.dateId === selectedDay
    ); 


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Plan ishrane
            </Text>

            <View style={styles.monthHeader}>
                <Pressable>
                    <Text style={styles.arrow}>
                        ‹
                    </Text>
                </Pressable>

                <Text style={styles.month}>
                    Septembar 2026
                </Text>

                <Pressable>
                    <Text style={styles.arrow}>
                        ›
                    </Text>
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daysContainer}
            >
                {days.map((day) => {
                    const isSelected = day.id === selectedDay;

                    return (
                        <Pressable
                            key={day.id}
                            onPress={() => setSelectedDay(day.id)}
                            style={[
                                styles.dayItem,
                                isSelected && styles.dayItemSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dayName,
                                    isSelected && styles.dayTextSelected,
                                ]}
                            >
                                {day.shortName}
                            </Text>

                            <Text
                                style={[
                                    styles.dayNumber,
                                    isSelected && styles.dayTextSelected,
                                ]}
                            >
                                {day.date}
                            </Text>

                            {meals.some((meal) => meal.dateId === day.id) && (
                                <View style={styles.planIndicator} />
                            )}
                        </Pressable>
                    );
                })}
            </ScrollView>

            <View style={styles.dateHeader}>
                <Text style={styles.selectedDate}>
                    {selectedDayData?.fullDate}
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {selectedMeals.map((meal) => (
                    <MealCard
                        key={meal.id}
                        meal={meal}
                    />
                ))}

                {selectedMeals.length === 0 && (
                    <Text style={styles.emptyText}>
                        Za ovaj dan još uvek nema planiranih obroka.
                    </Text>
                )}

                <Pressable 
                    style={styles.addButton}
                    onPress={() => router.push({
                            pathname: '/add-meal',
                            params: {
                                dateId: selectedDay.toString(),
                            },
                        })
                    }
                >
                    <Text style={styles.addButtonText}>
                        + Dodaj obrok
                    </Text>    
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.background,
    },

    title: {
        paddingHorizontal: SPACING.lg,
        fontSize: TYPOGRAPHY.headingLarge,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.lg,
    },

    monthHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },

    month: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
    },

    arrow: {
        fontSize: 30,
        lineHeight: 30,
        color: COLORS.primary,
    },

    daysContainer: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
        paddingBottom: SPACING.md,
    },

    dayItem: {
        width: 56,
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    dayItemSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },

    dayName: {
        fontSize: TYPOGRAPHY.caption,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },

    dayNumber: {
        fontSize: TYPOGRAPHY.bodyLarge,
        fontWeight: '700',
        color: COLORS.text,
    },

    dayTextSelected: {
        color: COLORS.white,
    },

    planIndicator: {
        position: 'absolute',
        bottom: 6,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },

    dateHeader: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },

    selectedDate: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
    },

    content: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },

    addButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginTop: SPACING.sm,
    },

    addButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.primary,
    },

    emptyText: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginVertical: SPACING.xl,
    },
});