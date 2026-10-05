import { getUserMeals } from "./meal.service";

// Dohvata planirane obroke za današnji dan.
export const getTodayMeals = async () => {
  const today = new Date().toISOString().split("T")[0];

  const meals = await getUserMeals();

  return meals.filter((meal) => meal.date === today);
};

// Kreira sadržaj podsetnika za planirane obroke.
export const createMealReminderMessage = (
  meals: {
    mealType: string;
    mealName?: string;
  }[],
) => {
  if (meals.length === 0) {
    return {
      title: "NutriPlan 🍎",
      body: "Danas nemaš planirane obroke.",
    };
  }

  const mealNames = meals
    .map((meal) => {
      if (meal.mealName) {
        return `${meal.mealType}: ${meal.mealName}`;
      }

      return meal.mealType;
    })
    .join(", ");

  return {
    title: "NutriPlan 🍎",
    body: `Danas imaš planirane obroke: ${mealNames}.`,
  };
};
