const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware pentru autentificare
const protect = async (req, res, next) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
   ) {
      try {
         token = req.headers.authorization.split(' ')[1];

         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         // Căutăm utilizatorul și excludem parola
         req.user = await User.findById(decoded.id).select('-password');

         if (!req.user) {
            return res.status(401).json({ message: 'Utilizator inexistent' });
         }

         next();
      } catch (error) {
         console.error('Eroare token:', error.message);
         return res.status(401).json({ message: 'Token invalid sau expirat' });
      }
   } else {
      return res
         .status(401)
         .json({ message: 'Token lipsă. Acces neautorizat.' });
   }
};

// Middleware pentru acces doar admini
const isAdmin = (req, res, next) => {
   if (req.user && req.user.isAdmin) {
      next();
   } else {
      return res
         .status(403)
         .json({ message: 'Acces interzis: doar adminii au voie' });
   }
};

module.exports = { protect, isAdmin };
