const Product = require('../models/Product');

// Obține toate produsele (cu opțional filtrare după categorie)
exports.getAllProducts = async (req, res) => {
   try {
      const limit = parseInt(req.query.limit) || 0;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;
      const category = req.query.category;

      let filter = {};
      if (category) {
         filter.category = category;
      }

      const products = await Product.find(filter)
         .sort({ createdAt: sortDirection })
         .limit(limit);

      res.json(products);
   } catch (err) {
      res.status(500).json({ message: 'Eroare la preluarea produselor' });
   }
};

// Obține un produs după ID
exports.getProductById = async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);
      if (!product) {
         return res.status(404).json({ message: 'Produsul nu a fost găsit' });
      }
      res.json(product);
   } catch (err) {
      res.status(500).json({ message: 'Eroare la preluarea produsului' });
   }
};

// Creează un produs nou
exports.createProduct = async (req, res) => {
   try {
      const { name, brand, price, description, countInStock, category } =
         req.body;
      const size = req.body.size;
      const sizeArray = Array.isArray(size) ? size : size ? [size] : [];

      const imagePaths =
         req.files?.map(
            (file) =>
               `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
         ) || [];

      const newProduct = new Product({
         name,
         brand,
         price,
         description,
         countInStock,
         category,
         size: sizeArray,
         image: imagePaths,
      });

      const saved = await newProduct.save();
      res.status(201).json(saved);
   } catch (err) {
      console.error('Eroare la createProduct:', err.message);
      res.status(400).json({
         error: 'Eroare la salvare produs',
         details: err.message,
      });
   }
};

// Actualizează un produs existent
exports.updateProduct = async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);
      if (!product) {
         return res.status(404).json({ message: 'Produsul nu a fost găsit' });
      }

      product.name = req.body.name || product.name;
      product.brand = req.body.brand || product.brand;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.category = req.body.category || product.category;

      const size = req.body.size;
      product.size = Array.isArray(size) ? size : size ? [size] : product.size;

      if (req.files?.length > 0) {
         product.image = req.files.map(
            (file) =>
               `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
         );
      } else if (req.body.image) {
         product.image = Array.isArray(req.body.image)
            ? req.body.image
            : [req.body.image];
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
   } catch (err) {
      res.status(500).json({ message: 'Eroare la actualizare produs' });
   }
};

// Șterge un produs după ID
exports.deleteProduct = async (req, res) => {
   try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Produs șters' });
   } catch (err) {
      res.status(500).json({ message: 'Eroare la ștergere produs' });
   }
};
