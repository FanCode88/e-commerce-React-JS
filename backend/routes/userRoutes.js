const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Funcție pentru generarea tokenului
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Middleware pentru protejarea rutelor private
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Utilizatorul nu a fost găsit" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token nevalid sau expirat" });
    }
  } else {
    return res.status(401).json({ message: "Lipsesc acreditările de acces (fără token)" });
  }
};

// Înregistrare utilizator
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const user = new User({ name, email, password, isAdmin });
    await user.save();

    res.status(201).json({
      message: "Utilizator înregistrat",
      user: { name, email, isAdmin },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login utilizator
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email invalid" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Parolă incorectă" });

    const token = generateToken(user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Eroare server", error: err.message });
  }
});

// RUTĂ NOUĂ: Schimbare parolă
// RUTĂ: Schimbare parolă cu validări complete
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Te rugăm să completezi toate câmpurile." });
    }

    // 1. Validare lungime minimă
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Noua parolă este prea scurtă! Trebuie să aibă cel puțin 6 caractere." });
    }

    // 2. Validare parolă identică
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "Noua parolă nu poate fi identică cu parola actuală!" });
    }

    // Preluăm utilizatorul din DB
    const user = await User.findById(req.user._id);

    // 3. Verificare parolă veche
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Parola actuală introdusă este incorectă." });
    }

    // Actualizare parolă
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Parola a fost schimbată cu succes!" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la schimbarea parolei.", error: err.message });
  }
});

module.exports = router;
