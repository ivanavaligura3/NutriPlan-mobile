import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";

import { useMeals } from "../../context/MealContext";
import { Meal } from "../../types/meal";
import { roundNutrition } from "../../utils/nutrition";
import { styles } from "./MealCard.styles";

type MealCardProps = {
  meal: Meal;
};

export default function MealCard({ meal }: MealCardProps) {
  const { removeMeal, completeMeal } = useMeals();

  // =====================================================
  // BRISANJE OBROKA
  // =====================================================

  const handleDelete = () => {
    Alert.alert(
      "Obriši obrok",
      "Da li ste sigurni da želite da obrišete ovaj obrok?",
      [
        {
          text: "Otkaži",
          style: "cancel",
        },
        {
          text: "Obriši",
          style: "destructive",
          onPress: () => removeMeal(meal.id),
        },
      ],
    );
  };

  // =====================================================
  // OZNAČAVANJE OBROKA KAO PRIPREMLJENOG
  // =====================================================

  const handleComplete = () => {
    Alert.alert(
      "Obrok pripremljen",
      "Da li želiš da označiš ovaj obrok kao pripremljen?",
      [
        {
          text: "Otkaži",
          style: "cancel",
        },
        {
          text: "Potvrdi",
          onPress: () => completeMeal(meal.id),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Osnovne informacije o obroku */}
      <View style={styles.info}>
        <Text style={styles.mealType}>{meal.mealType}</Text>

        <Text style={styles.mealName}>{meal.mealName}</Text>
      </View>

      {/* Nutritivne informacije */}
      <View style={styles.nutritionInfo}>
        <Text style={styles.servings}>
          {meal.servings} {meal.servings === 1 ? "porcija" : "porcije"}
        </Text>

        <Text style={styles.calories}>
          {meal.recipeServings > 0
            ? roundNutrition(
                (meal.calories / meal.recipeServings) * meal.servings,
              )
            : 0}{" "}
          kcal
        </Text>
      </View>

      {/* Akcije */}
      <View style={styles.actions}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/add-meal",
              params: {
                mealId: meal.id.toString(),
                date: meal.date,
              },
            })
          }
        >
          <Text style={styles.editText}>Izmeni</Text>
        </Pressable>

        {!meal.isCompleted && (
          <Pressable onPress={handleComplete}>
            <Text style={styles.completeText}>Obrok pripremljen</Text>
          </Pressable>
        )}

        {meal.isCompleted && (
          <Text style={styles.completedText}>✓ Obrok pripremljen</Text>
        )}

        <Pressable onPress={handleDelete}>
          <Text style={styles.deleteText}>Obriši</Text>
        </Pressable>
      </View>
    </View>
  );
}
