const {
  createMeal,
  getMealsByUserId,
  deleteMeal,
  updateMeal,
  completeMeal,
} = require("../models/mealModel");

// =====================================================
// DODAVANJE OBROKA U PLAN
// =====================================================

const addMealToPlan = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { recipeId, date, mealType, time, servings } = req.body;

    if (!recipeId || !date || !mealType || !time || !servings) {
      return res.status(400).json({
        message: "Sva polja su obavezna.",
      });
    }

    const mealId = await createMeal({
      userId,
      recipeId,
      date,
      mealType,
      time,
      servings,
    });

    return res.status(201).json({
      message: "Obrok je uspešno dodat u plan.",
      mealId,
    });
  } catch (error) {
    console.error("GREŠKA PRI DODAVANJU OBROKA:", error);

    return res.status(500).json({
      message: error.message || "Došlo je do greške pri dodavanju obroka.",
    });
  }
};

// =====================================================
// DOHVATANJE PLANA KORISNIKA
// =====================================================

const getUserMeals = async (req, res) => {
  try {
    const userId = req.user.userId;

    const meals = await getMealsByUserId(userId);

    return res.status(200).json(meals);
  } catch (error) {
    console.error("Greška pri dohvatanju plana:", error);

    return res.status(500).json({
      message: "Došlo je do greške pri dohvatanju plana.",
    });
  }
};

// =====================================================
// BRISANJE OBROKA IZ PLANA
// =====================================================

const removeMealFromPlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const mealId = Number(req.params.id);

    if (isNaN(mealId)) {
      return res.status(400).json({
        message: "Neispravan ID obroka.",
      });
    }

    const deletedRows = await deleteMeal({
      userId,
      mealId,
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        message: "Obrok nije pronađen u planu.",
      });
    }

    return res.status(200).json({
      message: "Obrok je uspešno uklonjen iz plana.",
    });
  } catch (error) {
    console.error("Greška pri brisanju obroka:", error);

    return res.status(500).json({
      message: "Došlo je do greške pri brisanju obroka.",
    });
  }
};

// =====================================================
// IZMENU POSTOJEĆEG OBROKA
// =====================================================

const editMealInPlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const mealId = Number(req.params.id);

    const { recipeId, date, mealType, time, servings } = req.body;

    // -------------------------------------------------
    // PROVERA ID-JA OBROKA
    // -------------------------------------------------

    if (isNaN(mealId)) {
      return res.status(400).json({
        message: "Neispravan ID obroka.",
      });
    }

    // -------------------------------------------------
    // PROVERA OBAVEZNIH PODATAKA
    // -------------------------------------------------

    if (!recipeId || !date || !mealType || !time || !servings) {
      return res.status(400).json({
        message: "Sva polja su obavezna.",
      });
    }

    const updatedRows = await updateMeal({
      userId,
      mealId,
      recipeId,
      date,
      mealType,
      time,
      servings,
    });

    // -------------------------------------------------
    // PROVERA DA LI OBROK POSTOJI
    // -------------------------------------------------

    if (updatedRows === 0) {
      return res.status(404).json({
        message: "Obrok nije pronađen u planu.",
      });
    }

    return res.status(200).json({
      message: "Obrok je uspešno izmenjen.",
    });
  } catch (error) {
    console.error("Greška pri izmeni obroka:", error);

    return res.status(500).json({
      message: "Došlo je do greške pri izmeni obroka.",
    });
  }
};

// =====================================================
// OZNAČAVANJE OBROKA KAO ZAVRŠENOG
// =====================================================

const completeMealInPlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const mealId = Number(req.params.id);

    // -------------------------------------------------
    // PROVERA ID-JA OBROKA
    // -------------------------------------------------

    if (isNaN(mealId)) {
      return res.status(400).json({
        message: "Neispravan ID obroka.",
      });
    }

    // -------------------------------------------------
    // ZAVRŠAVANJE OBROKA
    // Potrošnja namirnica se izvršava unutar
    // completeMeal funkcije u mealModel.js
    // -------------------------------------------------

    const result = await completeMeal({
      userId,
      mealId,
    });

    // -------------------------------------------------
    // PROVERA REZULTATA
    // -------------------------------------------------

    if (!result.success) {
      if (result.reason === "not_found") {
        return res.status(404).json({
          message: "Obrok nije pronađen.",
        });
      }

      if (result.reason === "already_completed") {
        return res.status(400).json({
          message: "Obrok je već označen kao završen.",
        });
      }
    }

    return res.status(200).json({
      message: "Obrok je uspešno završen.",
    });
  } catch (error) {
    console.error("Greška pri završavanju obroka:", error);

    return res.status(500).json({
      message: "Došlo je do greške pri završavanju obroka.",
    });
  }
};

// =====================================================
// IZVOZ FUNKCIJA
// =====================================================

module.exports = {
  addMealToPlan,
  getUserMeals,
  removeMealFromPlan,
  editMealInPlan,
  completeMealInPlan,
};
