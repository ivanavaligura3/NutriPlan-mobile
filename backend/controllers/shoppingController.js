const shoppingModel = require("../models/shoppingModel");

// =====================================================
// POMOĆNE FUNKCIJE ZA RAD SA KOLIČINAMA
// =====================================================

/**
 * Pretvara količinu u osnovnu jedinicu.
 *
 * Podržane jedinice:
 * - kg -> g
 * - g -> g
 * - l -> ml
 * - ml -> ml
 *
 * Ostale jedinice ostaju nepromenjene.
 */
const convertToBaseQuantity = (quantity, unit) => {
  const normalizedUnit = String(unit).trim().toLowerCase();

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
};

/**
 * Pretvara osnovnu jedinicu u praktičniji prikaz.
 *
 * Na primer:
 * 1500 g -> 1.5 kg
 * 500 g -> 500 g
 * 1500 ml -> 1.5 l
 */
const formatQuantity = (quantity, unit) => {
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
};

// =====================================================
// DOHVATANJE SHOPPING LISTE
// =====================================================

const getShoppingItems = async (req, res) => {
  try {
    const userId = req.user.userId;

    const items = await shoppingModel.getShoppingItemsByUserId(userId);

    return res.status(200).json(items);
  } catch (error) {
    console.error("Greška pri dohvatanju shopping liste:", error);

    return res.status(500).json({
      message: "Greška na serveru pri dohvatanju shopping liste.",
    });
  }
};

// =====================================================
// DODAVANJE STAVKE
// =====================================================

const addShoppingItem = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name, quantity, unit } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        message: "Naziv namirnice je obavezan.",
      });
    }

    if (quantity === undefined || quantity === null || Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Količina mora biti veća od 0.",
      });
    }

    if (!unit || !String(unit).trim()) {
      return res.status(400).json({
        message: "Jedinica je obavezna.",
      });
    }

    const itemId = await shoppingModel.createShoppingItem({
      userId,
      name: String(name).trim(),
      quantity: Number(quantity),
      unit: String(unit).trim(),
      isAutomatic: false,
    });

    return res.status(201).json({
      message: "Stavka je uspešno dodata.",
      itemId,
    });
  } catch (error) {
    console.error("Greška pri dodavanju shopping stavke:", error);

    return res.status(500).json({
      message: "Greška na serveru pri dodavanju stavke.",
    });
  }
};

// =====================================================
// PROMENA STATUSA KUPOVINE
// =====================================================

const updateShoppingItemPurchased = async (req, res) => {
  try {
    const userId = req.user.userId;
    const itemId = Number(req.params.id);

    const { isPurchased } = req.body;

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        message: "Neispravan ID shopping stavke.",
      });
    }

    if (typeof isPurchased !== "boolean") {
      return res.status(400).json({
        message: "isPurchased mora biti boolean vrednost.",
      });
    }

    const affectedRows = await shoppingModel.updateShoppingItemPurchased({
      userId,
      itemId,
      isPurchased,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Shopping stavka nije pronađena.",
      });
    }

    return res.status(200).json({
      message: "Status shopping stavke je uspešno promenjen.",
    });
  } catch (error) {
    console.error("Greška pri promeni statusa shopping stavke:", error);

    return res.status(500).json({
      message: "Greška na serveru pri promeni statusa stavke.",
    });
  }
};

// =====================================================
// BRISANJE STAVKE
// =====================================================

const deleteShoppingItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const itemId = Number(req.params.id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        message: "Neispravan ID shopping stavke.",
      });
    }

    const affectedRows = await shoppingModel.deleteShoppingItem({
      userId,
      itemId,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Shopping stavka nije pronađena.",
      });
    }

    return res.status(200).json({
      message: "Shopping stavka je uspešno obrisana.",
    });
  } catch (error) {
    console.error("Greška pri brisanju shopping stavke:", error);

    return res.status(500).json({
      message: "Greška pri brisanju shopping stavke.",
    });
  }
};

// =====================================================
// DOHVATANJE SASTOJAKA PLANIRANIH OBROKA
// =====================================================

