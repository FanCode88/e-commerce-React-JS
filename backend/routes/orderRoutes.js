const express = require('express');
const router = express.Router();
const { createOrder, cancelOrder, getAllOrders, getUnreadOrdersCount } = require('../controllers/orderController');
const OrderModel = require('../models/Order');

router.get('/', getAllOrders);
router.post('/', createOrder);
router.delete('/cancel/:id', cancelOrder);
router.get('/unread-count', getUnreadOrdersCount);

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, { status: status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Comanda nu a fost găsită!' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la server', error: error.message });
  }
});

module.exports = router;
