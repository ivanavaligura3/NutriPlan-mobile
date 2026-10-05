const {
    searchOpenFoodFacts,
} = require('../services/openFoodFactsService');

/**
 * Pretraga namirnica preko Open Food Facts API-ja.
 */
const searchFoods = async (req, res) => {
    try {
        const searchTerm = req.query.search;

        if (
            !searchTerm ||
            !searchTerm.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Unesite naziv namirnice za pretragu.',
            });
        }

        const products =
            await searchOpenFoodFacts(
                searchTerm.trim()
            );

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error(
            'Greška pri pretrazi Open Food Facts:',
            error
        );

        return res.status(500).json({
            success: false,
            message:
                'Nije moguće pretražiti namirnice.',
        });
    }
};

module.exports = {
    searchFoods,
};