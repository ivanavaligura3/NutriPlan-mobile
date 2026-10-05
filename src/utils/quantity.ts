/**
 * Pretvara količinu u osnovnu jedinicu.
 *
 * Podržane jedinice:
 * - g / kg
 * - ml / l
 *
 * Ostale jedinice ostaju nepromenjene.
 */
export function convertToBaseQuantity(
  quantity: number,
  unit: string,
): {
  quantity: number;
  unit: string;
} {
  const normalizedUnit = unit.trim().toLowerCase();

  if (normalizedUnit === "kg") {
    return {
      quantity: quantity * 1000,
      unit: "g",
    };
  }

  if (normalizedUnit === "l") {
    return {
      quantity: quantity * 1000,
      unit: "ml",
    };
  }

  return {
    quantity,
    unit: normalizedUnit,
  };
}

/**
 * Sabira dve količine iste namirnice.
 *
 * Ako su jedinice kompatibilne (g/kg ili ml/l),
 * količine se prvo pretvaraju u osnovnu jedinicu.
 */
export function addQuantities(
  firstQuantity: number,
  firstUnit: string,
  secondQuantity: number,
  secondUnit: string,
): {
  quantity: number;
  unit: string;
} | null {
  const first = convertToBaseQuantity(firstQuantity, firstUnit);

  const second = convertToBaseQuantity(secondQuantity, secondUnit);

  if (first.unit !== second.unit) {
    return null;
  }

  return {
    quantity: first.quantity + second.quantity,
    unit: first.unit,
  };
}

/**
 * Pretvara količinu iz osnovne jedinice u praktičniji prikaz.
 *
 * Na primer:
 * 1500 g -> 1.5 kg
 * 500 g -> 500 g
 * 1500 ml -> 1.5 l
 */
export function formatQuantity(
  quantity: number,
  unit: string,
): {
  quantity: number;
  unit: string;
} {
  if (unit === "g" && quantity >= 1000) {
    return {
      quantity: quantity / 1000,
      unit: "kg",
    };
  }

  if (unit === "ml" && quantity >= 1000) {
    return {
      quantity: quantity / 1000,
      unit: "l",
    };
  }

  return {
    quantity,
    unit,
  };
}

/**
 * Oduzima jednu količinu od druge.
 *
 * Ako su jedinice kompatibilne (g/kg ili ml/l),
 * količine se prvo pretvaraju u osnovnu jedinicu.
 *
 * Rezultat predstavlja količinu koja nedostaje.
 * Ako je postojeća količina veća ili jednaka potrebnoj,
 * rezultat je 0.
 */
export function subtractQuantities(
  requiredQuantity: number,
  requiredUnit: string,
  availableQuantity: number,
  availableUnit: string,
): {
  quantity: number;
  unit: string;
} | null {
  const required = convertToBaseQuantity(requiredQuantity, requiredUnit);

  const available = convertToBaseQuantity(availableQuantity, availableUnit);

  // Jedinice nisu kompatibilne.
  if (required.unit !== available.unit) {
    return null;
  }

  const missingQuantity = required.quantity - available.quantity;

  // Ako već imamo dovoljno namirnice,
  // ništa ne treba kupiti.
  if (missingQuantity <= 0) {
    return {
      quantity: 0,
      unit: required.unit,
    };
  }

  return {
    quantity: missingQuantity,
    unit: required.unit,
  };
}
