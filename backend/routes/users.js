const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

const users = [
  {
    id: 'user_1',
    email: 'demo@draftly.space',
    name: 'Demo User',
    plan: 'pro',
    credits: 248,
    avatar: null,
    settings: {
      defaultModel: 'flux-dev',
      autoSave: true,
      emailNotifications: true,
      theme: 'dark',
    },
    usage: {
      imagesGenerated: 1240,
      videosGenerated: 38,
      workflowsRun: 156,
      creditsUsed: 3752,
    },
    createdAt: '2024-01-15T10:00:00Z',
  },
];

/**
 * GET /api/users/profile
 */
router.get('/profile', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

/**
 * PUT /api/users/profile
 */
router.put('/profile', authenticate, (req, res) => {
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found.' });

  const allowed = ['name', 'avatar'];
  const updates = {};
  allowed.forEach(key => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  users[idx] = { ...users[idx], ...updates };
  const { password, ...safeUser } = users[idx];
  res.json(safeUser);
});

/**
 * GET /api/users/credits
 */
router.get('/credits', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  res.json({
    remaining: user.credits,
    plan: user.plan,
    resetDate: new Date(new Date().setDate(1) + 30 * 24 * 60 * 60 * 1000).toISOString(),
    planLimits: {
      free: 50,
      pro: 1000,
      team: 5000,
    }[user.plan],
  });
});

/**
 * PUT /api/users/settings
 */
router.put('/settings', authenticate, (req, res) => {
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found.' });

  users[idx].settings = { ...users[idx].settings, ...req.body };
  res.json(users[idx].settings);
});

/**
 * GET /api/users/usage
 */
router.get('/usage', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  res.json({
    ...user.usage,
    period: 'all-time',
    dailyStats: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      images: Math.floor(Math.random() * 80),
      videos: Math.floor(Math.random() * 5),
    })).reverse(),
  });
});

module.exports = router;
