import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
} from '../controllers/orderController';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', createOrder);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public
router.get('/:id', getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Public
router.put('/:id/pay', updateOrderToPaid);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', updateOrderStatus);

export default router;
