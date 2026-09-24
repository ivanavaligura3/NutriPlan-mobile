import { Food } from '../types/food';

// Početni podaci o namirnicama.
// Kasnije će ove podatke zameniti podaci iz backend-a.

export const FOODS: Food[] = [
    {
        id: 1,
        name: 'Pileći file',
        quantity: 500,
        unit: 'g',
    },
    {
        id: 2,
        name: 'Pirinač',
        quantity: 1,
        unit: 'kg',
    },
    {
        id: 3,
        name: 'Paradajz',
        quantity: 4,
        unit: 'kom',
    },
    {
        id: 4,
        name: 'Jaja',
        quantity: 10,
        unit: 'kom',
    },
    {
        id: 5,
        name: 'Mleko',
        quantity: 1,
        unit: 'l',
    },
    {
        id: 6,
        name: 'Banana',
        quantity: 6,
        unit: 'kom',
    },
    {
        id: 7,
        name: 'Tunjevina',
        quantity: 3,
        unit: 'kom',
    },
];
