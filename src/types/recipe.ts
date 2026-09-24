export type RecipeIngredient = {
    id: number;
    name: string;
    quantity: number;
    unit: string;
};

export type Recipe = {
    id: number;
    name: string;
    description: string;
    calories: number;
    preparationTime: number;
    ingredients: RecipeIngredient[];
    preparationSteps: string[];
};