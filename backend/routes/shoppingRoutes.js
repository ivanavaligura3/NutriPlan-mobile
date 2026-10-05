const express = require("express");

const {
  getShoppingItems,
  addShoppingItem,
  updateShoppingItemPurchased,
  deleteShoppingItem,
  getPlannedIngredients,
  syncAutomaticShoppingItems,
} = require("../controllers/shoppingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// SHOPPING LISTA
// =====================================================

// Dohvatanje svih shopping stavki korisnika
router.get("/", authMiddleware, getShoppingItems);

// Ručno dodavanje shopping stavke
router.post("/", authMiddleware, addShoppingItem);

// Promena statusa kupovine
router.patch("/:id", authMiddleware, updateShoppingItemPurchased);

// Brisanje shopping stavke
router.delete("/:id", authMiddleware, deleteShoppingItem);

// Dohvatanje sastojaka planiranih obroka za određeni dan
router.get("/planned-ingredients", authMiddleware, getPlannedIngredients);

// Automatska sinhronizacija shopping stavki
router.post("/sync-automatic", authMiddleware, syncAutomaticShoppingItems);

module.exports = router;
