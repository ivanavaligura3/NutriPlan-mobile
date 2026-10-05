// =====================================================
// TIPOVI JEDINICA
// =====================================================

export type Unit = "g" | "kg" | "ml" | "l" | string;

// =====================================================
// REZULTAT PRIKAZA KOLIČINE
// =====================================================

export type DisplayQuantity = {
  quantity: number;
  unit: string;
};

// =====================================================
// ZAOKRUŽIVANJE
// =====================================================

const roundQuantity = (quantity: number): number => {
  return Number(quantity.toFixed(2));
};

// =====================================================
// PRETVARANJE U OSNOVNU JEDINICU
// =====================================================

export const convertToBaseQuantity = (quantity: number, unit: Unit): number => {
  if (unit === "kg") {
    return quantity * 1000;
  }

  if (unit === "l") {
    return quantity * 1000;
  }

  return quantity;
};

// =====================================================
// PRIKAZ KOLIČINE U GRAMIMA / MILILITRIMA
// =====================================================

const formatSmallUnits = (quantity: number, unit: Unit): DisplayQuantity => {
  const baseQuantity = convertToBaseQuantity(quantity, unit);

  if (unit === "g" || unit === "kg") {
    return {
      quantity: roundQuantity(baseQuantity),
      unit: "g",
    };
  }

  if (unit === "ml" || unit === "l") {
    return {
      quantity: roundQuantity(baseQuantity),
      unit: "ml",
    };
  }

  return {
    quantity: roundQuantity(quantity),
    unit,
  };
};

// =====================================================
// PRIKAZ KOLIČINE U KILOGRAMIMA / LITRIMA
// =====================================================

const formatLargeUnits = (quantity: number, unit: Unit): DisplayQuantity => {
  const baseQuantity = convertToBaseQuantity(quantity, unit);

  if (unit === "g" || unit === "kg") {
    return {
      quantity: roundQuantity(baseQuantity / 1000),
      unit: "kg",
    };
  }

  if (unit === "ml" || unit === "l") {
    return {
      quantity: roundQuantity(baseQuantity / 1000),
      unit: "l",
    };
  }

  return {
    quantity: roundQuantity(quantity),
    unit,
  };
};

// =====================================================
// PRIKAZ KOLIČINE PREMA IZABRANOM SISTEMU
// =====================================================

export const formatQuantityForDisplay = (
  quantity: number,
  unit: Unit,
  unitSystem: "metric" | "standard",
): DisplayQuantity => {
  if (unitSystem === "metric") {
    return formatSmallUnits(quantity, unit);
  }

  return formatLargeUnits(quantity, unit);
};
