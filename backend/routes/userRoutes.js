const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Funcție pentru generarea tokenului
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Înregistrare utilizator
router.post('/register', async (req, res) => {
   try {
      const { name, email, password, isAdmin } = req.body; // adaugă isAdmin
      const user = new User({ name, email, password, isAdmin }); // folosește isAdmin
      await user.save();

      res.status(201).json({
         message: 'Utilizator înregistrat',
         user: { name, email, isAdmin },
      });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Login utilizator
router.post('/login', async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Email invalid' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
         return res.status(401).json({ message: 'Parolă incorectă' });

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
      res.status(500).json({ message: 'Eroare server', error: err.message });
   }
});

module.exports = router;
