const express = require('express');
const router = express.Router();
const {
   getAllProducts,
   getProductById,
   createProduct,
   updateProduct,
   deleteProduct,
} = require('../controllers/productController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// 🔽 Importă și configurează multer aici
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/'); // salvează imaginile în folderul uploads/
   },
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
   },
});
const upload = multer({ storage });

// 🔽 Rutele
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// 🔽 Adaugă un produs cu imagine (una sau mai multe)
router.post('/', protect, isAdmin, upload.array('images', 5), createProduct);

// 🔽 Update (dacă vrei să accepți o singură imagine nouă)
router.put('/:id', protect, isAdmin, upload.single('image'), updateProduct);

router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
