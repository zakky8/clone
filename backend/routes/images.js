const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Mock image store
const generatedImages = [];

/**
 * POST /api/images/generate
 * Generate image(s) from a prompt using mock AI
 */
router.post('/generate', authenticate, async (req, res) => {
  const { prompt, model = 'flux-dev', count = 1, width = 1024, height = 1024 } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });

  const validModels = ['flux-dev', 'flux-schnell', 'flux-pro', 'sdxl', 'dalle-3'];
  if (!validModels.includes(model)) {
    return res.status(400).json({ error: `Invalid model. Choose from: ${validModels.join(', ')}` });
  }

  // Simulate generation delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const images = Array.from({ length: Math.min(count, 10) }, (_, i) => {
    const id = `img_${Date.now()}_${i}`;
    const seed = Math.floor(Math.random() * 9999);
    const img = {
      id,
      url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      thumbnail: `https://picsum.photos/seed/${seed}/400/400`,
      prompt,
      model,
      width,
      height,
      seed,
      createdAt: new Date().toISOString(),
      userId: req.user.id,
    };
    generatedImages.push(img);
    return img;
  });

  res.json({
    success: true,
    model,
    prompt,
    count: images.length,
    images,
    creditsUsed: images.length * 2,
  });
});

/**
 * POST /api/images/upscale
 * Upscale an image to 4K
 */
router.post('/upscale', authenticate, async (req, res) => {
  const { imageUrl, scale = 4 } = req.body;

  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required.' });

  await new Promise(resolve => setTimeout(resolve, 300));

  const seed = Math.floor(Math.random() * 9999);
  const originalW = 1024;
  const originalH = 1024;
  const newW = originalW * scale;
  const newH = originalH * scale;

  res.json({
    success: true,
    original: { url: imageUrl, width: originalW, height: originalH },
    upscaled: {
      id: `upscaled_${Date.now()}`,
      url: `https://picsum.photos/seed/${seed}/${newW}/${newH}`,
      width: newW,
      height: newH,
      scale,
    },
    creditsUsed: 3,
  });
});

/**
 * POST /api/images/remove-background
 * Remove background from image
 */
router.post('/remove-background', authenticate, async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required.' });

  await new Promise(resolve => setTimeout(resolve, 400));

  const seed = Math.floor(Math.random() * 9999);

  res.json({
    success: true,
    original: { url: imageUrl },
    result: {
      id: `nobg_${Date.now()}`,
      url: `https://picsum.photos/seed/${seed}/1024/1024`,
      format: 'png',
      hasTransparency: true,
    },
    creditsUsed: 2,
  });
});

/**
 * GET /api/images
 * Get user's generated images
 */
router.get('/', authenticate, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const userImages = generatedImages.filter(img => img.userId === req.user.id);
  const start = (page - 1) * limit;
  const paginated = userImages.slice(start, start + limit);

  res.json({
    total: userImages.length,
    page,
    limit,
    images: paginated,
  });
});

/**
 * DELETE /api/images/:id
 * Delete a generated image
 */
router.delete('/:id', authenticate, (req, res) => {
  const idx = generatedImages.findIndex(img => img.id === req.params.id && img.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Image not found.' });

  generatedImages.splice(idx, 1);
  res.json({ message: 'Image deleted successfully.' });
});

module.exports = router;
