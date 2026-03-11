const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { protect } = require('../middleware/authMiddleware');
const { createUser, findUserByEmail, findUserById } = require('../models/userModel');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    const existing = await findUserByEmail(String(email).toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await createUser({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash
    });

    const token = signToken(user);
    return res.status(201).json({ user, token });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Failed to sign up' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const userRow = await findUserByEmail(String(email).toLowerCase());
    if (!userRow) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(String(password), userRow.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role
    };

    const token = signToken(user);
    return res.json({ user, token });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Failed to log in' });
  }
});

router.get('/users/:id', protect, async (req, res) => {
  try {
    const requestedId = Number(req.params.id);
    if (!Number.isFinite(requestedId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const isSelf = Number(req.user?.id) === requestedId;
    const isAdmin = req.user?.role === 'admin';
    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await findUserById(requestedId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await findUserById(Number(req.user?.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Me error:', error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;

