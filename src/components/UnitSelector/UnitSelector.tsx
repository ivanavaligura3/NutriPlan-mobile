import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useUnits } from "../../context/UnitContext";

import { createUnitSelectorStyles } from "./UnitSelector.styles";

// =====================================================
// PODACI O SISTEMIMA JEDINICA
// =====================================================

const UNIT_OPTIONS = [
  {
    code: "metric" as const,
    label: "g / ml",
  },
  {
    code: "standard" as const,
    label: "kg / l",
  },
];

// =====================================================
// KOMPONENTA
// =====================================================

export default function UnitSelector() {
  const { unitSystem, setUnitSystem } = useUnits();

  const [isOpen, setIsOpen] = useState(false);

  const styles = createUnitSelectorStyles();

  const selectedUnit = UNIT_OPTIONS.find(
    (option) => option.code === unitSystem,
  );

  const handleSelectUnit = (selectedSystem: "metric" | "standard") => {
    setUnitSystem(selectedSystem);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* IZABRANE JEDINICE */}

      <Pressable
        style={styles.selector}
        onPress={() => setIsOpen((previous) => !previous)}
      >
        <Text style={styles.selectedLabel}>{selectedUnit?.label}</Text>

        <Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
      </Pressable>

      {/* PADAJUĆA LISTA */}

      {isOpen && (
        <View style={styles.optionsContainer}>
          {UNIT_OPTIONS.map((option) => {
            const isSelected = option.code === unitSystem;

            return (
              <Pressable
                key={option.code}
                style={[styles.option, isSelected && styles.selectedOption]}
                onPress={() => handleSelectUnit(option.code)}
              >
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
