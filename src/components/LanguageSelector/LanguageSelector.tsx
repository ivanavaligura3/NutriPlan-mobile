import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useLanguage } from "../../context/LanguageContext";
import { Language } from "../../localization";

import { createLanguageSelectorStyles } from "./LanguageSelector.styles";

// =====================================================
// PODACI O JEZICIMA
// =====================================================

const LANGUAGE_OPTIONS: {
  code: Language;
  label: string;
  flag: string;
}[] = [
  {
    code: "sr",
    label: "Srpski",
    flag: "🇷🇸",
  },
  {
    code: "en",
    label: "English",
    flag: "🇬🇧",
  },
  {
    code: "de",
    label: "Deutsch",
    flag: "🇩🇪",
  },
];

// =====================================================
// KOMPONENTA
// =====================================================

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);

  const styles = createLanguageSelectorStyles();

  const selectedLanguage = LANGUAGE_OPTIONS.find(
    (option) => option.code === language,
  );

  const handleSelectLanguage = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* IZABRANI JEZIK */}

      <Pressable
        style={styles.selector}
        onPress={() => setIsOpen((previous) => !previous)}
      >
        <View style={styles.selectedLanguage}>
          <Text style={styles.flag}>{selectedLanguage?.flag}</Text>

          <Text style={styles.selectedLabel}>{selectedLanguage?.label}</Text>
        </View>

        <Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
      </Pressable>

      {/* PADAJUĆA LISTA */}

      {isOpen && (
        <View style={styles.optionsContainer}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = option.code === language;

            return (
              <Pressable
                key={option.code}
                style={[styles.option, isSelected && styles.selectedOption]}
                onPress={() => handleSelectLanguage(option.code)}
              >
                <Text style={styles.flag}>{option.flag}</Text>

                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.selectedOptionLabel,
                  ]}
                >
                  {option.label}
                </Text>

                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
