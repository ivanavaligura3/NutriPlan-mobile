const {
    getAllFoodNutrition,
    getFoodNutritionByName,
    createFoodNutrition,
} = require('../models/foodNutritionModel');

// Dohvata sve namirnice iz nutritivne baze
const getFoodsNutrition = async (req, res) => {
    try {
        const foods = await getAllFoodNutrition();

        return res.status(200).json(foods);
    } catch (error) {
        console.error(
            'Greška pri dohvatanju nutritivnih podataka:',
            error
        );

        return res.status(500).json({
            message:
                'Došlo je do greške pri dohvatanju nutritivnih podataka.',
        });
    }
};

// Dohvata nutritivne podatke jedne namirnice
const getFoodNutrition = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name) {
            return res.status(400).json({
                message:
                    'Naziv namirnice je obavezan.',
            });
        }

        const food =
            await getFoodNutritionByName(name);

        if (!food) {
            return res.status(404).json({
                message:
                    'Namirnica nije pronađena u nutritivnoj bazi.',
            });
        }

        return res.status(200).json(food);
    } catch (error) {
        console.error(
            'Greška pri dohvatanju namirnice:',
            error
        );

        return res.status(500).json({
            message:
                'Došlo je do greške pri dohvatanju namirnice.',
        });
    }
};

// Dodaje novu namirnicu u nutritivnu bazu
const addFoodNutrition = async (req, res) => {
    try {
        const {
            name,
            calories,
            protein,
            carbohydrates,
            fat,
        } = req.body;

        if (
            !name ||
            calories === undefined ||
            protein === undefined ||
            carbohydrates === undefined ||
            fat === undefined
        ) {
            return res.status(400).json({
                message:
                    'Svi nutritivni podaci su obavezni.',
            });
        }

        const foodId =
            await createFoodNutrition({
                name,
                calories,
                protein,
                carbohydrates,
                fat,
            });

        return res.status(201).json({
            message:
                'Namirnica je uspešno dodata u nutritivnu bazu.',
            foodId,
        });
    } catch (error) {
        console.error(
            'Greška pri dodavanju nutritivnih podataka:',
            error
        );

        return res.status(500).json({
            message:
                'Došlo je do greške pri dodavanju nutritivnih podataka.',
        });
    }
};

module.exports = {
    getFoodsNutrition,
    getFoodNutrition,
    addFoodNutrition,
};