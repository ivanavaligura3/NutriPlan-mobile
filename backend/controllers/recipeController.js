const {
  getRecipesByUserId,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addRecipeIngredient,
  getRecipeIngredients,
  updateRecipeIngredient,
  deleteRecipeIngredient,
  addRecipeStep,
  getRecipeSteps,
  updateRecipeStep,
  deleteRecipeStep,
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavoritesByUserId,
  calculateRecipeNutrition,
  updateRecipeNutrition,
} = require("../models/recipeModel");

// Dohvatanje svih recepata trenutno prijavljenog korisnika
const getUserRecipes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const recipes = await getRecipesByUserId(userId);

    res.status(200).json({
      success: true,
      recipes,
    });
  } catch (error) {
    console.error("Greška pri dohvatanju recepata:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri dohvatanju recepata.",
    });
  }
};

// Kreiranje novog recepta
const createUserRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name, description, calories, preparationTime, servings } = req.body;

    if (
      !name ||
      !description ||
      calories === undefined ||
      preparationTime === undefined ||
      servings === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Sva obavezna polja moraju biti popunjena.",
      });
    }

    const recipeId = await createRecipe({
      userId,
      name,
      description,
      calories,
      preparationTime,
      servings,
    });

    res.status(201).json({
      success: true,
      message: "Recept je uspešno kreiran.",
      recipeId,
    });
  } catch (error) {
    console.error("Greška pri kreiranju recepta:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri kreiranju recepta.",
    });
  }
};

// Izmena recepta trenutno prijavljenog korisnika
const updateUserRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = Number(req.params.id);

    const { name, description, calories, preparationTime, servings } = req.body;

    if (
      !name ||
      !description ||
      calories === undefined ||
      preparationTime === undefined ||
      servings === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Sva obavezna polja moraju biti popunjena.",
      });
    }

    const affectedRows = await updateRecipe({
      recipeId,
      userId,
      name,
      description,
      calories,
      preparationTime,
      servings,
    });

    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Recept nije pronađen.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recept je uspešno izmenjen.",
    });
  } catch (error) {
    console.error("Greška pri izmeni recepta:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri izmeni recepta.",
    });
  }
};

// Brisanje recepta trenutno prijavljenog korisnika
const deleteUserRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = Number(req.params.id);

    const affectedRows = await deleteRecipe({
      recipeId,
      userId,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Recept nije pronađen.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recept je uspešno obrisan.",
    });
  } catch (error) {
    console.error("Greška pri brisanju recepta:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri brisanju recepta.",
    });
  }
};

// Dodavanje sastojka receptu
const addIngredientToRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    const {
      name,
      quantity,
      unit,
      offCalories,
      offProtein,
      offCarbohydrates,
      offFat,
    } = req.body;

    if (!name || quantity === undefined || !unit) {
      return res.status(400).json({
        success: false,
        message: "Sva polja sastojka moraju biti popunjena.",
      });
    }

    const ingredientId = await addRecipeIngredient({
      recipeId,
      name,
      quantity,
      unit,
      offCalories,
      offProtein,
      offCarbohydrates,
      offFat,
    });

    res.status(201).json({
      success: true,
      message: "Sastojak je uspešno dodat.",
      ingredientId,
    });
  } catch (error) {
    console.error("Greška pri dodavanju sastojka:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri dodavanju sastojka.",
    });
  }
};

// Automatski obračun nutritivnih vrednosti recepta
const getRecipeNutrition = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        success: false,
        message: "Neispravan ID recepta.",
      });
    }

    const nutrition = await calculateRecipeNutrition(recipeId);

    return res.status(200).json({
      success: true,
      nutrition,
    });
  } catch (error) {
    console.error("Greška pri obračunu nutritivnih vrednosti:", error);

    return res.status(500).json({
      success: false,
      message: "Došlo je do greške pri obračunu nutritivnih vrednosti.",
    });
  }
};

// Obračun i čuvanje nutritivnih vrednosti recepta
const calculateAndSaveRecipeNutrition = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        success: false,
        message: "Neispravan ID recepta.",
      });
    }

    // 1. Obračun nutritivnih vrednosti
    const nutrition = await calculateRecipeNutrition(recipeId);

    // 2. Čuvanje rezultata u RECIPES tabelu
    await updateRecipeNutrition({
      recipeId,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbohydrates: nutrition.carbohydrates,
      fat: nutrition.fat,
    });

    return res.status(200).json({
      success: true,
      nutrition,
    });
  } catch (error) {
    console.error(
      "Greška pri obračunu i čuvanju nutritivnih vrednosti:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Došlo je do greške pri obračunu nutritivnih vrednosti.",
    });
  }
};

// Dohvatanje sastojaka jednog recepta
const getIngredientsForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    const ingredients = await getRecipeIngredients(recipeId);

    res.status(200).json({
      success: true,
      ingredients,
    });
  } catch (error) {
    console.error("Greška pri dohvatanju sastojaka:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri dohvatanju sastojaka.",
    });
  }
};

