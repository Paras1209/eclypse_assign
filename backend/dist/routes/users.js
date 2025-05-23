"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController_1.registerUser);
// @route   POST /api/users/login
// @desc    Login user & get token
// @access  Public
router.post('/login', userController_1.loginUser);
// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware_1.protect, userController_1.getUserProfile);
// @route   POST /api/users/payment-method
// @desc    Save a payment method
// @access  Private
router.post('/payment-method', authMiddleware_1.protect, userController_1.savePaymentMethod);
// @route   POST /api/users/address
// @desc    Save a shipping address
// @access  Private
router.post('/address', authMiddleware_1.protect, userController_1.saveAddress);
exports.default = router;
