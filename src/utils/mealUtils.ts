import { Meal } from '../types/meal';
import {
    Recipe,
    RecipeIngredient,
} from '../types/recipe';
import { Food } from '../types/food';

import {
    addQuantities,
    formatQuantity,
} from './quantity';

/**
 * Vraća recepte koji su povezani sa obrocima
 * određenog datuma.
 *
 * Datum se prosleđuje u formatu:
 * YYYY-MM-DD
 */
export function getRecipesForDay(
    meals: Meal[],
    recipes: Recipe[],
    date: string
): Recipe[] {
    const mealsForDay = meals.filter(
        (meal) => meal.date === date
    );

    return mealsForDay
        .map((meal) =>
            recipes.find(
                (recipe) => recipe.id === meal.recipeId
            )
        )
        .filter(
            (recipe): recipe is Recipe =>
                recipe !== undefined
        );
}

/**
 * Vraća sve sastojke koji su potrebni za recepte
 * planirane određenog datuma.
 */
export function getIngredientsForDay(
    meals: Meal[],
    recipes: Recipe[],
    date: string
): RecipeIngredient[] {
    // Uzimamo samo obroke planirane za izabrani dan.
    const mealsForDay = meals.filter(
        (meal) => meal.date === date
    );

    return mealsForDay.flatMap((meal) => {
        // Pronalazimo recept koji pripada obroku.
        const recipe = recipes.find(
            (recipe) => recipe.id === meal.recipeId
        );

        // Ako recept ne postoji, preskačemo taj obrok.
        if (!recipe) {
            return [];
        }

        // Količinu svakog sastojka množimo
        // brojem planiranih porcija.
        return recipe.ingredients.map((ingredient) => ({
            ...ingredient,
            quantity: ingredient.quantity * meal.servings,
        }));
    });
}

/**
 * Proverava da li su dve jedinice međusobno kompatibilne.
 *
 * Kompatibilne jedinice:
 * - g i kg
 * - ml i l
 * - iste jedinice
 *
 * Jedinice poput g i kom nisu kompatibilne jer
 * aplikacija ne zna koliko grama ima jedna jedinica.
 */
function areUnitsCompatible(
    firstUnit: string,
    secondUnit: string
): boolean {
    const first = firstUnit.trim().toLowerCase();
    const second = secondUnit.trim().toLowerCase();

    if (first === second) {
        return true;
    }

    const weightUnits = ['g', 'kg'];
    const volumeUnits = ['ml', 'l'];

    const firstIsWeight = weightUnits.includes(first);
    const secondIsWeight = weightUnits.includes(second);

    const firstIsVolume = volumeUnits.includes(first);
    const secondIsVolume = volumeUnits.includes(second);

    return (
        (firstIsWeight && secondIsWeight) ||
        (firstIsVolume && secondIsVolume)
    );
}

/**
 * Normalizuje naziv namirnice radi lakšeg poređenja.
 *
 * Uklanja razmake i velika slova,
 * a poznate varijante naziva svodi na isti naziv.
 */
function normalizeFoodName(name: string): string {
    const normalized = name.trim().toLowerCase();

    const aliases: Record<string, string> = {
        banane: 'banana',
    };

    return aliases[normalized] ?? normalized;
}

/**
 * Grupisanje istih namirnica i sabiranje njihovih količina.
 *
 * Namirnice se grupišu prema nazivu.
 * Ako su jedinice kompatibilne, količine se sabiraju.
 *
 * Ako jedinice nisu kompatibilne, stavke se ne sabiraju.
 */
export function getGroupedIngredientsForDay(
    meals: Meal[],
    recipes: Recipe[],
    date: string
): RecipeIngredient[] {
    const ingredients = getIngredientsForDay(
        meals,
        recipes,
        date
    );

    const groupedIngredients: RecipeIngredient[] = [];

    ingredients.forEach((ingredient) => {
        const existingIngredientIndex =
            groupedIngredients.findIndex(
                (item) =>
                    normalizeFoodName(item.name) ===
                        normalizeFoodName(ingredient.name) &&
                    areUnitsCompatible(
                        item.unit,
                        ingredient.unit
                    )
            );

        // Ako ne postoji kompatibilna stavka,
        // dodajemo novu stavku.
        if (existingIngredientIndex === -1) {
            groupedIngredients.push({
                ...ingredient,
            });

            return;
        }

        const existingIngredient =
            groupedIngredients[
                existingIngredientIndex
            ];

        const summedQuantity = addQuantities(
            existingIngredient.quantity,
            existingIngredient.unit,
            ingredient.quantity,
            ingredient.unit
        );

        // Ako količine ipak ne mogu da se saberu,
        // ostavljamo ih kao odvojene stavke.
        if (!summedQuantity) {
            groupedIngredients.push({
                ...ingredient,
            });

            return;
        }

        const formattedQuantity = formatQuantity(
            summedQuantity.quantity,
            summedQuantity.unit
        );

        groupedIngredients[
            existingIngredientIndex
        ] = {
            ...existingIngredient,
            quantity: formattedQuantity.quantity,
            unit: formattedQuantity.unit,
        };
    });

    return groupedIngredients;
}

/**
 * Vraća namirnice koje nedostaju za planirane obroke
 * određenog datuma.
 *
 * Potrebne količine iz recepata porede se sa količinama
 * koje korisnik trenutno ima u svojim zalihama.
 */
export function getShoppingIngredientsForDay(
    meals: Meal[],
    recipes: Recipe[],
    foods: Food[],
    date: string
): RecipeIngredient[] {
    const requiredIngredients =
        getGroupedIngredientsForDay(
            meals,
            recipes,
            date
        );

    return requiredIngredients
        .map((ingredient) => {
            // Pronalazimo sve zalihe iste namirnice
            // koje imaju kompatibilnu jedinicu.
            const compatibleFoods = foods.filter(
                (food) =>
                    normalizeFoodName(food.name) ===
                        normalizeFoodName(ingredient.name) &&
                    areUnitsCompatible(
                        ingredient.unit,
                        food.unit
                    )
            );

            // Ako nema nijedne kompatibilne namirnice,
            // cela potrebna količina nedostaje.
            if (compatibleFoods.length === 0) {
                return {
                    ...ingredient,
                };
            }

            // Sabiramo sve kompatibilne količine
            // iste namirnice.
            let availableQuantity = 0;

            for (const food of compatibleFoods) {
                const availableInBase = addQuantities(
                    0,
                    ingredient.unit,
                    food.quantity,
                    food.unit
                );

                if (availableInBase) {
                    availableQuantity +=
                        availableInBase.quantity;
                }
            }

            // Pretvaramo potrebnu količinu u osnovnu jedinicu.
            const requiredInBase = addQuantities(
                0,
                ingredient.unit,
                ingredient.quantity,
                ingredient.unit
            );

            if (!requiredInBase) {
                return {
                    ...ingredient,
                };
            }

            // Izračunavamo koliko još nedostaje.
            const missingQuantity =
                requiredInBase.quantity -
                availableQuantity;

            // Ako imamo dovoljno namirnice,
            // ona se više ne prikazuje na Home ekranu.
            if (missingQuantity <= 0) {
                return null;
            }

            const formattedQuantity = formatQuantity(
                missingQuantity,
                requiredInBase.unit
            );

            return {
                ...ingredient,
                quantity:
                    formattedQuantity.quantity,
                unit:
                    formattedQuantity.unit,
            };
        })
        .filter(
            (ingredient): ingredient is RecipeIngredient =>
                ingredient !== null
        );
}