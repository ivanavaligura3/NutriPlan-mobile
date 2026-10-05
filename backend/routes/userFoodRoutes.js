const express = require('express');

const {
    getUserFoods,
    addUserFood,
    editUserFood,
    removeUserFood,
} = require('../controllers/userFoodController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Dohvatanje namirnica trenutno prijavljenog korisnika
router.get(
    '/',
    authMiddleware,
    getUserFoods
);

// Dodavanje nove namirnice
router.post(
    '/',
    authMiddleware,
    addUserFood
);

// Izmena postojeće namirnice
router.put(
    '/:id',
    authMiddleware,
    editUserFood
);

// Brisanje postojeće namirnice
router.delete(
    '/:id',
    authMiddleware,
    removeUserFood
);

module.exports = router;