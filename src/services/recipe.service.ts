import { getToken } from "./auth.service";

const API_URL = "http://10.48.107.47:5000/api";

/**
 * Tip podataka jednog recepta koji stiže sa backend-a.
 */
export type Recipe = {
  id: number;
  user_id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  preparation_time: number;
  servings: number;
  created_at: string;
};

/**
 * Tip podataka jednog sastojka recepta koji stiže sa backend-a.
 */
export type RecipeIngredient = {
  id: number;
  food_name: string;
  quantity: number;
  unit: string;

  off_calories?: number;
  off_protein?: number;
  off_carbohydrates?: number;
  off_fat?: number;
};

/**
 * Nutritivne vrednosti recepta.
 */
export type RecipeNutrition = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

/**
 * Dohvatanje svih recepata trenutno prijavljenog korisnika.
 */
export const getUserRecipes = async (): Promise<Recipe[]> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dohvatiti recepte.");
  }

  return data.recipes;
};

/**
 * Kreiranje novog recepta.
 */
export const createRecipe = async (
  name: string,
  description: string,
  calories: number,
  preparationTime: number,
  servings: number,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
      calories,
      preparationTime,
      servings,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće kreirati recept.");
  }

  return data;
};

// Izmena postojećeg recepta
export const updateRecipe = async (
  recipeId: number,
  name: string,
  description: string,
  calories: number,
  preparationTime: number,
  servings: number,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  console.log("UPDATE REQUEST:", `${API_URL}/recipes/${recipeId}`);

  const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
      calories,
      preparationTime,
      servings,
    }),
  });

  /* const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Nije moguće izmeniti recept.'
        );
    } */

  const responseText = await response.text();

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Server je vratio neočekivan odgovor: ${responseText}`);
  }

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće izmeniti recept.");
  }

  return data;
};

// Brisanje postojećeg recepta
export const deleteRecipe = async (recipeId: number) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseText = await response.text();

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Server je vratio neočekivan odgovor: ${responseText}`);
  }

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće obrisati recept.");
  }

  return data;
};

// Dodavanje sastojka receptu
export const addRecipeIngredient = async (
  recipeId: number,
  name: string,
  quantity: number,
  unit: string,
  offCalories?: number,
  offProtein?: number,
  offCarbohydrates?: number,
  offFat?: number,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/ingredients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      quantity,
      unit,
      offCalories,
      offProtein,
      offCarbohydrates,
      offFat,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dodati sastojak.");
  }

  return data;
};

// Dohvatanje sastojaka recepta
export const getRecipeIngredients = async (
  recipeId: number,
): Promise<RecipeIngredient[]> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/ingredients`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dohvatiti sastojke.");
  }

  return data.ingredients;
};

// Izmena sastojka recepta
export const updateRecipeIngredient = async (
  recipeId: number,
  ingredientId: number,
  name: string,
  quantity: number,
  unit: string,
  offCalories?: number,
  offProtein?: number,
  offCarbohydrates?: number,
  offFat?: number,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(
    `${API_URL}/recipes/${recipeId}/ingredients/${ingredientId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        quantity,
        unit,
        offCalories,
        offProtein,
        offCarbohydrates,
        offFat,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće izmeniti sastojak.");
  }

  return data;
};

// Brisanje sastojka recepta
export const deleteRecipeIngredient = async (
  recipeId: number,
  ingredientId: number,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(
    `${API_URL}/recipes/${recipeId}/ingredients/${ingredientId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće obrisati sastojak.");
  }

  return data;
};

export const addRecipeStep = async (
  recipeId: number,
  stepNumber: number,
  description: string,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/steps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      stepNumber,
      description,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dodati korak.");
  }

  return data;
};

export const getRecipeSteps = async (recipeId: number) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/steps`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dohvatiti korake.");
  }

  return data.steps;
};

export const updateRecipeStep = async (
  recipeId: number,
  stepId: number,
  stepNumber: number,
  description: string,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(
    `${API_URL}/recipes/${recipeId}/steps/${stepId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stepNumber,
        description,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće izmeniti korak.");
  }

  return data;
};

export const deleteRecipeStep = async (recipeId: number, stepId: number) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(
    `${API_URL}/recipes/${recipeId}/steps/${stepId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće obrisati korak.");
  }

  return data;
};

// =====================================================
// FAVORITI
// =====================================================

// Dodavanje recepta u favorite
export const addRecipeToFavorites = async (recipeId: number) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/favorite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dodati recept u favorite.");
  }

  return data;
};

// Uklanjanje recepta iz favorita
export const removeRecipeFromFavorites = async (recipeId: number) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/favorite`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće ukloniti recept iz favorita.");
  }

  return data;
};

// Provera da li je recept u favoritima
export const checkRecipeFavorite = async (
  recipeId: number,
): Promise<boolean> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/favorite`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće proveriti favorite.");
  }

  return data.isFavorite;
};

// Dohvatanje svih omiljenih recepata
export const getFavoriteRecipes = async (): Promise<Recipe[]> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/favorites`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dohvatiti favorite.");
  }

  return data;
};

/**
 * Automatski obračun nutritivnih vrednosti recepta.
 */
export const getRecipeNutrition = async (
  recipeId: number,
): Promise<RecipeNutrition> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/nutrition`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Nije moguće obračunati nutritivne vrednosti.",
    );
  }

  return data.nutrition;
};

/**
 * Automatski obračunava i čuva
 * nutritivne vrednosti recepta.
 */
export const updateRecipeNutrition = async (
  recipeId: number,
): Promise<RecipeNutrition> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}/nutrition`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Nije moguće sačuvati nutritivne vrednosti.",
    );
  }

  return data.nutrition;
};
