const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Verificăm dacă fișierul este imagine SAU video
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Doar fișiere de tip imagine sau video sunt acceptate!"));
    }
  },
  // Am mărit limita la 50MB pentru a permite încărcarea videoclipurilor
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload;
