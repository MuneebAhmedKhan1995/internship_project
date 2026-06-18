// // routes/authRoutes.js
// import express from 'express';
// import {
//     register,
//     login,
//     adminLogin,
//     logout,
//     getCurrentUser,
//     getAllUsers
// } from '../Controller/authController.js';
// import { protect, adminOnly } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Public routes
// router.post('/register', register);
// router.post('/login', login);
// router.post('/admin-login', adminLogin);
// router.post('/logout', logout);

// // Protected routes
// router.get('/me', protect, getCurrentUser);
// router.get('/users', protect, adminOnly, getAllUsers);
// router.put('/users/:id/status', auth, admin, updateUserStatus);
// export default router;



// routes/authRoutes.js
import express from 'express';
import {
    register,
    login,
    adminLogin,
    logout,
    getCurrentUser,
    getAllUsers,
    updateUserStatus
} from '../Controller/authController.js';
import { auth, admin } from '../middleware/authMiddleware.js';  // Import auth and admin

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/logout', logout);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.get('/users', auth, admin, getAllUsers);
router.put('/users/:id/status', auth, admin, updateUserStatus);

export default router;