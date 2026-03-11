const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  return res.json({ orders: [] });
});

router.get('/:id', protect, async (req, res) => {
  return res.status(404).json({ message: 'Order not found (not implemented)' });
});

module.exports = router;

