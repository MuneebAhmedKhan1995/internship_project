// import express from 'express';
// import multer from 'multer';
// import {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getProductsByCategory
// } from '../controllers/productController.js';
// import { auth, admin } from '../middleware/auth.js';

// const router = express.Router();

// // Configure multer for memory storage (Cloudinary will handle the file)
// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only images are allowed'), false);
//     }
//   }
// });

// router.get('/', getAllProducts);
// router.get('/:id', getProductById);
// router.get('/category/:categoryId', getProductsByCategory);
// router.post('/', auth, admin, upload.single('image'), createProduct);
// router.put('/:id', auth, admin, upload.single('image'), updateProduct);
// router.delete('/:id', auth, admin, deleteProduct);

// export default router;








import express from 'express';
import multer from 'multer';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../Controller/productController.js';
import { auth, admin } from '../middleware/authMiddleware.js'; // Fixed import path

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

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);
router.post('/', auth, admin, upload.single('image'), createProduct);
router.put('/:id', auth, admin, upload.single('image'), updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

export default router;