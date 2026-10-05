const pool = require('../config/database');

// Pretraga namirnica iz interne baze
const searchFoodDatabase = async (searchTerm) => {
    const [foods] = await pool.execute(
        `SELECT
            id,
            name,
            category,
            calories,
            protein,
            carbohydrates,
            fat
        FROM FOOD_DATABASE
        WHERE name LIKE ?
        ORDER BY name ASC`,
        [`%${searchTerm}%`]
    );

    return foods;
};

module.exports = {
    searchFoodDatabase,
};