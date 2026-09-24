import { createContext, ReactNode, useContext, useState } from 'react';

import { Food } from '../types/food';
import { FOODS } from '../constants/foodData';

// Context za unpravljanje namirnicama u mobilnoj aplikaciji.
// Za sada namirnice čuvamo lokalno, a kasnije ćemo ih povezati
// sa NutriPlan backendom.

type FoodContextType = {
    foods: Food[];
    addFood: (food: Food) => void;
    removeFood: (foodId: number) => void;
    updateFood: (food: Food) => void;
};

const FoodContext = createContext<FoodContextType | undefined>(
    undefined
);

type FoodProviderProps = {
    children: ReactNode;
};

export function FoodProvider({
    children,
}: FoodProviderProps) {
    const [foods, setFoods] = useState<Food[]>(FOODS);

    const addFood = (food: Food) => {
        setFoods((currentFoods) => [
            ...currentFoods,
            food,
        ]);
    };

    const removeFood = (foodId: number) => {
        setFoods((currentFoods) =>
            currentFoods.filter(
                (food) => food.id !== foodId
            )
        );
    };

    const updateFood = (updatedFood: Food) => {
        setFoods((currentFoods) =>
            currentFoods.map((food) =>
                food.id === updatedFood.id
                    ? updatedFood
                    : food
            )
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
            'useFoods mora biti korišćen unutar FoodProvider komponente.'
        );
    }

    return context;
}

