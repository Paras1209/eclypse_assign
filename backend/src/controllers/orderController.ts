import { Request, Response } from 'express';
import Order from '../models/order';
import mongoose from 'mongoose';

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      products, 
      shippingAddress, 
      paymentMethod,
      totalPrice
    } = req.body;

    if (!products || products.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Validate product ids
    for (const item of products) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        res.status(400).json({ message: `Invalid product ID: ${item.product}` });
        return;
      }
    }

    const order = new Order({
      products,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }

    const order = await Order.findById(orderId).populate('products.product', 'name price images');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Public
 */
export const updateOrderToPaid = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }

    const order = await Order.findById(orderId);

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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }

    const order = await Order.findById(orderId);

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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};