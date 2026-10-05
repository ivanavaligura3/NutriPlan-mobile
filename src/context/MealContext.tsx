import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAuth } from "./AuthContext";

import { Meal } from "../types/meal";

import {
    addMealToPlan,
    completeMealInPlan,
    deleteMealFromPlan,
    getUserMeals,
    updateMealInPlan,
} from "../services/meal.service";

// =====================================================
// TIP PODATAKA CONTEXT-A
// =====================================================

type MealContextType = {
  meals: Meal[];
  addMeal: (meal: Meal) => Promise<void>;
  removeMeal: (mealId: number) => Promise<void>;
  updateMeal: (meal: Meal) => Promise<void>;
  completeMeal: (mealId: number) => Promise<void>;
  loading: boolean;
};

// =====================================================
// KREIRANJE CONTEXT-A
// =====================================================

const MealContext = createContext<MealContextType | undefined>(undefined);

// =====================================================
// TIP PROPS-A
// =====================================================

type MealProviderProps = {
  children: ReactNode;
};

// =====================================================
// MEAL PROVIDER
// =====================================================

export function MealProvider({ children }: MealProviderProps) {
  const { user } = useAuth();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // =================================================
  // UČITAVANJE OBROKA SA BACKEND-A
  // =================================================

  useEffect(() => {
    if (!user) {
      setMeals([]);
      setLoading(false);
      return;
    }

    const loadMeals = async () => {
      try {
        setLoading(true);

        const data = await getUserMeals();

        setMeals(data);
      } catch (error) {
        console.error("Greška pri učitavanju plana:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [user?.id]);

  // =================================================
  // DODAVANJE OBROKA
  // =================================================

  const addMeal = async (meal: Meal) => {
    try {
      const response = await addMealToPlan(
        meal.recipeId,
        meal.date,
        meal.mealType,
        meal.time,
        meal.servings,
      );

      // Nakon uspešnog čuvanja na backend-u
      // ponovo učitavamo plan kako bismo dobili
      // pravi ID i podatke iz baze.
      const updatedMeals = await getUserMeals();

      setMeals(updatedMeals);

      console.log("Obrok je uspešno dodat. ID:", response.mealId);
    } catch (error) {
      console.error("Greška pri dodavanju obroka:", error);

      throw error;
    }
  };

  // =================================================
  // BRISANJE OBROKA
  // =================================================

  const removeMeal = async (mealId: number) => {
    try {
      await deleteMealFromPlan(mealId);

      setMeals((currentMeals) =>
        currentMeals.filter((meal) => meal.id !== mealId),
      );
    } catch (error) {
      console.error("Greška pri brisanju obroka:", error);

      throw error;
    }
  };

  // =================================================
  // IZMENU ĆEMO POVEZATI SA BACKEND-OM U SLEDEĆEM KORAKU
  // =================================================

  // Izmena postojećeg obroka
  const updateMeal = async (updatedMeal: Meal) => {
    try {
      await updateMealInPlan(
        updatedMeal.id,
        updatedMeal.recipeId,
        updatedMeal.date,
        updatedMeal.mealType,
        updatedMeal.time,
        updatedMeal.servings,
      );

      // Nakon uspešne izmene ponovo učitavamo plan
      // kako bi podaci u aplikaciji odgovarali bazi
      const updatedMeals = await getUserMeals();

      setMeals(updatedMeals);
    } catch (error) {
      console.error("Greška pri izmeni obroka:", error);

      throw error;
    }
  };

  // =====================================================
  // OZNAČAVANJE OBROKA KAO ZAVRŠENOG
  // =====================================================

  const completeMeal = async (mealId: number) => {
    try {
      await completeMealInPlan(mealId);

      const updatedMeals = await getUserMeals();
      setMeals(updatedMeals);
    } catch (error) {
      console.error("Greška pri završavanju obroka:", error);
      throw error;
    }
  };

  // =================================================
  // PROVIDER
  // =================================================

  return (
    <MealContext.Provider
      value={{
        meals,
        addMeal,
        removeMeal,
        updateMeal,
        completeMeal,
        loading,
      }}
    >
      {children}
    </MealContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useMeals() {
  const context = useContext(MealContext);

  if (!context) {
    throw new Error(
      "useMeals mora biti korišćen unutar MealProvider komponente.",
    );
  }

  return context;
}