const getPlannedIngredients = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Datum je obavezan.",
      });
    }

    const ingredients = await shoppingModel.getPlannedIngredientsByDate({
      userId,
      date,
    });

    // =====================================================
    // IZRAČUNAVANJE POTREBNE KOLIČINE PREMA PORCIJAMA
    // =====================================================

    const calculatedIngredients = ingredients.map((ingredient) => {
      const recipeServings = Number(ingredient.recipe_servings);
      const mealServings = Number(ingredient.meal_servings);
      const ingredientQuantity = Number(ingredient.quantity);

      let requiredQuantity = 0;

      if (recipeServings > 0 && ingredientQuantity > 0) {
        requiredQuantity = (ingredientQuantity / recipeServings) * mealServings;
      }

      return {
        ...ingredient,
        required_quantity: Number(requiredQuantity.toFixed(2)),
      };
    });

    return res.status(200).json(calculatedIngredients);
  } catch (error) {
    console.error("Greška pri dohvatanju sastojaka planiranih obroka:", error);

    return res.status(500).json({
      message: "Greška na serveru pri dohvatanju sastojaka planiranih obroka.",
    });
  }
};

// =====================================================
// AUTOMATSKA SINHRONIZACIJA SHOPPING STAVKI
// =====================================================

const syncAutomaticShoppingItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Datum je obavezan.",
      });
    }

    // =====================================================
    // 1. DOHVATANJE SASTOJAKA PLANIRANIH OBROKA
    // =====================================================

    const ingredients = await shoppingModel.getPlannedIngredientsByDate({
      userId,
      date,
    });

    // =====================================================
    // 2. DOHVATANJE POSTOJEĆIH NAMIRNICA KORISNIKA
    // =====================================================

    const userFoods = await shoppingModel.getUserFoodsForShopping(userId);

    // =====================================================
    // 3. IZRAČUNAVANJE POTREBNE KOLIČINE
    // =====================================================

    const calculatedIngredients = ingredients.map((ingredient) => {
      const recipeServings = Number(ingredient.recipe_servings);
      const mealServings = Number(ingredient.meal_servings);
      const ingredientQuantity = Number(ingredient.quantity);

      let requiredQuantity = 0;

      if (recipeServings > 0 && ingredientQuantity > 0) {
        requiredQuantity = (ingredientQuantity / recipeServings) * mealServings;
      }

      return {
        name: ingredient.food_name,
        unit: String(ingredient.unit).trim(),
        quantity: Number(requiredQuantity.toFixed(2)),
      };
    });

    // =====================================================
    // 4. GRUPISANJE PLANIRANIH NAMIRNICA
    // =====================================================
    //
    // Ovde ih prvo pretvaramo u osnovne jedinice.
    //
    // Na primer:
    // 500 g + 1 kg = 1500 g
    //
    // Tako možemo pravilno da poredimo plan sa zalihama.
    // =====================================================

    const groupedIngredients = {};

    calculatedIngredients.forEach((ingredient) => {
      const converted = convertToBaseQuantity(
        ingredient.quantity,
        ingredient.unit,
      );

      const key =
        `${ingredient.name.trim().toLowerCase()}__` + `${converted.unit}`;

      if (!groupedIngredients[key]) {
        groupedIngredients[key] = {
          name: ingredient.name.trim(),
          unit: converted.unit,
          quantity: 0,
        };
      }

      groupedIngredients[key].quantity += converted.quantity;
    });

    // =====================================================
    // 5. GRUPISANJE POSTOJEĆIH NAMIRNICA IZ FOODS
    // =====================================================
    //
    // Ako korisnik ima:
    //
    // Pileći file - 1 kg
    // Pileći file - 500 g
    //
    // backend ih tretira kao:
    //
    // Pileći file - 1500 g
    // =====================================================

    const availableFoods = {};

    userFoods.forEach((food) => {
      const converted = convertToBaseQuantity(Number(food.quantity), food.unit);

      const key =
        `${String(food.name).trim().toLowerCase()}__` + `${converted.unit}`;

      if (!availableFoods[key]) {
        availableFoods[key] = {
          quantity: 0,
          unit: converted.unit,
        };
      }

      availableFoods[key].quantity += converted.quantity;
    });

    // =====================================================
    // 6. ODUZIMANJE POSTOJEĆIH NAMIRNICA
    // =====================================================

    const automaticIngredients = [];

    Object.values(groupedIngredients).forEach((ingredient) => {
      const key =
        `${ingredient.name.trim().toLowerCase()}__` + `${ingredient.unit}`;

      const availableFood = availableFoods[key];

      // ---------------------------------------------------
      // Ako imamo odgovarajuću namirnicu u zalihama
      // ---------------------------------------------------

      if (availableFood) {
        const missingQuantity = ingredient.quantity - availableFood.quantity;

        // Ako imamo dovoljno namirnice,
        // nema potrebe za kupovinom.
        if (missingQuantity <= 0) {
          return;
        }

        const formatted = formatQuantity(missingQuantity, ingredient.unit);

        automaticIngredients.push({
          name: ingredient.name,
          unit: formatted.unit,
          quantity: Number(formatted.quantity.toFixed(2)),
        });

        return;
      }

      // ---------------------------------------------------
      // Ako namirnice uopšte nemamo,
      // potrebna je cela količina.
      // ---------------------------------------------------

      const formatted = formatQuantity(ingredient.quantity, ingredient.unit);

      automaticIngredients.push({
        name: ingredient.name,
        unit: formatted.unit,
        quantity: Number(formatted.quantity.toFixed(2)),
      });
    });

    // =====================================================
    // 7. POSTOJEĆE AUTOMATSKE STAVKE
    // =====================================================

    const existingAutomaticItems =
      await shoppingModel.getAutomaticShoppingItems(userId);

    const existingByKey = new Map();

    existingAutomaticItems.forEach((item) => {
      const converted = convertToBaseQuantity(Number(item.quantity), item.unit);

      const key = `${item.name.trim().toLowerCase()}__` + `${converted.unit}`;

      existingByKey.set(key, item);
    });

    const currentKeys = new Set();

    // =====================================================
    // 8. AŽURIRANJE ILI DODAVANJE AUTOMATSKIH STAVKI
    // =====================================================

    for (const ingredient of automaticIngredients) {
      const converted = convertToBaseQuantity(
        ingredient.quantity,
        ingredient.unit,
      );

      const key =
        `${ingredient.name.trim().toLowerCase()}__` + `${converted.unit}`;

      currentKeys.add(key);

      const existingItem = existingByKey.get(key);

      if (existingItem) {
        await shoppingModel.updateAutomaticShoppingItem({
          userId,
          itemId: existingItem.id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        });
      } else {
        await shoppingModel.createShoppingItem({
          userId,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          isAutomatic: true,
        });
      }
    }

    // =====================================================
    // 9. BRISANJE AUTOMATSKIH STAVKI KOJE VIŠE NISU POTREBNE
    // =====================================================

    const obsoleteItemIds = existingAutomaticItems
      .filter((item) => {
        const converted = convertToBaseQuantity(
          Number(item.quantity),
          item.unit,
        );

        const key = `${item.name.trim().toLowerCase()}__` + `${converted.unit}`;

        return !currentKeys.has(key);
      })
      .map((item) => item.id);

    await shoppingModel.deleteAutomaticShoppingItems(userId, obsoleteItemIds);

    // =====================================================
    // 10. DOHVATANJE KONAČNE SHOPPING LISTE
    // =====================================================

    const updatedItems = await shoppingModel.getShoppingItemsByUserId(userId);

    return res.status(200).json({
      message: "Automatske shopping stavke su uspešno sinhronizovane.",
      items: updatedItems,
    });
  } catch (error) {
    console.error(
      "Greška pri automatskoj sinhronizaciji shopping stavki:",
      error,
    );

    return res.status(500).json({
      message: "Greška pri automatskoj sinhronizaciji shopping stavki.",
    });
  }
};

module.exports = {
  getShoppingItems,
  addShoppingItem,
  updateShoppingItemPurchased,
  deleteShoppingItem,
  getPlannedIngredients,
  syncAutomaticShoppingItems,
};
