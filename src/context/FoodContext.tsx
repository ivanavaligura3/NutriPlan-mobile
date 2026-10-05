import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAuth } from "./AuthContext";

import { Food } from "../types/food";

import { addQuantities, formatQuantity } from "../utils/quantity";

import {
    addFood as addFoodToApi,
    deleteFood as deleteFoodFromApi,
    getUserFoods,
    updateFood as updateFoodToApi,
} from "../services/food.service";

// Context za upravljanje namirnicama u mobilnoj aplikaciji.

type FoodContextType = {
  foods: Food[];
  addFood: (food: Food) => Promise<void>;
  removeFood: (foodId: number) => Promise<void>;
  updateFood: (food: Food) => Promise<void>;
};

const FoodContext = createContext<FoodContextType | undefined>(undefined);

type FoodProviderProps = {
  children: ReactNode;
};

export function FoodProvider({ children }: FoodProviderProps) {
  const { user } = useAuth();

  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    if (!user) {
      setFoods([]);
      return;
    }

    const loadFoods = async () => {
      try {
        const data = await getUserFoods();

        const formattedFoods: Food[] = data.map((food: any) => ({
          id: food.id,
          name: food.name,
          quantity: Number(food.quantity),
          unit: food.unit,
          calories: food.calories !== null ? Number(food.calories) : null,
          protein: food.protein !== null ? Number(food.protein) : null,
          carbohydrates:
            food.carbohydrates !== null ? Number(food.carbohydrates) : null,
          fat: food.fat !== null ? Number(food.fat) : null,
        }));

        setFoods(formattedFoods);
      } catch (error) {
        console.error("Greška pri učitavanju namirnica:", error);
      }
    };

    loadFoods();
  }, [user?.id]);

  const addFood = async (food: Food) => {
    const response = await addFoodToApi(
      food.name,
      food.quantity,
      food.unit,
      food.calories,
      food.protein,
      food.carbohydrates,
      food.fat,
    );

    const newFood: Food = {
      ...food,
      id: response.foodId,
    };

    setFoods((currentFoods) => {
      const existingFood = currentFoods.find(
        (currentFood) =>
          currentFood.name.trim().toLowerCase() ===
          food.name.trim().toLowerCase(),
      );

      if (!existingFood) {
        return [...currentFoods, newFood];
      }

      const summedQuantity = addQuantities(
        existingFood.quantity,
        existingFood.unit,
        food.quantity,
        food.unit,
      );

      if (!summedQuantity) {
        return [...currentFoods, newFood];
      }

      const formattedQuantity = formatQuantity(
        summedQuantity.quantity,
        summedQuantity.unit,
      );

      return currentFoods.map((currentFood) =>
        currentFood.id === existingFood.id
          ? {
              ...currentFood,
              quantity: formattedQuantity.quantity,
              unit: formattedQuantity.unit,

              // Ako nova namirnica ima nutritivne vrednosti,
              // ažuriramo postojeće vrednosti.
              calories: food.calories ?? currentFood.calories,

              protein: food.protein ?? currentFood.protein,

              carbohydrates: food.carbohydrates ?? currentFood.carbohydrates,

              fat: food.fat ?? currentFood.fat,
            }
          : currentFood,
      );
    });
  };

  const removeFood = async (foodId: number) => {
    await deleteFoodFromApi(foodId);

    setFoods((currentFoods) =>
      currentFoods.filter((food) => food.id !== foodId),
    );
  };

  const updateFood = async (updatedFood: Food) => {
    await updateFoodToApi(
      updatedFood.id,
      updatedFood.name,
      updatedFood.quantity,
      updatedFood.unit,
      updatedFood.calories,
      updatedFood.protein,
      updatedFood.carbohydrates,
      updatedFood.fat,
    );

    setFoods((currentFoods) =>
      currentFoods.map((food) =>
        food.id === updatedFood.id ? updatedFood : food,
      ),
    );
  };

  return (
    <FoodContext.Provider
      value={{
        foods,
        addFood,
        removeFood,
        updateFood,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
}

export function useFoods() {
  const context = useContext(FoodContext);

  if (!context) {
    throw new Error(
      "useFoods mora biti korišćen unutar FoodProvider komponente.",
    );
  }

  return context;
}
