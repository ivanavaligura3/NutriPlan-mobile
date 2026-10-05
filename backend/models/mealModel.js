const pool = require("../config/database");

// =====================================================
// DODAVANJE OBROKA U PLAN
// =====================================================

const createMeal = async ({
  userId,
  recipeId,
  date,
  mealType,
  time,
  servings,
}) => {
  const [result] = await pool.execute(
    `INSERT INTO MEALS
      (user_id, recipe_id, date, meal_type, time, servings)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, recipeId, date, mealType, time, servings],
  );

  return result.insertId;
};

// =====================================================
// DOHVATANJE PLANA KORISNIKA
// =====================================================

const getMealsByUserId = async (userId) => {
  const [meals] = await pool.execute(
    `SELECT
        m.id,
        m.user_id,
        m.recipe_id,
        DATE_FORMAT(m.date, '%Y-%m-%d') AS date,
        m.meal_type,
        m.time,
        m.servings,
        m.is_completed,
        m.created_at,
        r.name AS recipe_name,
        r.calories,
        r.protein,
        r.carbohydrates,
        r.fat,
        r.preparation_time,
        r.servings AS recipe_servings
     FROM MEALS m
     INNER JOIN RECIPES r
        ON m.recipe_id = r.id
     WHERE m.user_id = ?
     ORDER BY m.date ASC, m.id ASC`,
    [userId],
  );

  return meals;
};

// =====================================================
// BRISANJE OBROKA IZ PLANA
// =====================================================

const deleteMeal = async ({ userId, mealId }) => {
  const [result] = await pool.execute(
    `DELETE FROM MEALS
     WHERE id = ?
       AND user_id = ?`,
    [mealId, userId],
  );

  return result.affectedRows;
};

// =====================================================
// IZMENU POSTOJEĆEG OBROKA
// =====================================================

const updateMeal = async ({
  userId,
  mealId,
  recipeId,
  date,
  mealType,
  time,
  servings,
}) => {
  const [result] = await pool.execute(
    `UPDATE MEALS
     SET
        recipe_id = ?,
        date = ?,
        meal_type = ?,
        time = ?,
        servings = ?
     WHERE id = ?
       AND user_id = ?`,
    [recipeId, date, mealType, time, servings, mealId, userId],
  );

  return result.affectedRows;
};

// =====================================================
// OZNAČAVANJE OBROKA KAO ZAVRŠENOG
// I POTROŠNJA NAMIRNICA
// =====================================================

const completeMeal = async ({ userId, mealId }) => {
  console.log("=== COMPLETE MEAL START ===");
  console.log("mealId:", mealId);
  console.log("userId:", userId);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // -------------------------------------------------
    // PROVERA OBROKA
    // -------------------------------------------------

    const [meals] = await connection.execute(
      `SELECT
          id,
          is_completed
       FROM MEALS
       WHERE id = ?
         AND user_id = ?
       FOR UPDATE`,
      [mealId, userId],
    );

    if (meals.length === 0) {
      await connection.rollback();

      return {
        success: false,
        reason: "not_found",
      };
    }

    if (meals[0].is_completed === 1) {
      await connection.rollback();

      return {
        success: false,
        reason: "already_completed",
      };
    }

    // -------------------------------------------------
    // DOHVATANJE SASTOJAKA OBROKA
    // -------------------------------------------------

    const [ingredients] = await connection.execute(
      `SELECT
          m.servings AS meal_servings,
          r.servings AS recipe_servings,
          ri.food_name,
          ri.quantity,
          ri.unit
       FROM MEALS m
       INNER JOIN RECIPES r
          ON m.recipe_id = r.id
       INNER JOIN RECIPE_INGREDIENTS ri
          ON r.id = ri.recipe_id
       WHERE m.id = ?
         AND m.user_id = ?`,
      [mealId, userId],
    );

    // -------------------------------------------------
    // POTROŠNJA NAMIRNICA
    // -------------------------------------------------

    for (const ingredient of ingredients) {
      const recipeServings = Number(ingredient.recipe_servings);

      const mealServings = Number(ingredient.meal_servings);

      const ingredientQuantity = Number(ingredient.quantity);

      if (recipeServings <= 0 || mealServings <= 0) {
        continue;
      }

      const requiredQuantity =
        (ingredientQuantity / recipeServings) * mealServings;

      let remainingQuantity = requiredQuantity;

      const normalizedUnit = String(ingredient.unit).trim().toLowerCase();

      // -------------------------------------------------
      // PRETVARANJE POTREBNE KOLIČINE U OSNOVNU JEDINICU
      // -------------------------------------------------

      if (normalizedUnit === "kg") {
        remainingQuantity *= 1000;
      }

      if (normalizedUnit === "l") {
        remainingQuantity *= 1000;
      }

      // -------------------------------------------------
      // DOHVATANJE ZALIHA
      // -------------------------------------------------

      const [foods] = await connection.execute(
        `SELECT
            id,
            quantity,
            unit
         FROM FOODS
         WHERE user_id = ?
           AND LOWER(name) = LOWER(?)
         ORDER BY id ASC
         FOR UPDATE`,
        [userId, ingredient.food_name],
      );

      // -------------------------------------------------
      // SKIDANJE KOLIČINE SA ZALIHA
      // -------------------------------------------------

      for (const food of foods) {
        if (remainingQuantity <= 0) {
          break;
        }

        const foodUnit = String(food.unit).trim().toLowerCase();

        let availableQuantity = Number(food.quantity);

        if (foodUnit === "kg") {
          availableQuantity *= 1000;
        }

        if (foodUnit === "l") {
          availableQuantity *= 1000;
        }

        const consumedQuantity = Math.min(availableQuantity, remainingQuantity);

        let newQuantity = availableQuantity - consumedQuantity;

        // -------------------------------------------------
        // VRAĆANJE U ORIGINALNU JEDINICU
        // -------------------------------------------------

        if (foodUnit === "kg") {
          newQuantity /= 1000;
        }

        if (foodUnit === "l") {
          newQuantity /= 1000;
        }

        await connection.execute(
          `UPDATE FOODS
           SET quantity = ?
           WHERE id = ?
             AND user_id = ?`,
          [newQuantity, food.id, userId],
        );

        remainingQuantity -= consumedQuantity;
      }
    }

    // -------------------------------------------------
    // OZNAČAVANJE OBROKA KAO ZAVRŠENOG
    // -------------------------------------------------

    await connection.execute(
      `UPDATE MEALS
       SET is_completed = 1
       WHERE id = ?
         AND user_id = ?
         AND is_completed = 0`,
      [mealId, userId],
    );

    await connection.commit();

    return {
      success: true,
      reason: "completed",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// =====================================================
// DOHVATANJE SASTOJAKA OBROKA
// =====================================================

const getMealIngredientsForConsumption = async ({ userId, mealId }) => {
  const [ingredients] = await pool.execute(
    `SELECT
        m.id AS meal_id,
        m.servings AS meal_servings,

        r.id AS recipe_id,
        r.servings AS recipe_servings,

        ri.food_id,
        ri.food_name,
        ri.quantity,
        ri.unit

     FROM MEALS m
     INNER JOIN RECIPES r
        ON m.recipe_id = r.id
     INNER JOIN RECIPE_INGREDIENTS ri
        ON r.id = ri.recipe_id

     WHERE m.id = ?
       AND m.user_id = ?`,
    [mealId, userId],
  );

  return ingredients;
};

// =====================================================
// IZVOZ FUNKCIJA
// =====================================================

module.exports = {
  createMeal,
  getMealsByUserId,
  deleteMeal,
  updateMeal,
  completeMeal,
  getMealIngredientsForConsumption,
};
