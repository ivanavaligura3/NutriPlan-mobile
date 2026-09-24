import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from 'react';

import { Meal } from '../types/meal';

// Context za upravljanje obrocima koji se trenutno koriste
// u mobilnoj aplikaciji.
// Za sada čuvamo podatke lokalno, a kasnije ćemo ih povezati
// sa NutriPlan backendom.

type MealContextType = {
    meals: Meal[];
    addMeal: (meal: Meal) => void;
    removeMeal: (mealId: number) => void;
    updateMeal: (meal: Meal) => void;
};

const MealContext = createContext<MealContextType | undefined>(
    undefined
);

type MealProviderProps = {
    children: ReactNode;
};

export function MealProvider({ children }: MealProviderProps) {
    const [meals, setMeals] = useState<Meal[]>([
        {
            id: 1,
            dateId: 1,
            mealType: 'Doručak',
            mealName: 'Ovsena kaša sa bananom',
            calories: 420,
        },
        {
            id: 2,
            dateId: 1,
            mealType: 'Ručak',
            mealName: 'Piletina sa povrćem i pirinčem',
            calories: 580,
        },
        {
            id: 3,
            dateId: 1,
            mealType: 'Večera',
            mealName: 'Omlet sa povrćem',
            calories: 350,
        },
        {
            id: 4,
            dateId: 2,
            mealType: 'Doručak',
            mealName: 'Jaja sa tostom',
            calories: 390,
        },
        {
            id: 5,
            dateId: 2,
            mealType: 'Ručak',
            mealName: 'Pileći file sa salatom',
            calories: 520,
        },
        {
            id: 6,
            dateId: 2,
            mealType: 'Večera',
            mealName: 'Salata sa tunjevinom',
            calories: 360,
        },
        {
            id: 7,
            dateId: 3,
            mealType: 'Doručak',
            mealName: 'Grčki jogurt sa voćem',
            calories: 340,
        },
        {
            id: 8,
            dateId: 3,
            mealType: 'Ručak',
            mealName: 'Pasta sa piletinom',
            calories: 610,
        },
    ]);

    const addMeal = (meal: Meal) => {
        setMeals((currentMeals) => [
            ...currentMeals,
            meal,
        ]);
    };

    const removeMeal = (mealId: number) => {
        setMeals((currentMeals) => {
            return currentMeals.filter(
                (meal) => meal.id !== mealId
            );
        });
    };

    const updateMeal = (updatedMeal: Meal) => {
        setMeals((currentMeals) =>
            currentMeals.map((meal) =>
                meal.id === updatedMeal.id
                    ? {
                        ...meal,
                        ...updatedMeal,
                    }
                    : meal
            )
        );
    };

    return (
        <MealContext.Provider
            value={{
                meals,
                addMeal,
                removeMeal,
                updateMeal,
            }}
        >
            {children}
        </MealContext.Provider>
    );
}

export function useMeals() {
    const context = useContext(MealContext);

    if (!context) {
        throw new Error(
            'useMeals mora biti korišćen unutar MealProvider komponente.'
        );
    }

    return context;
}