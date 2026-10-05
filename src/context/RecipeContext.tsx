import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAuth } from "./AuthContext";

import {
    addRecipeToFavorites,
    deleteRecipe,
    getFavoriteRecipes,
    getRecipeIngredients,
    getRecipeSteps,
    getUserRecipes,
    removeRecipeFromFavorites,
} from "../services/recipe.service";
import { Recipe } from "../types/recipe";

// Context za upravljanje receptima u mobilnoj aplikaciji.
// Recepti se učitavaju sa NutriPlan backend-a.

// Tip podataka koji trenutno stiže sa backend-a.
type BackendRecipe = {
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

type BackendRecipeStep = {
  id: number;
  step_number: number;
  description: string;
};

type RecipeContextType = {
  recipes: Recipe[];
  favoriteRecipeIds: number[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: number) => Promise<void>;
  updateRecipe: (recipe: Recipe) => void;
  toggleFavorite: (recipeId: number) => Promise<void>;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

type RecipeProviderProps = {
  children: ReactNode;
};

export function RecipeProvider({ children }: RecipeProviderProps) {
  const { user } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);

  // Učitavanje recepata sa backend-a prilikom pokretanja aplikacije.
  useEffect(() => {
    if (!user) {
      setRecipes([]);
      setFavoriteRecipeIds([]);
      return;
    }

    loadRecipes();
  }, [user?.id]);

  const loadRecipes = async () => {
    try {
      const backendRecipes = await getUserRecipes();

      const favoriteRecipes = await getFavoriteRecipes();

      setFavoriteRecipeIds(favoriteRecipes.map((recipe) => recipe.id));

      const formattedRecipes: Recipe[] = await Promise.all(
        backendRecipes.map(async (recipe: BackendRecipe) => {
          const ingredients = await getRecipeIngredients(recipe.id);

          const steps: BackendRecipeStep[] = await getRecipeSteps(recipe.id);

          return {
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            calories: recipe.calories,
            protein: recipe.protein,
            carbohydrates: recipe.carbohydrates,
            fat: recipe.fat,
            preparationTime: recipe.preparation_time,
            servings: recipe.servings,

            ingredients: ingredients.map((ingredient) => ({
              id: ingredient.id,
              name: ingredient.food_name,
              quantity: Number(ingredient.quantity),
              unit: ingredient.unit,

              // Nutritivne vrednosti preuzete sa
              // Open Food Facts-a.
              offCalories:
                ingredient.off_calories !== undefined &&
                ingredient.off_calories !== null
                  ? Number(ingredient.off_calories)
                  : undefined,

              offProtein:
                ingredient.off_protein !== undefined &&
                ingredient.off_protein !== null
                  ? Number(ingredient.off_protein)
                  : undefined,

              offCarbohydrates:
                ingredient.off_carbohydrates !== undefined &&
                ingredient.off_carbohydrates !== null
                  ? Number(ingredient.off_carbohydrates)
                  : undefined,

              offFat:
                ingredient.off_fat !== undefined && ingredient.off_fat !== null
                  ? Number(ingredient.off_fat)
                  : undefined,
            })),

            preparationSteps: steps.map((step) => ({
              id: step.id,
              stepNumber: step.step_number,
              description: step.description,
            })),
          };
        }),
      );

      setRecipes(formattedRecipes);
    } catch (error) {
      console.error("Greška pri učitavanju recepata:", error);
    }
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes((currentRecipes) => [...currentRecipes, recipe]);
  };

  const removeRecipe = async (recipeId: number) => {
    try {
      // Brisanje recepta iz baze
      await deleteRecipe(recipeId);

      // Brisanje recepta iz lokalnog state-a
      setRecipes((currentRecipes) =>
        currentRecipes.filter((recipe) => recipe.id !== recipeId),
      );
    } catch (error) {
      console.error("Greška pri brisanju recepta:", error);

      throw error;
    }
  };

  const updateRecipe = (updatedRecipe: Recipe) => {
    setRecipes((currentRecipes) =>
      currentRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe,
      ),
    );
  };

  const toggleFavorite = async (recipeId: number) => {
    try {
      const isFavorite = favoriteRecipeIds.includes(recipeId);

      if (isFavorite) {
        // Uklanjanje iz favorita u bazi
        await removeRecipeFromFavorites(recipeId);

        // Uklanjanje iz lokalnog state-a
        setFavoriteRecipeIds((currentFavorites) =>
          currentFavorites.filter((id) => id !== recipeId),
        );
      } else {
        // Dodavanje u favorite u bazi
        await addRecipeToFavorites(recipeId);

        // Dodavanje u lokalni state
        setFavoriteRecipeIds((currentFavorites) => [
          ...currentFavorites,
          recipeId,
        ]);
      }
    } catch (error) {
      console.error("Greška pri promeni favorita:", error);

      throw error;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        favoriteRecipeIds,
        addRecipe,
        removeRecipe,
        updateRecipe,
        toggleFavorite,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error(
      "useRecipes mora biti korišćen unutar RecipeProvider komponente.",
    );
  }

  return context;
}
