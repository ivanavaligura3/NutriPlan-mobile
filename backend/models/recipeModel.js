const pool = require("../config/database");

// Dohvatanje svih recepata trenutno prijavljenog korisnika
const getRecipesByUserId = async (userId) => {
  const [recipes] = await pool.execute(
    `SELECT
            id,
            user_id,
            name,
            description,
            calories,
            protein,
            carbohydrates,
            fat,
            preparation_time,
            servings,
            created_at
        FROM RECIPES
        WHERE user_id = ?
        ORDER BY created_at DESC`,
    [userId],
  );

  return recipes;
};

// Kreiranje novog recepta za trenutno prijavljenog korisnika
const createRecipe = async ({
  userId,
  name,
  description,
  calories,
  preparationTime,
  servings,
}) => {
  const [result] = await pool.execute(
    `INSERT INTO RECIPES (
            user_id,
            name,
            description,
            calories,
            protein,
            carbohydrates,
            fat,
            preparation_time,
            servings
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, name, description, calories, 0, 0, 0, preparationTime, servings],
  );

  return result.insertId;
};

// Izmena recepta trenutno prijavljenog korisnika
const updateRecipe = async ({
  recipeId,
  userId,
  name,
  description,
  calories,
  preparationTime,
  servings,
}) => {
  const [result] = await pool.execute(
    `UPDATE RECIPES
        SET
            name = ?,
            description = ?,
            calories = ?,
            preparation_time = ?,
            servings = ?
        WHERE id = ?
        AND user_id = ?`,
    [name, description, calories, preparationTime, servings, recipeId, userId],
  );

  return result.affectedRows;
};

// Brisanje recepta trenutno prijavljenog korisnika
const deleteRecipe = async ({ recipeId, userId }) => {
  const [result] = await pool.execute(
    `DELETE FROM RECIPES
        WHERE id = ?
        AND user_id = ?`,
    [recipeId, userId],
  );

  return result.affectedRows;
};

// Dodavanje recepta u favorite
const addFavorite = async ({ userId, recipeId }) => {
  const [result] = await pool.execute(
    `INSERT INTO favorites (
            user_id,
            recipe_id
        )
        VALUES (?, ?)`,
    [userId, recipeId],
  );

  return result.insertId;
};

// Uklanjanje recepta iz favorita
const removeFavorite = async ({ userId, recipeId }) => {
  const [result] = await pool.execute(
    `DELETE FROM favorites
        WHERE user_id = ?
        AND recipe_id = ?`,
    [userId, recipeId],
  );

  return result.affectedRows;
};

// Provera da li je recept u favoritima
const isFavorite = async ({ userId, recipeId }) => {
  const [favorites] = await pool.execute(
    `SELECT
            id
        FROM favorites
        WHERE user_id = ?
        AND recipe_id = ?
        LIMIT 1`,
    [userId, recipeId],
  );

  return favorites.length > 0;
};

// Dohvatanje svih favorita trenutno prijavljenog korisnika
const getFavoritesByUserId = async (userId) => {
  const [favorites] = await pool.execute(
    `SELECT
            r.id,
            r.user_id,
            r.name,
            r.description,
            r.calories,
            r.protein,
            r.carbohydrates,
            r.fat,
            r.preparation_time,
            r.servings,
            r.created_at
        FROM favorites f
        INNER JOIN RECIPES r
            ON f.recipe_id = r.id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC`,
    [userId],
  );

  return favorites;
};

// Dodavanje sastojka receptu
// Istovremeno pronalazimo njegov nutritivni podatak
// i čuvamo food_id kao vezu sa FOOD_NUTRITION tabelom.
const addRecipeIngredient = async ({
  recipeId,
  name,
  quantity,
  unit,
  offCalories,
  offProtein,
  offCarbohydrates,
  offFat,
}) => {
  // Pronalazimo namirnicu po nazivu
  const [foods] = await pool.execute(
    `SELECT id
         FROM FOOD_NUTRITION
         WHERE name = ?
         LIMIT 1`,
    [name],
  );

  // Ako namirnica postoji, koristimo njen ID.
  // Ako ne postoji, food_id ostaje NULL.
  const foodId = foods.length > 0 ? foods[0].id : null;

  const [result] = await pool.execute(
    `INSERT INTO recipe_ingredients (
            recipe_id,
            food_id,
            food_name,
            quantity,
            unit,
            off_calories,
            off_protein,
            off_carbohydrates,
            off_fat
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      recipeId,
      foodId,
      name,
      quantity,
      unit,
      offCalories ?? null,
      offProtein ?? null,
      offCarbohydrates ?? null,
      offFat ?? null,
    ],
  );

  return result.insertId;
};

// Dohvatanje svih sastojaka jednog recepta
const getRecipeIngredients = async (recipeId) => {
  const [ingredients] = await pool.execute(
    `SELECT
            ri.id,
            ri.food_name,
            ri.quantity,
            ri.unit,

            COALESCE(
                fn.calories,
                ri.off_calories
            ) AS off_calories,

            COALESCE(
                fn.protein,
                ri.off_protein
            ) AS off_protein,

            COALESCE(
                fn.carbohydrates,
                ri.off_carbohydrates
            ) AS off_carbohydrates,

            COALESCE(
                fn.fat,
                ri.off_fat
            ) AS off_fat

        FROM RECIPE_INGREDIENTS ri

        LEFT JOIN FOOD_NUTRITION fn
            ON ri.food_id = fn.id

        WHERE ri.recipe_id = ?

        ORDER BY ri.id ASC`,
    [recipeId],
  );

  return ingredients;
};