// Izmena sastojka recepta
const updateIngredient = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const ingredientId = Number(req.params.ingredientId);

    const {
      name,
      quantity,
      unit,
      offCalories,
      offProtein,
      offCarbohydrates,
      offFat,
    } = req.body;

    if (!name || quantity === undefined || !unit) {
      return res.status(400).json({
        success: false,
        message: "Sva polja sastojka moraju biti popunjena.",
      });
    }

    const affectedRows = await updateRecipeIngredient({
      ingredientId,
      recipeId,
      name,
      quantity,
      unit,
      offCalories,
      offProtein,
      offCarbohydrates,
      offFat,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Sastojak nije pronađen.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sastojak je uspešno izmenjen.",
    });
  } catch (error) {
    console.error("Greška pri izmeni sastojka:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri izmeni sastojka.",
    });
  }
};

// Brisanje sastojka recepta
const deleteIngredient = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const ingredientId = Number(req.params.ingredientId);

    const affectedRows = await deleteRecipeIngredient({
      ingredientId,
      recipeId,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Sastojak nije pronađen.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sastojak je uspešno obrisan.",
    });
  } catch (error) {
    console.error("Greška pri brisanju sastojka:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri brisanju sastojka.",
    });
  }
};

const addStepToRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    const { stepNumber, description } = req.body;

    if (!stepNumber || !description || !description.trim()) {
      return res.status(400).json({
        message: "Podaci za korak nisu ispravni.",
      });
    }

    const stepId = await addRecipeStep({
      recipeId,
      stepNumber,
      description: description.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Korak je uspešno dodat.",
      stepId,
    });
  } catch (error) {
    console.error("Greška pri dodavanju koraka:", error);

    return res.status(500).json({
      message: "Greška na serveru.",
    });
  }
};

const getStepsForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    const steps = await getRecipeSteps(recipeId);

    return res.status(200).json({
      success: true,
      steps,
    });
  } catch (error) {
    console.error("Greška pri učitavanju koraka:", error);

    return res.status(500).json({
      message: "Greška na serveru.",
    });
  }
};

const updateStep = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const stepId = Number(req.params.stepId);

    const { stepNumber, description } = req.body;

    if (isNaN(recipeId) || isNaN(stepId)) {
      return res.status(400).json({
        message: "Neispravan ID recepta ili koraka.",
      });
    }

    if (!stepNumber || !description || !description.trim()) {
      return res.status(400).json({
        message: "Podaci za korak nisu ispravni.",
      });
    }

    const affectedRows = await updateRecipeStep({
      stepId,
      recipeId,
      stepNumber,
      description: description.trim(),
    });

    // Ako UPDATE nije promenio nijedan red,
    // proveravamo da li korak zaista postoji.
    if (affectedRows === 0) {
      return res.status(200).json({
        success: true,
        message: "Korak je već ažuriran.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Korak je uspešno izmenjen.",
    });
  } catch (error) {
    console.error("Greška pri izmeni koraka:", error);

    return res.status(500).json({
      message: "Greška na serveru.",
    });
  }
};

const deleteStep = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const stepId = Number(req.params.stepId);

    const affectedRows = await deleteRecipeStep({
      stepId,
      recipeId,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Korak nije pronađen.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Korak je uspešno obrisan.",
    });
  } catch (error) {
    console.error("Greška pri brisanju koraka:", error);

    return res.status(500).json({
      message: "Greška na serveru.",
    });
  }
};

// Dodavanje recepta u favorite
const addRecipeToFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = Number(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        message: "Neispravan ID recepta.",
      });
    }

    const alreadyFavorite = await isFavorite({
      userId,
      recipeId,
    });

    if (alreadyFavorite) {
      return res.status(400).json({
        message: "Recept je već u favoritima.",
      });
    }

    const favoriteId = await addFavorite({
      userId,
      recipeId,
    });

    return res.status(201).json({
      message: "Recept je dodat u favorite.",
      favoriteId,
    });
  } catch (error) {
    console.error("Greška pri dodavanju favorita:", error);

    return res.status(500).json({
      message: "Došlo je do greške pri dodavanju favorita.",
    });
  }
};

// Uklanjanje recepta iz favorita
const removeRecipeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = Number(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        message: "Neispravan ID recepta.",
      });
    }

    const deletedRows = await removeFavorite({
      userId,
      recipeId,
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        message: "Recept nije pronađen u favoritima.",
      });
    }

    return res.status(200).json({
      message: "Recept je uklonjen iz favorita.",
    });
  } catch (error) {
    console.error("Greška pri uklanjanju favorita:", error);

    return res.status(500).json({
      message: "Došlo je do greške pri uklanjanju favorita.",
    });
  }
};

// Provera da li je recept u favoritima
const checkRecipeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = Number(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).json({
        message: "Neispravan ID recepta.",
      });
    }

    const favorite = await isFavorite({
      userId,
      recipeId,
    });

    return res.status(200).json({
      isFavorite: favorite,
    });
  } catch (error) {
    console.error("Greška pri proveri favorita:", error);

    return res.status(500).json({
      message: "Došlo je do greške pri proveri favorita.",
    });
  }
};

// Dohvatanje svih favorita korisnika
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;

    const favorites = await getFavoritesByUserId(userId);

    return res.status(200).json(favorites);
  } catch (error) {
    console.error("Greška pri dohvatanju favorita:", error);

    return res.status(500).json({
      message: "Došlo je do greške pri dohvatanju favorita.",
    });
  }
};

module.exports = {
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
};
