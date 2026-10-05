import { getToken } from "./auth.service";

const API_URL = "http://10.48.107.47:5000/api";

/**
 * Proizvod koji vraća Open Food Facts.
 */
export type OpenFoodFactsProduct = {
  code?: string;
  product_name?: string;
  brands?: string | string[];
  quantity?: string;
  image_front_url?: string;

  nutriments?: {
    "energy-kcal_100g"?: number;
    "energy-kj_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
};

/**
 * Pretraga namirnica preko našeg backend-a,
 * koji zatim poziva Open Food Facts API.
 */
export const searchOpenFoodFacts = async (
  searchTerm: string,
): Promise<OpenFoodFactsProduct[]> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(
    `${API_URL}/open-food-facts/search?search=${encodeURIComponent(
      searchTerm,
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće pretražiti namirnice.");
  }

  return data.products;
};
