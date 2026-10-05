require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const mealRoutes = require("./routes/mealRoutes");
const foodNutritionRoutes = require("./routes/foodNutritionRoutes");
const userFoodRoutes = require("./routes/userFoodRoutes");
const foodDatabaseRoutes = require("./routes/foodDatabaseRoutes");
const shoppingRoutes = require("./routes/shoppingRoutes");
const openFoodFactsRoutes = require("./routes/openFoodFactsRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// User rute
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/food-nutrition", foodNutritionRoutes);

app.use("/api/foods", userFoodRoutes);

app.use("/api/open-food-facts", openFoodFactsRoutes);

app.use("/api/food-database", foodDatabaseRoutes);

app.use("/api/shopping", shoppingRoutes);

// Test ruta
app.get("/api/test", async (requestAnimationFrame, res) => {
  try {
    // Provera konekcije sa MySQL bazom
    const connection = await pool.getConnection();
    connection.release();

    res.json({
      success: true,
      message: "NutriPlan backend radi i povezan je sa MySQL bazom!",
    });
  } catch (error) {
    console.error("Greška pri povezivanju sa bazom:", error);

    res.status(500).json({
      success: false,
      message: "Backend radi, ali povezivanje sa bazom nije uspelo.",
    });
  }
});

// Pokretanje servera
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NutriPlan backend je pokrenut na portu ${PORT}`);
});
