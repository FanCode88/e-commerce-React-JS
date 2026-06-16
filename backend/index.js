require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

// Import rute
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// 1. Conectare la MongoDB (Așteptăm conexiunea înainte de a face orice altceva)
connectDB();

// 2. Middlewares globale
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Recomandat pentru formulare complexe

// 3. Fișiere statice
app.use('/uploads', express.static('uploads'));

// 4. API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 5. Root route (Opțional, util pentru Health Check)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 6. Middleware pentru gestionarea erorilor 404 (Ruta negăsită)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 7. Middleware Global de Error Handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // Arătăm stack trace-ul doar în development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Serverul rulează în modul ${process.env.NODE_ENV} pe portul ${PORT}`));
