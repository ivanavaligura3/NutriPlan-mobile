import { Pressable, Text, TouchableOpacity } from "react-native";

import { Food } from "../../types/food";
import { styles } from "./FoodCard.styles";

import { useUnits } from "../../context/UnitContext";
import { formatQuantityForDisplay } from "../../utils/unitConversion";

const getNutritionValue = (
  value: number | null,
  quantity: number,
  unit: string,
) => {
  if (value === null) {
    return null;
  }

  if (unit === "g") {
    return (value * quantity) / 100;
  }

  if (unit === "kg") {
    return value * quantity * 10;
  }

  return null;
};

type FoodCardProps = {
  food: Food;
  onPress?: () => void;
  onDelete?: () => void;
};

export default function FoodCard({ food, onPress, onDelete }: FoodCardProps) {
  const { unitSystem } = useUnits();

  const displayQuantity = formatQuantityForDisplay(
    food.quantity,
    food.unit,
    unitSystem,
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.foodName}>{food.name}</Text>

      <Text style={styles.quantity}>
        {displayQuantity.quantity} {displayQuantity.unit}
      </Text>

      <Text style={styles.nutrition}>
        Kalorije:{" "}
        {getNutritionValue(food.calories, food.quantity, food.unit) !== null
          ? `${getNutritionValue(
              food.calories,
              food.quantity,
              food.unit,
            )?.toFixed(2)} kcal`
          : "Nije dostupno"}
      </Text>

      <Text style={styles.nutrition}>
        Proteini:{" "}
        {getNutritionValue(food.protein, food.quantity, food.unit) !== null
          ? `${getNutritionValue(
              food.protein,
              food.quantity,
              food.unit,
            )?.toFixed(2)} g`
          : "Nije dostupno"}
      </Text>

      <Text style={styles.nutrition}>
        Ugljeni hidrati:{" "}
        {getNutritionValue(food.carbohydrates, food.quantity, food.unit) !==
        null
          ? `${getNutritionValue(
              food.carbohydrates,
              food.quantity,
              food.unit,
            )?.toFixed(2)} g`
          : "Nije dostupno"}
      </Text>

      <Text style={styles.nutrition}>
        Masti:{" "}
        {getNutritionValue(food.fat, food.quantity, food.unit) !== null
          ? `${getNutritionValue(food.fat, food.quantity, food.unit)?.toFixed(
              2,
            )} g`
          : "Nije dostupno"}
      </Text>
      <Pressable style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Obriši</Text>
      </Pressable>
    </TouchableOpacity>
  );
}
