import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { DEFAULT_LANGUAGE, Language, translations } from "../localization";

// =====================================================
// KLJUČ ZA ČUVANJE JEZIKA
// =====================================================

const LANGUAGE_STORAGE_KEY = "@nutriplan_language";

// =====================================================
// TIP KONTEKSTA
// =====================================================

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.sr;
};

// =====================================================
// KREIRANJE KONTEKSTA
// =====================================================

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// =====================================================
// PROVIDER
// =====================================================

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  // =====================================================
  // UČITAVANJE SAČUVANOG JEZIKA
  // =====================================================

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (
          savedLanguage === "sr" ||
          savedLanguage === "en" ||
          savedLanguage === "de"
        ) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error("Greška pri učitavanju jezika:", error);
      } finally {
        setIsLanguageLoaded(true);
      }
    };

    loadLanguage();
  }, []);

  // =====================================================
  // PROMENA I ČUVANJE JEZIKA
  // =====================================================

  const setLanguage = async (newLanguage: Language) => {
    try {
      setLanguageState(newLanguage);

      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error("Greška pri čuvanju jezika:", error);
    }
  };

  // =====================================================
  // PREVODI
  // =====================================================

  const t = useMemo(() => {
    return translations[language];
  }, [language]);

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage mora biti korišćen unutar LanguageProvider-a.",
    );
  }

  return context;
}
