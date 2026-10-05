import { de } from "./de";
import { en } from "./en";
import { sr } from "./sr";

// =====================================================
// DOSTUPNI JEZICI
// =====================================================

export const translations = {
  sr,
  en,
  de,
};

export type Language = keyof typeof translations;

// =====================================================
// PODRAZUMEVANI JEZIK
// =====================================================

export const DEFAULT_LANGUAGE: Language = "sr";
