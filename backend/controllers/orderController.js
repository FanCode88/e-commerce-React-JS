const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
   try {
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();

      res.status(201).json({
         message: 'Order placed successfully',
         orderNumber: savedOrder._id,
      });
   } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Failed to create order' });
   }
};
