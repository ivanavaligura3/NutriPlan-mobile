import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { DARK_COLORS, LIGHT_COLORS } from "../styles/colors";

// =====================================================
// KLJUČ ZA ČUVANJE TEME
// =====================================================

const THEME_STORAGE_KEY = "@nutriplan_theme";

// =====================================================
// TIP TEME
// =====================================================

type ThemeMode = "light" | "dark";

// =====================================================
// TIP KONTEKSTA
// =====================================================

type ThemeContextType = {
  themeMode: ThemeMode;
  colors: typeof LIGHT_COLORS;
  setThemeMode: (mode: ThemeMode) => void;
};

// =====================================================
// KREIRANJE KONTEKSTA
// =====================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =====================================================
// PROVIDER
// =====================================================

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");

  // =====================================================
  // UČITAVANJE SAČUVANE TEME
  // =====================================================

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme === "light" || savedTheme === "dark") {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        console.error("Greška pri učitavanju teme:", error);
      }
    };

    loadTheme();
  }, []);

  // =====================================================
  // PROMENA I ČUVANJE TEME
  // =====================================================

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);

      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Greška pri čuvanju teme:", error);
    }
  };

  // =====================================================
  // BOJE TRENUTNE TEME
  // =====================================================

  const colors = useMemo(() => {
    return themeMode === "dark" ? DARK_COLORS : LIGHT_COLORS;
  }, [themeMode]);

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        colors,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme mora biti korišćen unutar ThemeProvider-a.");
  }

  return context;
}
