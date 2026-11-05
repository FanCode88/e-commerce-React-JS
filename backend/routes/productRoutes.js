const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// 1. Configurarea Cloudinary cu datele din .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setarea storage-ului pentru Multer direct în Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif", "mp4", "mov", "avi", "webm"],
  },
});

// Folosim upload.array în loc de upload.fields, deoarece în React trimiți totul sub cheia "images"
const upload = multer({ storage: storage });

// Rute
router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  isAdmin,
  upload.array("images", 10),
  createProduct,
);

router.put(
  "/:id",
  protect,
  isAdmin,
  upload.array("images", 10), 
  updateProduct,
);

// Ștergere produs
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
