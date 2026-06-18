import express from 'express';
import multer from 'multer';
import { 
  getAllCategories, 
  getCategoryById,
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../Controller/categoryContoller.js';
import { auth, admin } from '../middleware/authMiddleware.js'; // Fixed import

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', auth, admin, upload.single('image'), createCategory);
router.put('/:id', auth, admin, upload.single('image'), updateCategory);
router.delete('/:id', auth, admin, deleteCategory);

export default router;