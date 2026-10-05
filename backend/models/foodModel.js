const pool = require("../config/database");

// Dohvatanje svih namirnica jednog korisnika
const getFoodsByUserId = async (userId) => {
  const [foods] = await pool.execute(
    `SELECT
            id,
            name,
            quantity,
            unit,
            calories,
            protein,
            carbohydrates,
            fat,
            created_at
        FROM FOODS
        WHERE user_id = ?
        ORDER BY created_at DESC`,
    [userId],
  );

  return foods;
};

// Dodavanje nove namirnice korisniku
const createFood = async (
  userId,
  name,
  quantity,
  unit,
  calories,
  protein,
  carbohydrates,
  fat,
) => {
  const [result] = await pool.execute(
    `INSERT INTO FOODS
        (
            user_id,
            name,
            quantity,
            unit,
            calories,
            protein,
            carbohydrates,
            fat
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, name, quantity, unit, calories, protein, carbohydrates, fat],
  );

  return result.insertId;
};

// Izmena postojeće namirnice korisnika
const updateFood = async (
  foodId,
  userId,
  name,
  quantity,
  unit,
  calories,
  protein,
  carbohydrates,
  fat,
) => {
  const [result] = await pool.execute(
    `UPDATE FOODS
        SET
            name = ?,
            quantity = ?,
            unit = ?,
            calories = ?,
            protein = ?,
            carbohydrates = ?,
            fat = ?
        WHERE
            id = ?
            AND user_id = ?`,
    [
      name,
      quantity,
      unit,
      calories,
      protein,
      carbohydrates,
      fat,
      foodId,
      userId,
    ],
  );

  return result.affectedRows;
};

// Brisanje postojeće namirnice korisnika
const deleteFood = async (foodId, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM FOODS
        WHERE
            id = ?
            AND user_id = ?`,
    [foodId, userId],
  );

  return result.affectedRows;
};

// =====================================================
// TROŠENJE NAMIRNICE IZ ZALIHA
// =====================================================

const consumeFoodQuantity = async ({ userId, name, quantity, unit }) => {
  const normalizedUnit = String(unit).trim().toLowerCase();

  const [foods] = await pool.execute(
    `SELECT
        id,
        name,
        quantity,
        unit
     FROM FOODS
     WHERE user_id = ?
       AND LOWER(name) = LOWER(?)
     ORDER BY id ASC`,
    [userId, name],
  );

  if (foods.length === 0) {
    return;
  }

  // Potrebnu količinu pretvaramo u osnovnu jedinicu:
  // g za čvrste namirnice, ml za tečne.
  let remainingQuantity = Number(quantity);

  if (normalizedUnit === "kg") {
    remainingQuantity *= 1000;
  }

  if (normalizedUnit === "l") {
    remainingQuantity *= 1000;
  }

  for (const food of foods) {
    if (remainingQuantity <= 0) {
      break;
    }

    const foodUnit = String(food.unit).trim().toLowerCase();

    let availableQuantity = Number(food.quantity);

    // Dostupnu količinu pretvaramo u osnovnu jedinicu.
    if (foodUnit === "kg") {
      availableQuantity *= 1000;
    }

    if (foodUnit === "l") {
      availableQuantity *= 1000;
    }

    const consumedQuantity = Math.min(availableQuantity, remainingQuantity);

    let newQuantity = availableQuantity - consumedQuantity;

    // Količinu vraćamo u jedinicu koja je sačuvana u FOODS.
    if (foodUnit === "kg") {
      newQuantity /= 1000;
    }

    if (foodUnit === "l") {
      newQuantity /= 1000;
    }

    await pool.execute(
      `UPDATE FOODS
       SET quantity = ?
       WHERE id = ?
         AND user_id = ?`,
      [newQuantity, food.id, userId],
    );

    remainingQuantity -= consumedQuantity;
  }
};

module.exports = {
  getFoodsByUserId,
  createFood,
  updateFood,
  deleteFood,
  consumeFoodQuantity,
};
