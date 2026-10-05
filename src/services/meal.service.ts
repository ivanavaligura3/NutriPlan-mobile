import { getToken } from "./auth.service";

import { Meal } from "../types/meal";

const API_URL = "http://10.48.107.47:5000/api";

/**
 * Tip podataka jednog obroka koji stiže
 * direktno sa backend-a.
 */
type BackendMeal = {
  id: number;
  user_id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
  time: string;
  servings: number;
  is_completed: number | boolean;
  created_at: string;

  recipe_name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  recipe_servings: number;
  preparation_time: number;
};

/**
 * Pretvaranje podataka sa backend-a
 * u format koji koristi frontend.
 */
const mapMealFromBackend = (meal: BackendMeal): Meal => {
  return {
    id: meal.id,
    date: meal.date,
    mealType: meal.meal_type,
    recipeId: meal.recipe_id,
    mealName: meal.recipe_name,
    time: meal.time.slice(0, 5),
    calories: Number(meal.calories),
    protein: Number(meal.protein),
    carbohydrates: Number(meal.carbohydrates),
    fat: Number(meal.fat),
    servings: Number(meal.servings),
    isCompleted: meal.is_completed === true || meal.is_completed === 1,
    recipeServings: Number(meal.recipe_servings),
  };
};

/**
 * Dohvatanje svih obroka trenutno
 * prijavljenog korisnika.
 */
export const getUserMeals = async (): Promise<Meal[]> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/meals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: BackendMeal[] = await response.json();

  console.log("GET MEALS STATUS:", response.status);

  console.log("GET MEALS RESPONSE:", data);

  if (!response.ok) {
    throw new Error("Nije moguće dohvatiti plan ishrane.");
  }

  return data.map(mapMealFromBackend);
};

/**
 * Dodavanje novog obroka u plan.
 */
export const addMealToPlan = async (
  recipeId: number,
  date: string,
  mealType: string,
  time: string,
  servings: number,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/meals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipeId,
      date,
      mealType,
      time,
      servings,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dodati obrok u plan.");
  }

  return data;
};

/**
 * Brisanje obroka iz plana.
 */
export const deleteMealFromPlan = async (mealId: number) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/meals/${mealId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće obrisati obrok iz plana.");
  }

  return data;
};

// Izmena postojećeg obroka u planu
export const updateMealInPlan = async (
  mealId: number,
  recipeId: number,
  date: string,
  mealType: string,
  time: string,
  servings: number,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/meals/${mealId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipeId,
      date,
      mealType,
      time,
      servings,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće izmeniti obrok u planu.");
  }

  return data;
};

// =====================================================
// OZNAČAVANJE OBROKA KAO ZAVRŠENOG
// =====================================================

export const completeMealInPlan = async (mealId: number): Promise<void> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/meals/${mealId}/complete`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Greška pri označavanju obroka kao završenog.",
    );
  }
};
