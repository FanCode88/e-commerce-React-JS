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
    resource_type: "auto", // Detectează automat dacă este imagine sau video
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mov", "avi"], // Formate permise incluzând video
  },
});

const upload = multer({ storage: storage });

// Rute
router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  createProduct,
);

router.put(
  "/:id",
  protect,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  updateProduct,
);

// Ștergere produs
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
