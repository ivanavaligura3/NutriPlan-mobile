const pool = require("../config/database");

// =====================================================
// DOHVATANJE STAVKI SHOPPING LISTE
// =====================================================

const getShoppingItemsByUserId = async (userId) => {
  const [items] = await pool.execute(
    `SELECT
        id,
        user_id,
        name,
        quantity,
        unit,
        is_purchased,
        is_automatic,
        created_at
     FROM SHOPPING_ITEMS
     WHERE user_id = ?
     ORDER BY is_purchased ASC, created_at DESC`,
    [userId],
  );

  return items;
};

// =====================================================
// DODAVANJE STAVKE U SHOPPING LISTU
// =====================================================

const createShoppingItem = async ({
  userId,
  name,
  quantity,
  unit,
  isAutomatic = false,
}) => {
  const [result] = await pool.execute(
    `INSERT INTO SHOPPING_ITEMS (
        user_id,
        name,
        quantity,
        unit,
        is_automatic
     )
     VALUES (?, ?, ?, ?, ?)`,
    [userId, name, quantity, unit, isAutomatic ? 1 : 0],
  );

  return result.insertId;
};

// =====================================================
// PROMENA STATUSA KUPOVINE
// =====================================================

const updateShoppingItemPurchased = async ({ userId, itemId, isPurchased }) => {
  const [result] = await pool.execute(
    `UPDATE SHOPPING_ITEMS
     SET is_purchased = ?
     WHERE id = ?
       AND user_id = ?`,
    [isPurchased ? 1 : 0, itemId, userId],
  );

  return result.affectedRows;
};

// =====================================================
// BRISANJE SHOPPING STAVKE
// =====================================================

const deleteShoppingItem = async ({ userId, itemId }) => {
  const [result] = await pool.execute(
    `DELETE FROM SHOPPING_ITEMS
     WHERE id = ?
       AND user_id = ?`,
    [itemId, userId],
  );

  return result.affectedRows;
};

// =====================================================
// DOHVATANJE POSTOJEĆIH AUTOMATSKIH STAVKI
// =====================================================

const getAutomaticShoppingItems = async (userId) => {
  const [items] = await pool.execute(
    `SELECT
        id,
        name,
        quantity,
        unit,
        is_purchased
     FROM SHOPPING_ITEMS
     WHERE user_id = ?
       AND is_automatic = 1`,
    [userId],
  );

  return items;
};

// =====================================================
// DOHVATANJE SASTOJAKA PLANIRANIH OBROKA
// ZA ODREĐENI DAN
//
// U obračun ulaze samo obroci koji još nisu završeni.
// Završeni obroci su već potrošili svoje namirnice
// i ne treba ponovo da utiču na Shopping listu.
// =====================================================

const getPlannedIngredientsByDate = async ({ userId, date }) => {
  const [ingredients] = await pool.execute(
    `SELECT
        m.id AS meal_id,
        m.date,
        m.servings AS meal_servings,

        r.id AS recipe_id,
        r.name AS recipe_name,
        r.servings AS recipe_servings,

        ri.id AS ingredient_id,
        ri.food_id,
        ri.food_name,
        ri.quantity,
        ri.unit

     FROM MEALS m

     INNER JOIN RECIPES r
        ON m.recipe_id = r.id

     INNER JOIN RECIPE_INGREDIENTS ri
        ON r.id = ri.recipe_id

     WHERE m.user_id = ?
       AND m.date = ?
       AND m.is_completed = 0

     ORDER BY m.id ASC, ri.id ASC`,
    [userId, date],
  );

  return ingredients;
};

// =====================================================
// AŽURIRANJE AUTOMATSKE STAVKE
// =====================================================

const updateAutomaticShoppingItem = async ({
  userId,
  itemId,
  quantity,
  unit,
}) => {
  const [result] = await pool.execute(
    `UPDATE SHOPPING_ITEMS
     SET quantity = ?, unit = ?
     WHERE id = ?
       AND user_id = ?
       AND is_automatic = 1`,
    [quantity, unit, itemId, userId],
  );

  return result.affectedRows;
};

// =====================================================
// BRISANJE AUTOMATSKIH STAVKI
// =====================================================

const deleteAutomaticShoppingItems = async (userId, itemIds) => {
  if (itemIds.length === 0) {
    return;
  }

  const placeholders = itemIds.map(() => "?").join(", ");

  await pool.execute(
    `DELETE FROM SHOPPING_ITEMS
     WHERE user_id = ?
       AND is_automatic = 1
       AND id IN (${placeholders})`,
    [userId, ...itemIds],
  );
};

// =====================================================
// DOHVATANJE POSTOJEĆIH NAMIRNICA KORISNIKA
// ZA OBRAČUN SHOPPING LISTE
// =====================================================

const getUserFoodsForShopping = async (userId) => {
  const [foods] = await pool.execute(
    `SELECT
        name,
        quantity,
        unit
     FROM FOODS
     WHERE user_id = ?`,
    [userId],
  );

  return foods;
};

module.exports = {
  getShoppingItemsByUserId,
  createShoppingItem,
  updateShoppingItemPurchased,
  deleteShoppingItem,
  getPlannedIngredientsByDate,
  getAutomaticShoppingItems,
  updateAutomaticShoppingItem,
  deleteAutomaticShoppingItems,
  getUserFoodsForShopping,
};
