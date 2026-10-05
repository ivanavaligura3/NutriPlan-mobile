export type Food = {
    id: number;
    name: string;
    quantity: number;
    unit: string;

    calories: number | null;
    protein: number | null;
    carbohydrates: number | null;
    fat: number | null;
};