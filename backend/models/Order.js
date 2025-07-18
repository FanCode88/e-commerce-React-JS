const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      items: [
         {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            size: String,
         },
      ],
      email: String,
      firstName: String,
      lastName: String,
      address: String,
      phone: String,
      paymentMethod: String,
      total: Number,
   },
   { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
