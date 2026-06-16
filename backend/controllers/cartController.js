const Cart = require('../models/Cart');
const Product = require('../models/Product');

// 1. OBȚINE COȘUL UTILIZATORULUI
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) return res.json({ items: [] });

    const validItems = cart.items.filter((item) => item.productId);

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const transformedItems = validItems.map((item) => {
      const product = item.productId;
      const actualQuantity = item.quantity && item.quantity > 0 ? item.quantity : 1;

      return {
        _id: item._id,
        productId: product?._id,
        size: item.size,
        quantity: actualQuantity,
        name: product?.name || 'N/A',
        description: product?.description || '',
        price: product?.price || 0,
        image: product?.image || [],
      };
    });

    res.json({ items: transformedItems });
  } catch (err) {
    console.error('Eroare getUserCart:', err);
    res.status(500).json({ message: 'Eroare la preluarea coșului' });
  }
};

// 2. ADAUGĂ UN PRODUS ÎN COȘ (CU VERIFICARE STOC)
exports.addToCart = async (req, res) => {
  const { userId, productId, size, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produsul nu mai există' });

    if (product.countInStock < quantity) {
      return res.status(400).json({ message: `Stoc limitat! Mai sunt doar ${product.countInStock} bucăți.` });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, size, quantity }] });
    } else {
      const existingItem = cart.items.find((item) => item.productId.toString() === productId && item.size === size);

      if (existingItem) {
        if (existingItem.quantity + quantity > product.countInStock) {
          return res.status(400).json({ message: `Stoc limitat! Nu poți adăuga mai mult de ${product.countInStock} bucăți.` });
        }
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

// 3. SCADE CANTITATEA SAU ȘTERGE COMPLET UN ITEM
exports.removeFromCart = async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Coșul nu există' });

    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (!item) return res.status(404).json({ message: 'Item-ul nu există' });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la ștergerea item-ului' });
  }
};

// 4. CREȘTE CANTITATEA CU +1 DIN COȘ (CU VERIFICARE STOC)
exports.increaseQuantity = async (req, res) => {
  const { userId, productId, size } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Coșul nu există' });

    const item = cart.items.find((i) => i.productId.toString() === productId && i.size === size);
    if (!item) return res.status(404).json({ message: 'Produsul nu există în coș' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produsul nu mai este disponibil' });

    if (item.quantity + 1 > product.countInStock) {
      return res.status(400).json({
        message: `Stoc limitat! Mai sunt doar ${product.countInStock} bucăți în stoc pentru mărimea ${size}.`,
      });
    }

    item.quantity += 1;
    await cart.save();

    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: 'Eroare la creșterea cantității' });
  }
};

// 5. ȘTERGE COMPLET UN GRUP (PRODUS + MĂRIME) DIN COȘ
exports.removeGroupFromCart = async (req, res) => {
  const { userId, productId, size } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Coșul nu există' });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId || item.size !== size);

    await cart.save();
    res.json({ message: 'Grup șters cu succes', cart });
  } catch (err) {
    res.status(500).json({ message: 'Eroare la ștergerea grupului' });
  }
};

// 6. GOLIRE COMPLETĂ COȘ
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
