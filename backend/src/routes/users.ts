import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  savePaymentMethod,
  saveAddress,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @route   POST /api/users/payment-method
// @desc    Save a payment method
// @access  Private
router.post('/payment-method', protect, savePaymentMethod);

// @route   POST /api/users/address
// @desc    Save a shipping address
// @access  Private
router.post('/address', protect, saveAddress);

export default router;
