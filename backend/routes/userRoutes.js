const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  getUserStatistics,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

// Ruta za registraciju korisnika
router.post("/register", registerUser);

// Ruta za prijavu korisnika
router.post("/login", loginUser);

// Zaštićena ruta za trenutno prijavljenog korisnika
router.get("/me", authenticateToken, getCurrentUser);

// Zaštićena ruta za izmenu podataka korisnika
router.put("/me", authenticateToken, updateUser);

// Zaštićena ruta za statistiku trenutno prijavljenog korisnika
router.get("/statistics", authenticateToken, getUserStatistics);

// Zaštićena ruta za promenu lozinke
router.put("/change-password", authenticateToken, changePassword);
router.delete("/me", authenticateToken, deleteAccount);

module.exports = router;
