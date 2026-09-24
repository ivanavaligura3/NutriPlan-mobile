import { ShoppingItem } from '../types/shopping';

// Početni testni podaci za listu za kupovinu.
// Kasnije ćemo ove podatke generisati automatski
// na osnovu planiranih obroka.

export const SHOPPING_ITEMS: ShoppingItem[] = [
    {
        id: 1,
        name: 'Pileći file',
        quantity: 1,
        unit: 'kg',
        isPurchased: false,
    },
    {
        id: 2,
        name: 'Paradajz',
        quantity: 5,
        unit: 'kom',
        isPurchased: false,
    },
    {
        id: 3,
        name: 'Mleko',
        quantity: 2,
        unit: 'l',
        isPurchased: true,
    },
]