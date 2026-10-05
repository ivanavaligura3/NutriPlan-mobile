import { Meal } from './meal';

// Predstavlja plan ishrane za jedan određeni dan.
// Jedan dan može sadržati više različitih obroka.

export type DailyPlan = {
    date: string;
    meals: Meal[];
};