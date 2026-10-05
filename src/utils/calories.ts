import { Meal } from '../types/meal';
import { Recipe } from '../types/recipe';

// Računa ukupan broj kalorija za listu obroka.
//
// Funkcija je izdvojena iz UI-ja kako bismo istu logiku
// mogli da koristimo i na drugim ekranima.

export function calculateTotalCalories(
    meals: Meal[]
): number {
    return meals.reduce(
        (total, meal) => total + meal.calories,
        0
    );
}

// Tip koji predstavlja ukupan nutritivni pregled
// za određenu listu obroka.

export type NutritionTotals = {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
};

// Računa ukupne nutritivne vrednosti za listu obroka.
//
// Za svaki obrok pronalazimo odgovarajući recept preko recipeId.
// Ako recept postoji, njegove nutritivne vrednosti dodajemo u zbir.

export function calculateNutritionTotals(
    meals: Meal[],
    recipes: Recipe[]
): NutritionTotals {
    return meals.reduce(
        (totals, meal) => {
            const recipe = recipes.find(
                (recipe) => recipe.id === meal.recipeId
            );

            // Ako recept ne postoji, preskačemo taj obrok.
            if (!recipe) {
                return totals;
            }

            // Nutritivne vrednosti recepta množimo
            // brojem planiranih porcija.
            const servings = meal.servings || 1;

            return {
                calories:
                    totals.calories +
                    recipe.calories * servings,

                protein:
                    totals.protein +
                    recipe.protein * servings,

                carbohydrates:
                    totals.carbohydrates +
                    recipe.carbohydrates * servings,

                fat:
                    totals.fat +
                    recipe.fat * servings,
            };
        },
        {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
        }
    );
}
