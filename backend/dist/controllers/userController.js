"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAddress = exports.savePaymentMethod = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
// Generate JWT token
const generateToken = (id) => {
    const jwtSecret = process.env.JWT_SECRET || 'eclypse_secret';
    return jsonwebtoken_1.default.sign({ id: id.toString() }, jwtSecret, {
        expiresIn: '30d',
    });
};
/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }
        // Check if user exists
        const userExists = await user_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Create user
        const user = await user_1.default.create({
            name,
            email,
            password,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }
        // Find user by email
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Mark as returning customer if this is not their first login
        if (!user.isReturningCustomer) {
            user.isReturningCustomer = true;
            await user.save();
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isReturningCustomer: user.isReturningCustomer,
            savedPaymentMethods: user.savedPaymentMethods || [],
            savedAddresses: user.savedAddresses || [],
            token: generateToken(user._id),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    var _a;
    try {
        // The user is attached to the request by the auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = await user_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserProfile = getUserProfile;
/**
 * @desc    Save a payment method
 * @route   POST /api/users/payment-method
 * @access  Private
 */
const savePaymentMethod = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const { type, cardLastFour, cardType, expiry, isDefault } = req.body;
        if (!type) {
            res.status(400).json({ message: 'Payment method type is required' });
            return;
        }
        const user = await user_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        } // Create new payment method object
        const newPaymentMethod = {
            id: new mongoose_1.default.Types.ObjectId().toString(), // Generate unique ID
            type,
            cardLastFour: cardLastFour || '',
            cardType: cardType || '',
            expiry: expiry || '',
            isDefault: isDefault || false,
            token: `token_${Date.now()}`, // In a real app, this would come from payment provider
        };
        // If this is set as default, unset any existing defaults
        if (newPaymentMethod.isDefault) {
            user.savedPaymentMethods.forEach(method => {
                method.isDefault = false;
            });
        }
        user.savedPaymentMethods.push(newPaymentMethod);
        await user.save();
        res.status(201).json({
            message: 'Payment method saved',
            paymentMethod: newPaymentMethod, // Return the newly created payment method
            paymentMethods: user.savedPaymentMethods
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.savePaymentMethod = savePaymentMethod;
/**
 * @desc    Save a shipping address
 * @route   POST /api/users/address
 * @access  Private
 */
const saveAddress = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const { fullName, address, city, postalCode, country, phone, isDefault } = req.body;
        if (!fullName || !address || !city || !postalCode || !country) {
            res.status(400).json({ message: 'All address fields are required' });
            return;
        }
        const user = await user_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        } // Create new address object
        const newAddress = {
            id: new mongoose_1.default.Types.ObjectId().toString(), // Generate unique ID
            fullName,
            address,
            city,
            postalCode,
            country,
            phone: phone || '',
            isDefault: isDefault || false,
        };
        // If this is set as default, unset any existing defaults
        if (newAddress.isDefault) {
            user.savedAddresses.forEach(addr => {
                addr.isDefault = false;
            });
        }
        user.savedAddresses.push(newAddress);
        await user.save();
        res.status(201).json({
            message: 'Address saved',
            address: newAddress, // Return the newly created address
            addresses: user.savedAddresses
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.saveAddress = saveAddress;
