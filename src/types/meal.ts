// Tip podatka koji predstavljaju jedan obrok.
// Koristićemo ga na svim mestima gde prikazujemo ili obrađujemo obroke.

export type Meal = {
    id: number;
    dateId: number;
    mealType: string;
    mealName: string;
    calories: number;
};