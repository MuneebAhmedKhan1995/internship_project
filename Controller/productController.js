import Product from '../Models/Product.js';
import cloudinary from '../config/cloudinary.js';

// Get all products
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate('category', 'name');
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// In your product controller, modify getAllProducts
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    
    // Debug: Log image URLs
    console.log('Products with images:');
    products.forEach(p => {
      console.log(`${p.name}: ${p.imageUrl}`);
    });
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product with image upload
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;
    
    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products',
      transformation: [
        { width: 500, height: 500, crop: 'limit' }
      ]
    });

    const product = new Product({
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      description,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, stock, category, description } = req.body;
    
    // Update image if new one is uploaded
    let imageUrl = product.imageUrl;
    let cloudinaryId = product.cloudinaryId;

    if (req.file) {
      // Delete old image from cloudinary
      await cloudinary.uploader.destroy(product.cloudinaryId);
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
        transformation: [
          { width: 500, height: 500, crop: 'limit' }
        ]
      });
      
      imageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    product.name = name || product.name;
    product.price = parseFloat(price) || product.price;
    product.stock = parseInt(stock) || product.stock;
    product.category = category || product.category;
    product.description = description || product.description;
    product.imageUrl = imageUrl;
    product.cloudinaryId = cloudinaryId;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(product.cloudinaryId);
    
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('category', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};