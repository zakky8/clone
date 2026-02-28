const express = require('express');
const router = express.Router();
const { generateToken, authenticate } = require('../middleware/auth');

// Mock user database
const users = [
  {
    id: 'user_1',
    email: 'demo@draftly.space',
    password: 'demo1234', // In production: bcrypt hash
    name: 'Demo User',
    plan: 'pro',
    credits: 248,
    avatar: null,
    createdAt: '2024-01-15T10:00:00Z',
  },
];

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required.' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already in use.' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    password, // In production: await bcrypt.hash(password, 10)
    name,
    plan: 'free',
    credits: 50,
    avatar: null,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  const token = generateToken({ id: newUser.id, email: newUser.email });

  res.status(201).json({
    message: 'Account created successfully.',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      plan: newUser.plan,
      credits: newUser.credits,
    },
  });
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken({ id: user.id, email: user.email });

  res.json({
    message: 'Logged in successfully.',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      credits: user.credits,
    },
  });
});

/**
 * POST /api/auth/logout
 * Logout (client-side token invalidation in this mock)
 */
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/me
 * Get current user from token
 */
router.get('/me', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    credits: user.credits,
    createdAt: user.createdAt,
  });
});

/**
 * POST /api/auth/refresh
 * Refresh token
 */
router.post('/refresh', authenticate, (req, res) => {
  const token = generateToken({ id: req.user.id, email: req.user.email });
  res.json({ token });
});

module.exports = router;
