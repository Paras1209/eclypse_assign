"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.updateOrderToPaid = exports.getOrderById = exports.createOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod, totalPrice } = req.body;
        if (!products || products.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }
        // Validate product ids
        for (const item of products) {
            if (!mongoose_1.default.Types.ObjectId.isValid(item.product)) {
                res.status(400).json({ message: `Invalid product ID: ${item.product}` });
                return;
            }
        }
        const order = new order_1.default({
            products,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createOrder = createOrder;
/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        const order = await order_1.default.findById(orderId).populate('products.product', 'name price images');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getOrderById = getOrderById;
/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Public
 */
const updateOrderToPaid = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        const order = await order_1.default.findById(orderId);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        // Update payment information
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateOrderToPaid = updateOrderToPaid;
/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        const order = await order_1.default.findById(orderId);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        // Validate status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: 'Invalid status' });
            return;
        }
        // Update status information
        order.status = status;
        // If delivered, update delivered information
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
