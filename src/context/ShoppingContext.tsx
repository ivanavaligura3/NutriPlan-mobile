import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

import { useFoods } from "../context/FoodContext";
import { getFoodDatabaseItem } from "../services/foodDatabase.service";
import {
  addShoppingItem,
  deleteShoppingItem,
  getShoppingItems,
  syncAutomaticShoppingItems,
  updateShoppingItemPurchased,
} from "../services/shopping.service";
import { ShoppingItem } from "../types/shopping";

// =====================================================
// TIP PODATAKA KOJI DOLAZE SA BACKEND-A
// =====================================================

type BackendShoppingItem = {
  id: number;
  user_id: number;
  name: string;
  quantity: number;
  unit: string;
  is_purchased: number | boolean;
  is_automatic: number | boolean;
  created_at: string;
};

// =====================================================
// CONTEXT ZA SHOPPING LISTU
// =====================================================

type ShoppingContextType = {
  items: ShoppingItem[];
  addItem: (item: ShoppingItem) => Promise<void>;
  syncAutomaticItems: (date: string) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  togglePurchased: (itemId: number) => Promise<void>;
};

const ShoppingContext = createContext<ShoppingContextType | undefined>(
  undefined,
);

type ShoppingProviderProps = {
  children: ReactNode;
};

// =====================================================
// MAPIRANJE BACKEND PODATAKA U FRONTEND TIP
// =====================================================

const mapBackendShoppingItem = (item: BackendShoppingItem): ShoppingItem => {
  return {
    id: item.id,
    name: item.name,
    quantity: Number(item.quantity),
    unit: item.unit,
    isPurchased: item.is_purchased === true || item.is_purchased === 1,
    isAutomatic: item.is_automatic === true || item.is_automatic === 1,
  };
};

// =====================================================
// SHOPPING PROVIDER
// =====================================================

export function ShoppingProvider({ children }: ShoppingProviderProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<ShoppingItem[]>([]);

  const { addFood } = useFoods();

  // =====================================================
  // UČITAVANJE SHOPPING LISTE SA BACKEND-A
  // =====================================================

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const loadShoppingItems = async () => {
      try {
        const backendItems = await getShoppingItems();

        const mappedItems = backendItems.map(mapBackendShoppingItem);

        setItems(mappedItems);
      } catch (error) {
        console.error("Greška pri učitavanju shopping liste:", error);
      }
    };

    loadShoppingItems();
  }, [user?.id]);

  // =====================================================
  // DODAVANJE NOVE RUČNE STAVKE
  // =====================================================

  const addItem = async (item: ShoppingItem) => {
    try {
      const response = await addShoppingItem(
        item.name,
        item.quantity,
        item.unit,
      );

      const newItem: ShoppingItem = {
        ...item,
        id: response.itemId,
        isPurchased: false,
        isAutomatic: false,
      };

      setItems((currentItems) => [...currentItems, newItem]);
    } catch (error) {
      console.error("Greška pri dodavanju shopping stavke:", error);

      throw error;
    }
  };

  // =====================================================
  // SINHRONIZACIJA AUTOMATSKIH STAVKI SA BACKEND-OM
  // =====================================================

  const syncAutomaticItems = async (date: string) => {
    try {
      const backendItems = await syncAutomaticShoppingItems(date);

      const mappedItems = backendItems.map(mapBackendShoppingItem);

      setItems(mappedItems);
    } catch (error) {
      console.error(
        "Greška pri automatskoj sinhronizaciji shopping stavki:",
        error,
      );

      throw error;
    }
  };

  // =====================================================
  // BRISANJE SHOPPING STAVKE
  // =====================================================

  const removeItem = async (itemId: number) => {
    try {
      await deleteShoppingItem(itemId);

      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId),
      );
    } catch (error) {
      console.error("Greška pri brisanju shopping stavke:", error);

      throw error;
    }
  };

  // =====================================================
  // PROMENA STATUSA KUPOVINE
  // =====================================================

  const togglePurchased = async (itemId: number) => {
    const item = items.find((currentItem) => currentItem.id === itemId);

    if (!item) {
      return;
    }

    const newPurchasedState = !item.isPurchased;

    try {
      // Ako stavka prelazi u "kupljeno",
      // dodajemo je u Namirnice.
      if (newPurchasedState) {
        const databaseFood = await getFoodDatabaseItem(item.name);

        console.log("KUPOVINA - pronađena namirnica:", databaseFood);

        addFood({
          id: Date.now(),
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,

          calories:
            databaseFood?.calories !== null &&
            databaseFood?.calories !== undefined
              ? Number(databaseFood.calories)
              : null,

          protein:
            databaseFood?.protein !== null &&
            databaseFood?.protein !== undefined
              ? Number(databaseFood.protein)
              : null,

          carbohydrates:
            databaseFood?.carbohydrates !== null &&
            databaseFood?.carbohydrates !== undefined
              ? Number(databaseFood.carbohydrates)
              : null,

          fat:
            databaseFood?.fat !== null && databaseFood?.fat !== undefined
              ? Number(databaseFood.fat)
              : null,
        });
      }

      // Čuvamo novi status na backend-u.
      await updateShoppingItemPurchased(itemId, newPurchasedState);

      // Ažuriramo stanje u aplikaciji.
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === itemId
            ? {
                ...currentItem,
                isPurchased: newPurchasedState,
              }
            : currentItem,
        ),
      );
    } catch (error) {
      console.error("Greška pri promeni statusa shopping stavke:", error);

      throw error;
    }
  };

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <ShoppingContext.Provider
      value={{
        items,
        addItem,
        syncAutomaticItems,
        removeItem,
        togglePurchased,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}

// =====================================================
// HOOK ZA SHOPPING CONTEXT
// =====================================================

export function useShopping() {
  const context = useContext(ShoppingContext);

  if (!context) {
    throw new Error(
      "useShopping mora biti korišćen unutar ShoppingProvider komponente.",
    );
  }

  return context;
}
