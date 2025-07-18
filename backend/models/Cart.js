const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
   productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
   },
   size: String,
   quantity: {
      type: Number,
      default: 1,
      required: true,
   },
});

const cartSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   items: [cartItemSchema],
});

module.exports = mongoose.model('Cart', cartSchema);
