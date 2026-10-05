import { getToken } from "./auth.service";

const API_URL = "http://10.48.107.47:5000/api";

/**
 * Tip nutritivne namirnice.
 */
export type FoodNutrition = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

/**
 * Dohvata sve namirnice iz nutritivne baze.
 */
export const getFoodNutritionList = async (): Promise<FoodNutrition[]> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/food-nutrition`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće učitati nutritivne podatke.");
  }

  return data;
};
