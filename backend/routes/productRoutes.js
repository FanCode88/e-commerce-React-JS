const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Rute publice
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Creare produs (până la 10 poze)
router.post("/", protect, isAdmin, upload.array("images", 10), createProduct);

// Actualizare produs (până la 10 poze noi)
router.put("/:id", protect, isAdmin, upload.array("images", 10), updateProduct);

// Ștergere produs
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
