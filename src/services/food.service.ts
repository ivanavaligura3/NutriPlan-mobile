import { getToken } from "./auth.service";

const API_URL = "http://10.48.107.47:5000/api";

// Dohvatanje namirnica trenutno prijavljenog korisnika
export const getUserFoods = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/foods`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dohvatiti namirnice.");
  }

  return data;
};

// Dodavanje nove namirnice
export const addFood = async (
  name: string,
  quantity: number,
  unit: string,
  calories: number | null,
  protein: number | null,
  carbohydrates: number | null,
  fat: number | null,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/foods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      quantity,
      unit,
      calories,
      protein,
      carbohydrates,
      fat,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dodati namirnicu.");
  }

  return data;
};

// Izmena postojeće namirnice
export const updateFood = async (
  foodId: number,
  name: string,
  quantity: number,
  unit: string,
  calories: number | null,
  protein: number | null,
  carbohydrates: number | null,
  fat: number | null,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/foods/${foodId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      quantity,
      unit,
      calories,
      protein,
      carbohydrates,
      fat,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće izmeniti namirnicu.");
  }

  return data;
};

// Brisanje postojeće namirnice
export const deleteFood = async (foodId: number) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/foods/${foodId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće obrisati namirnicu.");
  }

  return data;
};
