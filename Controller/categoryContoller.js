import Category from '../Models/Category.js';
import cloudinary from '../config/cloudinary.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create category with image
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a category image' });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'categories',
      transformation: [
        { width: 300, height: 300, crop: 'limit' }
      ]
    });

    const category = new Category({
      name,
      description: description || '',
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description } = req.body;
    
    // Update image if new one is uploaded
    let imageUrl = category.imageUrl;
    let cloudinaryId = category.cloudinaryId;

    if (req.file) {
      // Delete old image from cloudinary
      await cloudinary.uploader.destroy(category.cloudinaryId);
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'categories',
        transformation: [
          { width: 300, height: 300, crop: 'limit' }
        ]
      });
      
      imageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.imageUrl = imageUrl;
    category.cloudinaryId = cloudinaryId;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(category.cloudinaryId);
    
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};