// Tip podatka koji predstavlja jedan obrok.
// Koristićemo ga na svim mestima gde prikazujemo
// ili obrađujemo obroke.

export type Meal = {
  id: number;
  date: string;
  mealType: string;
  recipeId: number;
  mealName: string;
  time: string;

  // Nutritivne vrednosti recepta
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;

  // Broj porcija
  servings: number;
  isCompleted: boolean;
  recipeServings: number;
};
