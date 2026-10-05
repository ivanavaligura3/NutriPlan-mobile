const pool = require('../config/database');

// Dohvata sve namirnice iz baze nutritivnih podataka
const getAllFoodNutrition = async () => {
    const [foods] = await pool.execute(
        `SELECT
            id,
            name,
            calories,
            protein,
            carbohydrates,
            fat
         FROM FOOD_NUTRITION
         ORDER BY name ASC`
    );

    return foods;
};

// Dohvata jednu namirnicu po nazivu
const getFoodNutritionByName = async (name) => {
    const [foods] = await pool.execute(
        `SELECT
            id,
            name,
            calories,
            protein,
            carbohydrates,
            fat
         FROM FOOD_NUTRITION
         WHERE name = ?
         LIMIT 1`,
        [name]
    );

    return foods[0] || null;
};

// Dodaje novu namirnicu u nutritivnu bazu
const createFoodNutrition = async ({
    name,
    calories,
    protein,
    carbohydrates,
    fat,
}) => {
    const [result] = await pool.execute(
        `INSERT INTO FOOD_NUTRITION
            (
                name,
                calories,
                protein,
                carbohydrates,
                fat
            )
         VALUES (?, ?, ?, ?, ?)`,
        [
            name,
            calories,
            protein,
            carbohydrates,
            fat,
        ]
    );

    return result.insertId;
};

module.exports = {
    getAllFoodNutrition,
    getFoodNutritionByName,
    createFoodNutrition,
};