import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingItem } from '../types/shopping';
import { SHOPPING_ITEMS } from "../constants/shoppingData";

// Context za upravljanje listom za kupovinu.
// Za sada podatke čuvamo lokalno, a kasnije ćemo ih
// povezati sa backendom i automatskim generisanjem liste.

type ShoppingContextType = {
    items: ShoppingItem[];
    addItem: (item: ShoppingItem) => void;
    removeItem: (itemId: number) => void;
    togglePurchased: (itemId: number) => void;
};

const ShoppingContext = createContext<
    ShoppingContextType | undefined
>(undefined);

type ShoppingProviderProps = {
    children: ReactNode;
};

export function ShoppingProvider({
    children,
}: ShoppingProviderProps) {
    const [items, setItems] =
        useState<ShoppingItem[]>(SHOPPING_ITEMS);
    
    const addItem = (item: ShoppingItem) => {
        setItems((currentItems) => [
            ...currentItems,
            item,
        ]);
    };

    const removeItem = (itemId: number) => {
        setItems((currentItems) =>
            currentItems.filter(
                (item) => item.id !== itemId
            )
        );
    };

    const togglePurchased = (itemId: number) => {
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        isPurchased: !item.isPurchased,
                      }
                    : item
            )
        );
    };

    return (
        <ShoppingContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                togglePurchased,
            }}
        >
            {children}
        </ShoppingContext.Provider>
    );
}

export function useShopping() {
    const context = useContext(ShoppingContext);

    if (!context) {
        throw new Error(
            'useShopping mora biti korišćen unutar ShoppingProvider komponente.'
        );
    }
    return context;
}