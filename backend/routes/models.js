const express = require('express');
const router = express.Router();

const AI_MODELS = [
  {
    id: 'flux-dev',
    name: 'Flux Dev',
    provider: 'Black Forest Labs',
    category: 'image',
    type: 'generation',
    creditsPerRun: 2,
    speed: 'medium',
    quality: 'high',
    description: 'High-quality open-weights text-to-image model. Best for detailed, realistic outputs.',
    maxResolution: '2048x2048',
    available: true,
    featured: true,
  },
  {
    id: 'flux-schnell',
    name: 'Flux Schnell',
    provider: 'Black Forest Labs',
    category: 'image',
    type: 'generation',
    creditsPerRun: 1,
    speed: 'fast',
    quality: 'medium',
    description: 'Fast version of Flux. Great for rapid iteration and prototyping.',
    maxResolution: '1024x1024',
    available: true,
    featured: false,
  },
  {
    id: 'flux-pro',
    name: 'Flux Pro',
    provider: 'Black Forest Labs',
    category: 'image',
    type: 'generation',
    creditsPerRun: 5,
    speed: 'slow',
    quality: 'ultra',
    description: 'Professional-grade model with the highest image quality and prompt adherence.',
    maxResolution: '4096x4096',
    available: true,
    featured: true,
  },
  {
    id: 'sdxl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    category: 'image',
    type: 'generation',
    creditsPerRun: 2,
    speed: 'medium',
    quality: 'high',
    description: 'Industry-standard open-source model with vast LoRA ecosystem support.',
    maxResolution: '1536x1536',
    available: true,
    featured: false,
  },
  {
    id: 'dalle-3',
    name: 'DALL·E 3',
    provider: 'OpenAI',
    category: 'image',
    type: 'generation',
    creditsPerRun: 4,
    speed: 'medium',
    quality: 'high',
    description: 'Excellent prompt understanding and coherent text rendering in images.',
    maxResolution: '1792x1024',
    available: true,
    featured: false,
  },
  {
    id: 'kling-v1',
    name: 'Kling AI v1',
    provider: 'Kling',
    category: 'video',
    type: 'image-to-video',
    creditsPerRun: 10,
    speed: 'slow',
    quality: 'high',
    description: 'State-of-the-art image-to-video model with realistic motion and physics.',
    maxDuration: '10s',
    available: true,
    featured: true,
  },
  {
    id: 'stable-video',
    name: 'Stable Video Diffusion',
    provider: 'Stability AI',
    category: 'video',
    type: 'image-to-video',
    creditsPerRun: 8,
    speed: 'slow',
    quality: 'medium',
    description: 'Open-source video generation from a single still image.',
    maxDuration: '4s',
    available: true,
    featured: false,
  },
  {
    id: 'real-esrgan',
    name: 'Real-ESRGAN 4x',
    provider: 'Xinntao',
    category: 'image',
    type: 'upscale',
    creditsPerRun: 3,
    speed: 'fast',
    quality: 'ultra',
    description: 'Best-in-class 4K upscaling with noise removal and detail enhancement.',
    maxScale: 8,
    available: true,
    featured: true,
  },
  {
    id: 'rembg',
    name: 'RemBG Pro',
    provider: 'Draftly',
    category: 'image',
    type: 'background-removal',
    creditsPerRun: 2,
    speed: 'fast',
    quality: 'high',
    description: 'Pixel-perfect background removal optimized for products, people, and objects.',
    available: true,
    featured: false,
  },
];

/**
 * GET /api/models
 * List all available AI models
 */
router.get('/', (req, res) => {
  const { category, type, featured } = req.query;

  let filtered = [...AI_MODELS];

  if (category) filtered = filtered.filter(m => m.category === category);
  if (type) filtered = filtered.filter(m => m.type === type);
  if (featured === 'true') filtered = filtered.filter(m => m.featured);

  res.json({
    total: filtered.length,
    models: filtered,
  });
});

/**
 * GET /api/models/:id
 * Get a specific model's details
 */
router.get('/:id', (req, res) => {
  const model = AI_MODELS.find(m => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: 'Model not found.' });
  res.json(model);
});

/**
 * GET /api/models/categories/list
 */
router.get('/categories/list', (req, res) => {
  const categories = [...new Set(AI_MODELS.map(m => m.category))];
  res.json({ categories });
});

module.exports = router;
