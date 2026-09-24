import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from 'react';

import { Recipe } from '../types/recipe';
import { RECIPES } from '../constants/recipeData';

// Context za upravljanje receptima u mobilnoj aplikaciji.
// Za sada recepte čuvamo lokalno, a kasnije ćemo ih povezati
// sa NutriPlan backendom.

type RecipeContextType = {
    recipes: Recipe[];
    addRecipe: (recipe: Recipe) => void;
    removeRecipe: (recipeId: number) => void;
    updateRecipe: (recipe: Recipe) => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(
    undefined
);

type RecipeProviderProps = {
    children: ReactNode;
};

export function RecipeProvider({
    children,
}: RecipeProviderProps) {
    const [recipes, setRecipes] = useState<Recipe[]>(RECIPES);
    const addRecipe = (recipe: Recipe) => {
        setRecipes((currentRecipes) => [
            ...currentRecipes,
            recipe,
        ]);
    };

    const removeRecipe = (recipeId: number) => {
        setRecipes((currentRecipes) =>
            currentRecipes.filter(
                (recipe) => recipe.id !== recipeId
            )
        );
    };

    const updateRecipe = (updatedRecipe: Recipe) => {
        setRecipes((currentRecipes) =>
            currentRecipes.map((recipe) =>
                recipe.id === updatedRecipe.id
                    ? updatedRecipe
                    : recipe
                )
            );
    };

    return (
        <RecipeContext.Provider
            value={{
                recipes,
                addRecipe,
                removeRecipe,
                updateRecipe,
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
            'useRecipes mora biti korišćen unutar RecipeProvider komponente.'
        );
    }

    return context;
}