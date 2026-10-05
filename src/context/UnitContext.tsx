import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

// =====================================================
// TIP JEDINICA MERE
// =====================================================

export type UnitSystem = "metric" | "standard";

// =====================================================
// KLJUČ ZA ČUVANJE JEDINICA
// =====================================================

const UNIT_STORAGE_KEY = "@nutriplan_units";

// =====================================================
// TIP KONTEKSTA
// =====================================================

type UnitContextType = {
  unitSystem: UnitSystem;
  setUnitSystem: (unitSystem: UnitSystem) => void;
};

// =====================================================
// KREIRANJE KONTEKSTA
// =====================================================

const UnitContext = createContext<UnitContextType | undefined>(undefined);

// =====================================================
// PROVIDER
// =====================================================

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("metric");

  // =====================================================
  // UČITAVANJE SAČUVANIH JEDINICA
  // =====================================================

  useEffect(() => {
    const loadUnitSystem = async () => {
      try {
        const savedUnitSystem = await AsyncStorage.getItem(UNIT_STORAGE_KEY);

        if (savedUnitSystem === "metric" || savedUnitSystem === "standard") {
          setUnitSystemState(savedUnitSystem);
        }
      } catch (error) {
        console.error("Greška pri učitavanju jedinica mere:", error);
      }
    };

    loadUnitSystem();
  }, []);

  // =====================================================
  // PROMENA I ČUVANJE JEDINICA
  // =====================================================

  const setUnitSystem = async (newUnitSystem: UnitSystem) => {
    try {
      setUnitSystemState(newUnitSystem);

      await AsyncStorage.setItem(UNIT_STORAGE_KEY, newUnitSystem);
    } catch (error) {
      console.error("Greška pri čuvanju jedinica mere:", error);
    }
  };

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <UnitContext.Provider
      value={{
        unitSystem,
        setUnitSystem,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useUnits() {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error("useUnits mora biti korišćen unutar UnitProvider-a.");
  }

  return context;
}
