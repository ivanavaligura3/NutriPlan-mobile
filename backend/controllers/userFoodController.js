const foodModel = require('../models/foodModel');

const {
    getFoodsByUserId,
    createFood,
    updateFood,
    deleteFood,
} = foodModel;

// Dohvata sve namirnice trenutno prijavljenog korisnika
const getUserFoods = async (req, res) => {
    try {
        const userId = req.user.userId;

        const foods =
            await getFoodsByUserId(userId);

        return res.status(200).json(foods);
    } catch (error) {
        console.error(
            'Greška pri dohvatanju namirnica korisnika:',
            error
        );

        return res.status(500).json({
            message:
                'Došlo je do greške pri dohvatanju namirnica.',
        });
    }
};

// Dodavanje nove namirnice trenutno prijavljenom korisniku
const addUserFood = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            name,
            quantity,
            unit,
            calories,
            protein,
            carbohydrates,
            fat,
        } = req.body;

        // Provera obaveznih podataka
        if (
            !name ||
            quantity === undefined ||
            !unit
        ) {
            return res.status(400).json({
                message:
                    'Naziv, količina i jedinica su obavezni.',
            });
        }

        const foodId = await createFood(
            userId,
            name,
            quantity,
            unit,
            calories ?? null,
            protein ?? null,
            carbohydrates ?? null,
            fat ?? null
        );

        return res.status(201).json({
            success: true,
            message:
                'Namirnica je uspešno dodata.',
            foodId,
        });
    } catch (error) {
        console.error(
            'Greška pri dodavanju namirnice:',
            error
        );

        return res.status(500).json({
            message:
                'Došlo je do greške pri dodavanju namirnice.',
        });
    }
};

// Izmena postojeće namirnice trenutno prijavljenog korisnika
const editUserFood = async (req, res) => {
    try {
        const userId = req.user.userId;
        const foodId = Number(req.params.id);

        const {
            name,
            quantity,
            unit,
            calories,
            protein,
            carbohydrates,
            fat,
        } = req.body;

        // Provera obaveznih podataka
        if (
            !name ||
            quantity === undefined ||
            !unit
        ) {
            return res.status(400).json({
                message:
                    'Naziv, količina i jedinica su obavezni.',
            });
        }

        const affectedRows = await updateFood(
            foodId,
            userId,
            name,
            quantity,
            unit,
            calories ?? null,
            protein ?? null,
            carbohydrates ?? null,
            fat ?? null
        );

        // Ako namirnica ne postoji ili ne pripada korisniku
        if (affectedRows === 0) {
            return res.status(404).json({
                message:
                    'Namirnica nije pronađena.',
            });
        }

        return res.status(200).json({
            success: true,
            message:
                'Namirnica je uspešno izmenjena.',
        });
    } catch (error) {
        console.error(
            'Greška pri izmeni namirnice:',
            error
        );

        return res.status(500).json({
            message:
                'Došlo je do greške pri izmeni namirnice.',
        });
    }
};

// Brisanje postojeće namirnice trenutno prijavljenog korisnika
const removeUserFood = async (req, res) => {
    try {
        const userId = req.user.userId;
        const foodId = Number(req.params.id);

        const affectedRows = await deleteFood(
            foodId,
            userId
        );

        // Ako namirnica ne postoji ili ne pripada korisniku
        if (affectedRows === 0) {
            return res.status(404).json({
                message:
                    'Namirnica nije pronađena.',
            });
        }

        return res.status(200).json({
            success: true,
            message:
                'Namirnica je uspešno obrisana.',
        });
    } catch (error) {
        console.error(
            'Greška pri brisanju namirnice:',
            error
        );

        return res.status(500).json({
            message:
                'Došlo je do greške pri brisanju namirnice.',
        });
    }
};

module.exports = {
    getUserFoods,
    addUserFood,
    editUserFood,
    removeUserFood,
};