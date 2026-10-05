const express = require('express');

const {
    searchFoods,
} = require('../controllers/openFoodFactsController');

const authenticateToken =
    require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Pretraga namirnica preko Open Food Facts API-ja.
 */
router.get(
    '/search',
    authenticateToken,
    searchFoods
);

module.exports = router;