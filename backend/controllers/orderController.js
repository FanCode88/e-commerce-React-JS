const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  const { userId, items, email, firstName, lastName, address, phone, paymentMethod, total } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Coșul tău este gol.' });
    }

    const orderItems = [];

    for (const item of cart.items) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId._id);

      if (!product) {
        return res.status(404).json({ message: `Unul dintre produse nu mai există în magazin.` });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({ message: `Stoc epuizat între timp pentru ${product.name}!` });
      }

      product.countInStock -= item.quantity;
      if (product.countInStock < 0) product.countInStock = 0;
      await product.save();

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        size: item.size,
      });
    }

    const newOrder = new Order({
      userId,
      items: orderItems,
      email,
      firstName,
      lastName,
      address,
      phone,
      paymentMethod,
      total,
      status: 'Pending',
    });

    await newOrder.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: 'Comandă plasată cu succes!',
      order: newOrder,
      orderNumber: newOrder._id,
    });
  } catch (err) {
    console.error('Eroare la crearea comenzii (pe backend):', err);
    res.status(500).json({ message: 'Eroare la finalizarea comenzii.', details: err.message });
  }
};

// 2. Anulare și Ștergere Definitivă Comandă
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Comanda nu există' });

    for (const item of order.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { countInStock: item.quantity },
        });
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Comandă anulată cu succes și ștearsă definitiv!' });
  } catch (err) {
    console.error('Eroare la anularea/ștergerea comenzii:', err);
    res.status(500).json({ message: 'Eroare la anularea comenzii' });
  }
};

// 3. Preluare toate comenzile
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Eroare la preluarea comenzilor:', err);
    res.status(500).json({ message: 'Eroare la preluarea comenzilor pentru Admin.' });
  }
};

// 4. Numărare comenzi necitite/Pending
const getUnreadOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: 'Pending' });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Eroare la numărarea comenzilor noi.' });
  }
};

module.exports = {
  createOrder,
  cancelOrder,
  getAllOrders,
  getUnreadOrdersCount,
};