// Izmena sastojka recepta
const updateRecipeIngredient = async ({
  ingredientId,
  recipeId,
  name,
  quantity,
  unit,
  offCalories,
  offProtein,
  offCarbohydrates,
  offFat,
}) => {
  // Pronalazimo novu namirnicu u nutritivnoj bazi.
  const [foods] = await pool.execute(
    `SELECT id
         FROM FOOD_NUTRITION
         WHERE name = ?
         LIMIT 1`,
    [name],
  );

  // Ako namirnica postoji, čuvamo njen ID.
  // Ako ne postoji, food_id ostaje NULL.
  const foodId = foods.length > 0 ? foods[0].id : null;

  const [result] = await pool.execute(
    `UPDATE recipe_ingredients
        SET
            food_id = ?,
            food_name = ?,
            quantity = ?,
            unit = ?,
            off_calories = ?,
            off_protein = ?,
            off_carbohydrates = ?,
            off_fat = ?
        WHERE id = ?
        AND recipe_id = ?`,
    [
      foodId,
      name,
      quantity,
      unit,
      offCalories ?? null,
      offProtein ?? null,
      offCarbohydrates ?? null,
      offFat ?? null,
      ingredientId,
      recipeId,
    ],
  );

  return result.affectedRows;
};

// Brisanje sastojka recepta
const deleteRecipeIngredient = async ({ ingredientId, recipeId }) => {
  const [result] = await pool.execute(
    `DELETE FROM recipe_ingredients
        WHERE id = ?
        AND recipe_id = ?`,
    [ingredientId, recipeId],
  );

  return result.affectedRows;
};

const addRecipeStep = async ({ recipeId, stepNumber, description }) => {
  const [result] = await pool.execute(
    `INSERT INTO recipe_steps (
            recipe_id,
            step_number,
            description
        )
        VALUES (?, ?, ?)`,
    [recipeId, stepNumber, description],
  );

  return result.insertId;
};

const getRecipeSteps = async (recipeId) => {
  const [steps] = await pool.execute(
    `SELECT
            id,
            step_number,
            description
        FROM recipe_steps
        WHERE recipe_id = ?
        ORDER BY step_number ASC`,
    [recipeId],
  );

  return steps;
};

const updateRecipeStep = async ({
  stepId,
  recipeId,
  stepNumber,
  description,
}) => {
  const [result] = await pool.execute(
    `UPDATE recipe_steps
        SET
            step_number = ?,
            description = ?
        WHERE id = ?
        AND recipe_id = ?`,
    [stepNumber, description, stepId, recipeId],
  );

  return result.affectedRows;
};

const deleteRecipeStep = async ({ stepId, recipeId }) => {
  const [result] = await pool.execute(
    `DELETE FROM recipe_steps
        WHERE id = ?
        AND recipe_id = ?`,
    [stepId, recipeId],
  );

  return result.affectedRows;
};

// Automatski obračun nutritivnih vrednosti recepta
// na osnovu količine svakog sastojka.
const calculateRecipeNutrition = async (recipeId) => {
  const [ingredients] = await pool.execute(
    `SELECT
            ri.quantity,
            ri.unit,
            COALESCE(fn.calories, ri.off_calories) AS calories,
            COALESCE(fn.protein, ri.off_protein) AS protein,
            COALESCE(fn.carbohydrates, ri.off_carbohydrates) AS carbohydrates,
            COALESCE(fn.fat, ri.off_fat) AS fat
        FROM RECIPE_INGREDIENTS ri
        LEFT JOIN FOOD_NUTRITION fn
            ON ri.food_id = fn.id
        WHERE ri.recipe_id = ?`,
    [recipeId],
  );

  let calories = 0;
  let protein = 0;
  let carbohydrates = 0;
  let fat = 0;

  for (const ingredient of ingredients) {
    // Za sada računamo samo grame.
    // 100 g je osnovna količina nutritivnih podataka.
    if (ingredient.unit === "g") {
      const multiplier = Number(ingredient.quantity) / 100;

      calories += Number(ingredient.calories) * multiplier;

      protein += Number(ingredient.protein) * multiplier;

      carbohydrates += Number(ingredient.carbohydrates) * multiplier;

      fat += Number(ingredient.fat) * multiplier;
    }
  }

  return {
    calories: Number(calories.toFixed(2)),
    protein: Number(protein.toFixed(2)),
    carbohydrates: Number(carbohydrates.toFixed(2)),
    fat: Number(fat.toFixed(2)),
  };
};

// Čuvanje automatski izračunatih nutritivnih vrednosti recepta
const updateRecipeNutrition = async ({
  recipeId,
  calories,
  protein,
  carbohydrates,
  fat,
}) => {
  const [result] = await pool.execute(
    `UPDATE RECIPES
         SET
            calories = ?,
            protein = ?,
            carbohydrates = ?,
            fat = ?
         WHERE id = ?`,
    [calories, protein, carbohydrates, fat, recipeId],
  );

  return result.affectedRows;
};

module.exports = {
  getRecipesByUserId,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addRecipeIngredient,
  getRecipeIngredients,
  updateRecipeIngredient,
  deleteRecipeIngredient,
  addRecipeStep,
  getRecipeSteps,
  updateRecipeStep,
  deleteRecipeStep,
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavoritesByUserId,
  calculateRecipeNutrition,
  updateRecipeNutrition,
};
