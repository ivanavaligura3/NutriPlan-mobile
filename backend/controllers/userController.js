const bcrypt = require("bcrypt");
const pool = require("../config/database");
const jwt = require("jsonwebtoken");

// Registracija novog korisnika
const registerUser = async (req, res) => {
  try {
    // Preuzimanje podataka koje šalje korisnik
    const { first_name, last_name, email, password } = req.body;

    // Provera da li su sva polja popunjena
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Sva polja su obavezna.",
      });
    }

    // Provera da li korisnik sa tim emailom već postoji
    const [existingUsers] = await pool.execute(
      "SELECT id FROM USERS WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Korisnik sa ovom email adresom već postoji.",
      });
    }

    // Hashovanje lozinke
    const passwordHash = await bcrypt.hash(password, 10);

    // Čuvanje korisnika u bazi
    const [result] = await pool.execute(
      `INSERT INTO USERS
            (first_name, last_name, email, password_hash)
            VALUES (?, ?, ?, ?)`,
      [first_name, last_name, email, passwordHash],
    );

    res.status(201).json({
      success: true,
      message: "Registracija je uspešna.",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Greška pri registraciji:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške na serveru.",
    });
  }
};

// Prijava korisnika
const loginUser = async (req, res) => {
  try {
    // Preuzimanje podataka koje šalje korisnik
    const { email, password } = req.body;

    // Provera obaveznih polja
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email i lozinka su obavezni.",
      });
    }

    // Pronalaženje korisnika po email adresi
    const [users] = await pool.execute(
      `SELECT id, first_name, last_name, email, password_hash
            FROM USERS
            WHERE email = ?`,
      [email],
    );

    // Ako korisnik ne postoji
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Pogrešan email ili lozinka.",
      });
    }

    const user = users[0];

    // Provera lozinke
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash,
    );

    // Ako lozinka nije ispravna
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Pogrešan email ili lozinka.",
      });
    }

    // Kreiranje JWT tokena
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Uspešna prijava
    res.status(200).json({
      success: true,
      message: "Uspešna prijava.",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Greška pri prijavi:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške na serveru.",
    });
  }
};

// Dohvatanje podataka trenutno prijavljenog korisnika
const getCurrentUser = async (req, res) => {
  try {
    // Podaci o korisniku dolaze iz JWT middleware-a
    const userId = req.user.userId;

    // Pronalaženje korisnika u bazi
    const [users] = await pool.execute(
      `SELECT id, first_name, last_name, email, created_at
             FROM USERS
             WHERE id = ?`,
      [userId],
    );

    // Ako korisnik ne postoji
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Korisnik nije pronađen.",
      });
    }

    // Vraćanje podataka korisnika
    res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("Greška pri dohvatanju korisnika:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške na serveru.",
    });
  }
};

// Izmena podataka trenutno prijavljenog korisnika
const updateUser = async (req, res) => {
  try {
    // ID korisnika dolazi iz JWT middleware-a
    const userId = req.user.userId;

    // Preuzimanje novih podataka
    const { first_name, last_name, email } = req.body;

    // Provera obaveznih polja
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: "Ime, prezime i email su obavezni.",
      });
    }

    // Provera da li email već koristi neki drugi korisnik
    const [existingUsers] = await pool.execute(
      `SELECT id
             FROM USERS
             WHERE email = ?
             AND id != ?`,
      [email, userId],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Korisnik sa ovom email adresom već postoji.",
      });
    }

    // Ažuriranje podataka korisnika
    await pool.execute(
      `UPDATE USERS
             SET
                first_name = ?,
                last_name = ?,
                email = ?
             WHERE id = ?`,
      [first_name, last_name, email, userId],
    );

    // Dohvatanje ažuriranih podataka
    const [users] = await pool.execute(
      `SELECT id, first_name, last_name, email, created_at
             FROM USERS
             WHERE id = ?`,
      [userId],
    );

    res.status(200).json({
      success: true,
      message: "Podaci korisnika su uspešno izmenjeni.",
      user: users[0],
    });
  } catch (error) {
    console.error("Greška pri izmeni korisnika:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške na serveru.",
    });
  }
};

// Dohvatanje statistike trenutno prijavljenog korisnika
const getUserStatistics = async (req, res) => {
  try {
    // ID korisnika dolazi iz JWT middleware-a
    const userId = req.user.userId;

    // Broj recepata korisnika
    const [recipes] = await pool.execute(
      `SELECT COUNT(*) AS count
       FROM RECIPES
       WHERE user_id = ?`,
      [userId],
    );

    // Broj planiranih obroka korisnika
    const [plannedMeals] = await pool.execute(
      `SELECT COUNT(*) AS count
       FROM MEALS
       WHERE user_id = ?`,
      [userId],
    );

    // Broj završenih obroka korisnika
    const [completedMeals] = await pool.execute(
      `SELECT COUNT(*) AS count
       FROM MEALS
       WHERE user_id = ?
       AND is_completed = 1`,
      [userId],
    );

    // Broj namirnica korisnika
    const [foods] = await pool.execute(
      `SELECT COUNT(*) AS count
       FROM FOODS
       WHERE user_id = ?`,
      [userId],
    );

    res.status(200).json({
      success: true,
      statistics: {
        recipes: Number(recipes[0].count),
        plannedMeals: Number(plannedMeals[0].count),
        completedMeals: Number(completedMeals[0].count),
        foods: Number(foods[0].count),
      },
    });
  } catch (error) {
    console.error("Greška pri dohvatanju statistike:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri dohvatanju statistike.",
    });
  }
};

