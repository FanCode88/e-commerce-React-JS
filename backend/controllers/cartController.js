const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Obține coșul unui utilizator
exports.getUserCart = async (req, res) => {
   try {
      const cart = await Cart.findOne({ userId: req.params.userId }).populate(
         'items.productId'
      );
      if (!cart) return res.json({ items: [] });

      // Filtrare produse valide
      const validItems = cart.items.filter((item) => item.productId);

      // Actualizare coș dacă există itemi invalizi
      if (validItems.length !== cart.items.length) {
         cart.items = validItems;
         await cart.save();
      }

      // Transformare pentru front-end
      const transformedItems = validItems.map((item) => {
         const product = item.productId;
         return {
            _id: item._id, // Adăugat ID-ul item-ului din coș
            productId: product?._id,
            size: item.size,
            quantity: item.quantity, // Păstrează cantitatea originală
            name: product?.name || 'N/A',
            description: product?.description || '',
            price: product?.price || 0,
            image: product?.image || [],
         };
      });

      res.json({ items: transformedItems });
   } catch (err) {
      res.status(500).json({ message: 'Eroare la preluarea coșului' });
   }
};

// Adaugă un produs în coș
exports.addToCart = async (req, res) => {
   const { userId, productId, size, quantity = 1 } = req.body;

   try {
      let cart = await Cart.findOne({ userId });

      // În controllerul addToCart
      if (!cart) {
         cart = new Cart({ userId, items: [{ productId, size, quantity: 1 }] });
      } else {
         const existingItem = cart.items.find(
            (item) =>
               item.productId.toString() === productId && item.size === size
         );

         if (existingItem) {
            existingItem.quantity += quantity;
         } else {
            cart.items.push({ productId, size, quantity });
         }
      }

      await cart.save();
      res.status(200).json(cart);
   } catch (err) {
      res.status(500).json({ message: 'Eroare la adăugarea în coș' });
   }
};

// Șterge un produs din coș
exports.removeFromCart = async (req, res) => {
   const { userId, itemId } = req.params;

   try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: 'Coșul nu există' });

      const item = cart.items.find((item) => item._id.toString() === itemId);
      if (!item) return res.status(404).json({ message: 'Item-ul nu există' });

      if (item.quantity > 1) {
         item.quantity -= 1; // Scade cantitatea
      } else {
         // Dacă e ultima bucată, șterge complet
         cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
      }

      await cart.save();
      res.json(cart);
   } catch (err) {
      res.status(500).json({ message: 'Eroare la ștergerea item-ului' });
   }
};

exports.increaseQuantity = async (req, res) => {
   const { userId, itemId } = req.body;

   try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: 'Coșul nu există' });

      const item = cart.items.find((i) => i._id.toString() === itemId);
      if (!item) return res.status(404).json({ message: 'Item-ul nu există' });

      item.quantity += 1;
      await cart.save();

      res.json(cart);
   } catch (err) {
      res.status(500).json({ message: 'Eroare la creșterea cantității' });
   }
};

// Șterge complet un grup (produs + mărime) din coș
exports.removeGroupFromCart = async (req, res) => {
   const { userId, productId, size } = req.body;

   try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: 'Coșul nu există' });

      // Filtrează toate produsele care NU sunt acest grup
      cart.items = cart.items.filter(
         (item) => item.productId.toString() !== productId || item.size !== size
      );

      await cart.save();
      res.json({ message: 'Grup șters cu succes', cart });
   } catch (err) {
      res.status(500).json({ message: 'Eroare la ștergerea grupului' });
   }
};

exports.clearCart = async (req, res) => {
   const userId = req.params.userId;

   try {
      await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
      res.status(200).json({ message: 'Coș golit cu succes.' });
   } catch (err) {
      console.error('Eroare la golirea coșului:', err);
      res.status(500).json({ error: 'Eroare la golirea coșului.' });
   }
};
