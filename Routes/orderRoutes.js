import express from 'express';
import {
  createOrder,
  createPaymentIntent,
  createStripeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  stripeWebhook
} from '../Controller/orderController.js';
import { auth, admin } from '../middleware/authMiddleware.js';  // Fixed: Use correct export names

const router = express.Router();

// Webhook route (must be before express.json())
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes - use 'auth' instead of 'authenticate'
router.use(auth);  // Fixed: Use 'auth' instead of 'authenticate'
router.post('/create-order', createOrder);
router.post('/create-payment-intent', createPaymentIntent);
router.post('/create-stripe-order', createStripeOrder);
router.get('/my-orders', getUserOrders);

// Admin routes - use 'admin' instead of 'authorizeAdmin'
router.get('/all-orders', admin, getAllOrders);  // Fixed: Use 'admin' instead of 'authorizeAdmin'
router.put('/:id/status', admin, updateOrderStatus);  // Fixed: Use 'admin' instead of 'authorizeAdmin'

export default router;