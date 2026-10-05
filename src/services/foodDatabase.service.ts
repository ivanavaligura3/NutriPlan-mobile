import { getToken } from "./auth.service";

const API_URL = "http://10.48.107.47:5000/api";

export type FoodDatabaseItem = {
  id: number;
  name: string;
  category: string;
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
};

export const searchFoodDatabase = async (
  searchTerm: string,
): Promise<FoodDatabaseItem[]> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(
    `${API_URL}/food-database/search?search=${encodeURIComponent(searchTerm)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Nije moguće pretražiti internu bazu namirnica.",
    );
  }

  console.log("FOOD DATABASE RESULTS:", data.foods);

  return data.foods;
};

export const getFoodDatabaseItem = async (
  foodName: string,
): Promise<FoodDatabaseItem | null> => {
  const results = await searchFoodDatabase(foodName);

  if (results.length === 0) {
    return null;
  }

  const normalizedName = foodName.trim().toLowerCase();

  const exactMatch = results.find(
    (food) => food.name.trim().toLowerCase() === normalizedName,
  );

  return exactMatch ?? results[0];
};
