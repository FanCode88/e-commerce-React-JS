const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      brand: String,
      price: { type: Number, required: true },
      description: String,
      size: [String],
      image: [String],
      countInStock: Number,
      category: {
         type: String,
         enum: ['men', 'women', 'children'],
         required: true,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
