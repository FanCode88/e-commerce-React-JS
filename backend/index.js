// 1. Load environment variables cât mai devreme
require('dotenv').config();

// 2. Import module externe și interne
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// 3. Middlewares globale
app.use(cors());
app.use(express.json()); // pentru `req.body` JSON
app.use('/uploads', express.static('uploads')); // servește imaginile

// 4. Conectare la MongoDB
connectDB();

// 5. API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 6. Pornire server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Serverul rulează pe portul ${PORT}`));
