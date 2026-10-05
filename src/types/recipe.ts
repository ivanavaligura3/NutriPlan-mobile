export type RecipeIngredient = {
  id: number;
  name: string;
  quantity: number;
  unit: string;

  offCalories?: number;
  offProtein?: number;
  offCarbohydrates?: number;
  offFat?: number;
};

export type RecipeStep = {
  id: number;
  stepNumber: number;
  description: string;
};

export type Recipe = {
  id: number;
  name: string;
  description: string;
  calories: number;

  // Nutritivne vrednosti recepta.
  protein: number;
  carbohydrates: number;
  fat: number;

  preparationTime: number;
  servings: number;
  ingredients: RecipeIngredient[];
  preparationSteps: RecipeStep[];
};
