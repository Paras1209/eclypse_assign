"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController_1.getProducts);
// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', productController_1.getProductById);
// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', productController_1.createProduct);
// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.route('/:id').put(productController_1.updateProduct);
// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.route('/:id').delete(productController_1.deleteProduct);
exports.default = router;
