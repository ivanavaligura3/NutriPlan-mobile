import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import MealCard from "../../components/MealCard/MealCard";

import {
    getDateString,
    getMonthTitle,
    getPlanDays,
} from "../../constants/dateData";
import { useMeals } from "../../context/MealContext";
import { COLORS } from "../../styles/colors";
import { SPACING } from "../../styles/spacing";
import { TYPOGRAPHY } from "../../styles/typography";
import { roundNutrition } from "../../utils/nutrition";

// Ekran za planiranje obroka.
// Korisnik može da izabere dan i vidi obroke planirane za taj dan.
// Podaci se učitavaju sa backend-a preko MealContext-a.

export default function PlanScreen() {
  const today = new Date();

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const daysScrollRef = useRef<ScrollView>(null);

  const { meals } = useMeals();

  // =================================================
  // AUTOMATSKO POZICIONIRANJE NA DANAŠNJI DAN
  // =================================================

  useEffect(() => {
    const isCurrentMonth =
      selectedYear === today.getFullYear() &&
      selectedMonth === today.getMonth();

    if (!isCurrentMonth) {
      return;
    }

    const dayIndex = today.getDate() - 1;

    daysScrollRef.current?.scrollTo({
      x: Math.max(0, dayIndex * (56 + SPACING.sm) - 120),
      animated: false,
    });
  }, [selectedYear, selectedMonth]);

  // =================================================
  // PODACI O DANIMA U IZABRANOM MESECU
  // =================================================

  const planDays = getPlanDays(selectedYear, selectedMonth);

  const selectedDayData = planDays.find((day) => day.id === selectedDay);

  // =================================================
  // IZABRANI DATUM
  // =================================================

  const selectedDate = getDateString(selectedYear, selectedMonth, selectedDay);

  // =================================================
  // OBROCI ZA IZABRANI DAN
  // =================================================

  const selectedMeals = meals.filter((meal) => meal.date === selectedDate);

  // =================================================
  // DNEVNI NUTRITIVNI ZBIR
  // =================================================

  const dailyCalories = selectedMeals.reduce(
    (total, meal) =>
      total +
      (meal.recipeServings > 0
        ? (meal.calories / meal.recipeServings) * meal.servings
        : 0),
    0,
  );

  const dailyProtein = selectedMeals.reduce(
    (total, meal) =>
      total +
      (meal.recipeServings > 0
        ? (meal.protein / meal.recipeServings) * meal.servings
        : 0),
    0,
  );

  const dailyCarbohydrates = selectedMeals.reduce(
    (total, meal) =>
      total +
      (meal.recipeServings > 0
        ? (meal.carbohydrates / meal.recipeServings) * meal.servings
        : 0),
    0,
  );

  const dailyFat = selectedMeals.reduce(
    (total, meal) =>
      total +
      (meal.recipeServings > 0
        ? (meal.fat / meal.recipeServings) * meal.servings
        : 0),
    0,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan ishrane</Text>

      {/* =================================================
                NAVIGACIJA KROZ MESECE
            ================================================= */}

      <View style={styles.monthHeader}>
        <Text style={styles.month}>
          {getMonthTitle(selectedYear, selectedMonth)}
        </Text>

        <Pressable
          onPress={() => {
            if (selectedMonth === 0) {
              setSelectedMonth(11);
              setSelectedYear(selectedYear - 1);
            } else {
              setSelectedMonth(selectedMonth - 1);
            }

            setSelectedDay(1);
          }}
        >
          <Text style={styles.arrow}>‹</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            if (selectedMonth === 11) {
              setSelectedMonth(0);
              setSelectedYear(selectedYear + 1);
            } else {
              setSelectedMonth(selectedMonth + 1);
            }

            setSelectedDay(1);
          }}
        >
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* =================================================
                IZBOR DANA
            ================================================= */}

      <View style={styles.calendarContainer}>
        <ScrollView
          ref={daysScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
          nestedScrollEnabled
        >
          {planDays.map((day) => {
            const isSelected = day.id === selectedDay;

            return (
              <Pressable
                key={day.id}
                onPress={() => setSelectedDay(day.id)}
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
              >
                <Text
                  style={[styles.dayName, isSelected && styles.dayTextSelected]}
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

                {meals.some(
                  (meal) =>
                    meal.date ===
                    getDateString(selectedYear, selectedMonth, day.id),
                ) && <View style={styles.planIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* =================================================
                IZABRANI DATUM
            ================================================= */}

      <View style={styles.dateHeader}>
        <Text style={styles.selectedDate}>{selectedDayData?.fullDate}</Text>
      </View>

      {/* =================================================
                DNEVNI NUTRITIVNI PREGLED
            ================================================= */}

      <View style={styles.nutritionCard}>
        <Text style={styles.nutritionTitle}>Dnevni nutritivni unos</Text>

        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>
              {roundNutrition(dailyCalories)}
            </Text>

            <Text style={styles.nutritionLabel}>kcal</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>
              {roundNutrition(dailyProtein)} g
            </Text>

            <Text style={styles.nutritionLabel}>Proteini</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>
              {roundNutrition(dailyCarbohydrates)} g
            </Text>

            <Text style={styles.nutritionLabel}>Ugljeni hidrati</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>
              {roundNutrition(dailyFat)} g
            </Text>

            <Text style={styles.nutritionLabel}>Masti</Text>
          </View>
        </View>
      </View>

      {/* =================================================
                LISTA OBROKA
            ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {selectedMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}

        {selectedMeals.length === 0 && (
          <Text style={styles.emptyText}>
            Za ovaj dan još uvek nema planiranih obroka.
          </Text>
        )}

        {/* =================================================
                    DODAVANJE NOVOG OBROKA
                ================================================= */}

        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push({
              pathname: "/add-meal",
              params: {
                date: selectedDate,
              },
            })
          }
        >
          <Text style={styles.addButtonText}>+ Dodaj obrok</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// =====================================================
// STILOVI
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.background,
  },

  title: {
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.headingLarge,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },

  month: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },

  arrow: {
    fontSize: 30,
    lineHeight: 30,
    color: COLORS.primary,
  },

  calendarContainer: {
    height: 88,
  },

  daysContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },

  dayItem: {
    width: 56,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  dayNumber: {
    fontSize: TYPOGRAPHY.bodyLarge,
    fontWeight: "700",
    color: COLORS.text,
  },

  dayTextSelected: {
    color: COLORS.white,
  },

  planIndicator: {
    position: "absolute",
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
    fontWeight: "600",
    color: COLORS.text,
  },

  nutritionCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  nutritionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },

  nutritionItem: {
    flex: 1,
    alignItems: "center",
  },

  nutritionValue: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
  },

  nutritionLabel: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  addButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SPACING.sm,
  },

  addButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.primary,
  },

  emptyText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginVertical: SPACING.xl,
  },
});
