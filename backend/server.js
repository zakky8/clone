const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const workflowRoutes = require('./routes/workflows');
const imageRoutes = require('./routes/images');
const userRoutes = require('./routes/users');
const modelsRoutes = require('./routes/models');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ─────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── ROUTES ─────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/images',    imageRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/models',    modelsRoutes);

// ─── HEALTH CHECK ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// ─── API INFO ────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'Draftly API',
    version: '1.0.0',
    description: 'Visual AI Studio Backend',
    endpoints: {
      auth:      '/api/auth',
      workflows: '/api/workflows',
      images:    '/api/images',
      users:     '/api/users',
      models:    '/api/models',
    },
  });
});

// ─── CATCH-ALL (SPA) ────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── ERROR HANDLER ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── START ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Draftly API running at http://localhost:${PORT}`);
  console.log(`📡 API docs at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
