import { Meal } from '../types/meal';

// Računa ukupan broj kalorija za listu obroka.
// Funkcija je izdvojena iz UI-ja kako bismo istu logiku
// mogli da koristimo i na drugim ekranima.

export function calculateTotalCalories(meals: Meal[]): number {
    return meals.reduce(
        (total, meal) => total + meal.calories,
        0
    );
}