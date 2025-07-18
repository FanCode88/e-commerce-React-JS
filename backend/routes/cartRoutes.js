const express = require('express');
const router = express.Router();
const {
   getUserCart,
   addToCart,
   removeFromCart,
   increaseQuantity,
   removeGroupFromCart,
   clearCart,
} = require('../controllers/cartController');

router.get('/:userId', getUserCart);
router.post('/add', addToCart);
router.delete('/:userId/clear', clearCart); 
router.delete('/:userId/:itemId', removeFromCart);
router.patch('/increase', increaseQuantity);
router.delete('/remove-group', removeGroupFromCart);

module.exports = router;
