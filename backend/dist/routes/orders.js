"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', orderController_1.createOrder);
// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public
router.get('/:id', orderController_1.getOrderById);
// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Public
router.put('/:id/pay', orderController_1.updateOrderToPaid);
// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', orderController_1.updateOrderStatus);
exports.default = router;
