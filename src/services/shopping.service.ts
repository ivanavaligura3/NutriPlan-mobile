import API_URL from "./api";
import { getToken } from "./auth.service";

// =====================================================
// TIP SHOPPING STAVKE
// =====================================================

export type ShoppingItem = {
  id: number;
  user_id: number;
  name: string;
  quantity: number;
  unit: string;
  is_purchased: boolean;
  is_automatic: boolean;
  created_at: string;
};

// =====================================================
// TIP SASTOJKA PLANIRANOG OBROKA
// =====================================================

export type PlannedIngredient = {
  meal_id: number;
  date: string;
  meal_servings: number;

  recipe_id: number;
  recipe_name: string;
  recipe_servings: number;

  ingredient_id: number;
  food_id: number | null;
  food_name: string;
  quantity: number;
  unit: string;

  required_quantity: number;
};

// =====================================================
// POMOĆNA FUNKCIJA ZA TOKEN
// =====================================================

const getAuthHeaders = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// =====================================================
// DOHVATANJE SHOPPING LISTE
// =====================================================

export const getShoppingItems = async (): Promise<ShoppingItem[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dohvatiti shopping listu.");
  }

  return data;
};

// =====================================================
// DODAVANJE SHOPPING STAVKE
// =====================================================

export const addShoppingItem = async (
  name: string,
  quantity: number,
  unit: string,
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      quantity,
      unit,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dodati shopping stavku.");
  }

  return data;
};

// =====================================================
// PROMENA STATUSA KUPOVINE
// =====================================================

export const updateShoppingItemPurchased = async (
  itemId: number,
  isPurchased: boolean,
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping/${itemId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      isPurchased,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Nije moguće promeniti status shopping stavke.",
    );
  }

  return data;
};

// =====================================================
// BRISANJE SHOPPING STAVKE
// =====================================================

export const deleteShoppingItem = async (itemId: number) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping/${itemId}`, {
    method: "DELETE",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće obrisati shopping stavku.");
  }

  return data;
};

// =====================================================
// DOHVATANJE SASTOJAKA PLANIRANIH OBROKA
// =====================================================

export const getPlannedIngredients = async (
  date: string,
): Promise<PlannedIngredient[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/shopping/planned-ingredients?date=${encodeURIComponent(date)}`,
    {
      method: "GET",
      headers,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Nije moguće dohvatiti sastojke planiranih obroka.",
    );
  }

  return data;
};

// =====================================================
// AUTOMATSKA SINHRONIZACIJA SHOPPING LISTE
// =====================================================

export const syncAutomaticShoppingItems = async (
  date: string,
): Promise<ShoppingItem[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping/sync-automatic`, {
    method: "POST",
    headers,
    body: JSON.stringify({ date }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Nije moguće sinhronizovati automatske shopping stavke.",
    );
  }

  return data.items;
};
