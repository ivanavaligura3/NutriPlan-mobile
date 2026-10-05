const {
    searchFoodDatabase,
} = require('../models/foodDatabaseModel');

// Pretraga interne baze namirnica
const searchFoods = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search || !search.trim()) {
            return res.status(400).json({
                message: 'Unesite naziv namirnice za pretragu.',
            });
        }

        const foods = await searchFoodDatabase(search.trim());

        return res.status(200).json({
            foods,
        });
    } catch (error) {
        console.error(
            'Greška prilikom pretrage interne baze namirnica:',
            error
        );

        return res.status(500).json({
            message: 'Greška na serveru.',
        });
    }
};

module.exports = {
    searchFoods,
};