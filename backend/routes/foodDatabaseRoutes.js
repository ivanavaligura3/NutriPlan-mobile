const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const foodDatabaseController = require('../controllers/foodDatabaseController');

const searchFoods = foodDatabaseController.searchFoods;

// Pretraga interne baze namirnica
router.get('/search', authMiddleware, searchFoods);

module.exports = router;