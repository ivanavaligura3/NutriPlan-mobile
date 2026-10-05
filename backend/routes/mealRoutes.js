const express = require("express");

const {
  addMealToPlan,
  getUserMeals,
  removeMealFromPlan,
  editMealInPlan,
  completeMealInPlan,
} = require("../controllers/mealController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// PLAN ISHRANE
// =====================================================

// Dodavanje obroka u plan
router.post("/", authenticateToken, addMealToPlan);

// Dohvatanje plana korisnika
router.get("/", authenticateToken, getUserMeals);

router.put("/:id", authenticateToken, editMealInPlan);

// Brisanje obroka iz plana
router.delete("/:id", authenticateToken, removeMealFromPlan);

// =====================================================
// OZNAČAVANJE OBROKA KAO ZAVRŠENOG
// =====================================================

router.patch("/:id/complete", authenticateToken, completeMealInPlan);

module.exports = router;
