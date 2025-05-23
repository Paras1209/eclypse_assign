import express from 'express';

const router = express.Router();

// @route   POST /api/cart/add
// @desc    Add item to cart (in real apps, this would involve sessions or auth)
// @access  Public
router.post('/add', (req, res): void => {
  try {
    // In a real app, this would store cart data in the database
    // For now, we'll just echo back the cart item that was added
    const { productId, quantity, size } = req.body;
    res.status(200).json({ 
      message: 'Item added to cart',
      item: { productId, quantity, size }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
