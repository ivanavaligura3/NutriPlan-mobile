const express = require('express');
const {
    getUserRecipes,
    createUserRecipe,
    updateUserRecipe,
    deleteUserRecipe,
    getRecipeNutrition,
    calculateAndSaveRecipeNutrition,
    addIngredientToRecipe,
    getIngredientsForRecipe,
    updateIngredient,
    deleteIngredient,
    addStepToRecipe,
    getStepsForRecipe,
    updateStep,
    deleteStep,
    addRecipeToFavorites,
    removeRecipeFromFavorites,
    checkRecipeFavorite,
    getUserFavorites,
} = require('../controllers/recipeController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Dohvatanje recepata trenutno prijavljenog korisnika
router.get('/', authenticateToken, getUserRecipes);

// Kreiranje novog recepta
router.post('/', authenticateToken, createUserRecipe);

// Izmena recepta trenutno prijavljenog korisnika
router.put('/:id', authenticateToken, updateUserRecipe);

// Brisanje recepta trenutno prijavljenog korisnika
router.delete('/:id', authenticateToken, deleteUserRecipe);

// Automatski obračun nutritivnih vrednosti recepta

router.get(
    '/:id/nutrition',
    authenticateToken,
    getRecipeNutrition
);

router.put(
    '/:id/nutrition',
    authenticateToken,
    calculateAndSaveRecipeNutrition
);

// Dodavanje sastojka receptu
router.post('/:id/ingredients', authenticateToken, addIngredientToRecipe);

// Dohvatanje sastojaka recepta
router.get('/:id/ingredients', authenticateToken, getIngredientsForRecipe);

router.put(
    '/:id/ingredients/:ingredientId',
    authenticateToken,
    updateIngredient
);

router.delete(
    '/:id/ingredients/:ingredientId',
    authenticateToken,
    deleteIngredient
);

// Koraci pripreme
router.post('/:id/steps', authenticateToken, addStepToRecipe);
router.get('/:id/steps', authenticateToken, getStepsForRecipe);
router.put('/:id/steps/:stepId', authenticateToken, updateStep);
router.delete('/:id/steps/:stepId', authenticateToken, deleteStep);

// =====================================================
// FAVORITI
// =====================================================

// Dodavanje recepta u favorite
router.post(
    '/:id/favorite',
    authenticateToken,
    addRecipeToFavorites
);

// Uklanjanje recepta iz favorita
router.delete(
    '/:id/favorite',
    authenticateToken,
    removeRecipeFromFavorites
);

// Provera da li je recept favorit
router.get(
    '/:id/favorite',
    authenticateToken,
    checkRecipeFavorite
);

// Dohvatanje svih favorita korisnika
router.get(
    '/favorites',
    authenticateToken,
    getUserFavorites
);

module.exports = router;