// Promena lozinke trenutno prijavljenog korisnika
const changePassword = async (req, res) => {
  try {
    // ID korisnika dolazi iz JWT middleware-a
    const userId = req.user.userId;

    // Preuzimanje lozinki iz zahteva
    const { currentPassword, newPassword } = req.body;

    // Provera obaveznih polja
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Trenutna i nova lozinka su obavezne.",
      });
    }

    // Provera minimalne dužine nove lozinke
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Nova lozinka mora imati najmanje 8 karaktera.",
      });
    }

    // Provera da li nova lozinka sadrži veliko slovo
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Nova lozinka mora sadržati najmanje jedno veliko slovo.",
      });
    }

    // Provera da li nova lozinka sadrži broj
    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Nova lozinka mora sadržati najmanje jedan broj.",
      });
    }

    // Provera da li nova lozinka sadrži specijalan karakter
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Nova lozinka mora sadržati najmanje jedan specijalan karakter.",
      });
    }

    // Dohvatanje trenutnog password hash-a
    const [users] = await pool.execute(
      `SELECT password_hash
       FROM USERS
       WHERE id = ?`,
      [userId],
    );

    // Ako korisnik ne postoji
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Korisnik nije pronađen.",
      });
    }

    // Provera trenutne lozinke
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      users[0].password_hash,
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Trenutna lozinka nije ispravna.",
      });
    }

    // Provera da nova lozinka nije ista kao trenutna
    const isSamePassword = await bcrypt.compare(
      newPassword,
      users[0].password_hash,
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Nova lozinka mora biti drugačija od trenutne.",
      });
    }

    // Hashovanje nove lozinke
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Čuvanje nove lozinke u bazi
    await pool.execute(
      `UPDATE USERS
       SET password_hash = ?
       WHERE id = ?`,
      [newPasswordHash, userId],
    );

    res.status(200).json({
      success: true,
      message: "Lozinka je uspešno promenjena.",
    });
  } catch (error) {
    console.error("Greška pri promeni lozinke:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri promeni lozinke.",
    });
  }
};

// =====================================================
// BRISANJE NALOGA TRENUTNO PRIJAVLJENOG KORISNIKA
// =====================================================

const deleteAccount = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.userId;

    await connection.beginTransaction();

    // -------------------------------------------------
    // Provera da li korisnik postoji
    // -------------------------------------------------

    const [users] = await connection.execute(
      `SELECT id
       FROM USERS
       WHERE id = ?`,
      [userId],
    );

    if (users.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Korisnik nije pronađen.",
      });
    }

    // -------------------------------------------------
    // Brisanje favorita korisnika
    // -------------------------------------------------

    await connection.execute(
      `DELETE FROM FAVORITES
       WHERE user_id = ?`,
      [userId],
    );

    // -------------------------------------------------
    // Brisanje sastojaka recepata korisnika
    // -------------------------------------------------

    await connection.execute(
      `DELETE FROM RECIPE_INGREDIENTS
       WHERE recipe_id IN (
         SELECT id
         FROM RECIPES
         WHERE user_id = ?
       )`,
      [userId],
    );

    // -------------------------------------------------
    // Brisanje koraka pripreme recepata korisnika
    // -------------------------------------------------

    await connection.execute(
      `DELETE FROM RECIPE_STEPS
       WHERE recipe_id IN (
         SELECT id
         FROM RECIPES
         WHERE user_id = ?
       )`,
      [userId],
    );

    // -------------------------------------------------
    // Brisanje obroka korisnika
    // -------------------------------------------------

    await connection.execute(
      `DELETE FROM MEALS
       WHERE user_id = ?`,
      [userId],
    );

    // -------------------------------------------------
    // Brisanje automatskih i ručnih stavki za kupovinu
    // -------------------------------------------------

    await connection.execute(
      `DELETE FROM SHOPPING_ITEMS
       WHERE user_id = ?`,
      [userId],
    );

    // -------------------------------------------------
    // Brisanje namirnica korisnika
    // -------------------------------------------------

    await connection.execute(
      `DELETE FROM FOODS
       WHERE user_id = ?`,
      [userId],
    );

    // -------------------------------------------------
    // Brisanje recepata korisnika
    // -------------------------------------------------

    await connection.execute(
      `DELETE FROM RECIPES
       WHERE user_id = ?`,
      [userId],
    );

    // -------------------------------------------------
    // Brisanje korisnika
    // -------------------------------------------------

    await connection.execute(
      `DELETE FROM USERS
       WHERE id = ?`,
      [userId],
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Nalog je uspešno obrisan.",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Greška pri brisanju naloga:", error);

    res.status(500).json({
      success: false,
      message: "Došlo je do greške pri brisanju naloga.",
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  getUserStatistics,
  changePassword,
  deleteAccount,
};
