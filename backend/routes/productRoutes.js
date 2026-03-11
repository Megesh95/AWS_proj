const express = require('express');
const { getAllProducts, getProductById } = require('../models/productModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    return res.json({ products });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ product });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching product by id:', error);
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;


