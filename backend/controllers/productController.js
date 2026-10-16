const Product = require("../models/Product");

// Obține toate produsele (cu opțional filtrare după categorie)
exports.getAllProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const category = req.query.category;

    let filter = {};
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: sortDirection }).limit(limit);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Eroare la preluarea produselor" });
  }
};

// Obține un produs după ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produsul nu a fost găsit" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Eroare la preluarea produsului" });
  }
};

// Creează un produs nou (cu Cloudinary pentru imagini și video)
exports.createProduct = async (req, res) => {
  try {
    const { name, brand, price, description, countInStock, category } = req.body;
    const size = req.body.size;
    const sizeArray = Array.isArray(size) ? size : size ? [size] : [];

    // Preluăm link-urile de la Cloudinary pentru imagini
    const imagePaths = req.files?.images ? req.files.images.map((file) => file.path) : [];

    // Preluăm link-ul de la Cloudinary pentru video (dacă există)
    const videoPath = req.files?.video ? req.files.video[0].path : "";

    const newProduct = new Product({
      name,
      brand,
      price,
      description,
      countInStock,
      category,
      size: sizeArray,
      image: imagePaths,
      video: videoPath, // Salvăm și link-ul video
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Eroare la createProduct:", err.message);
    res.status(400).json({
      error: "Eroare la salvare produs",
      details: err.message,
    });
  }
};

// Actualizează un produs existent
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produsul nu a fost găsit." });
    }

    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.countInStock = req.body.countInStock || product.countInStock;
    if (req.body.category) product.category = req.body.category;

    // Actualizare mărimi dacă sunt trimise
    if (req.body.size) {
      const size = req.body.size;
      product.size = Array.isArray(size) ? size : [size];
    }

    // Actualizăm imaginile de pe Cloudinary dacă au fost încărcate altele noi
    if (req.files && req.files.images && req.files.images.length > 0) {
      product.image = req.files.images.map((file) => file.path);
    }

    // Actualizăm videoclipul de pe Cloudinary dacă a fost încărcat unul nou
    if (req.files && req.files.video && req.files.video.length > 0) {
      product.video = req.files.video[0].path;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Șterge un produs după ID
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Produs șters" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la ștergere produs" });
  }
};
