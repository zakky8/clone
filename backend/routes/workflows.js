const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// In-memory workflow store
const workflows = [
  {
    id: 'wf_1',
    userId: 'user_1',
    name: 'product_shoot_v2',
    description: 'Automated product photography pipeline',
    nodes: [
      { id: 'n1', type: 'upload',  x: 120, y: 120, title: 'Image Upload' },
      { id: 'n2', type: 'flux',    x: 340, y: 90,  title: 'Flux Generate' },
      { id: 'n3', type: 'upscale', x: 560, y: 220, title: '4K Upscale' },
      { id: 'n4', type: 'export',  x: 780, y: 160, title: 'Export' },
    ],
    connections: [
      { from: 'n1', fromPort: 'image', to: 'n2', toPort: 'image' },
      { from: 'n2', fromPort: 'image', to: 'n3', toPort: 'image' },
      { from: 'n3', fromPort: 'image', to: 'n4', toPort: 'image' },
    ],
    runs: 14,
    lastRunAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: new Date().toISOString(),
    thumbnail: null,
  },
  {
    id: 'wf_2',
    userId: 'user_1',
    name: 'social_content_pack',
    description: 'Generate social media image variations',
    nodes: [
      { id: 'n1', type: 'upload',     x: 80,  y: 100, title: 'Image Upload' },
      { id: 'n2', type: 'remove-bg',  x: 280, y: 100, title: 'Remove BG' },
      { id: 'n3', type: 'sdxl',       x: 480, y: 100, title: 'SDXL' },
      { id: 'n4', type: 'preview',    x: 680, y: 100, title: 'Preview' },
    ],
    connections: [
      { from: 'n1', fromPort: 'image', to: 'n2', toPort: 'image' },
      { from: 'n2', fromPort: 'image', to: 'n3', toPort: 'image' },
      { from: 'n3', fromPort: 'image', to: 'n4', toPort: 'image' },
    ],
    runs: 6,
    lastRunAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-11-10T14:00:00Z',
    updatedAt: new Date().toISOString(),
    thumbnail: null,
  },
];

/**
 * GET /api/workflows
 * Get all workflows for authenticated user
 */
router.get('/', authenticate, (req, res) => {
  const userWorkflows = workflows.filter(w => w.userId === req.user.id);
  res.json({
    total: userWorkflows.length,
    workflows: userWorkflows.map(w => ({
      id: w.id,
      name: w.name,
      description: w.description,
      nodeCount: w.nodes.length,
      runs: w.runs,
      lastRunAt: w.lastRunAt,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    })),
  });
});

/**
 * GET /api/workflows/:id
 * Get a single workflow
 */
router.get('/:id', authenticate, (req, res) => {
  const workflow = workflows.find(w => w.id === req.params.id && w.userId === req.user.id);
  if (!workflow) return res.status(404).json({ error: 'Workflow not found.' });
  res.json(workflow);
});

/**
 * POST /api/workflows
 * Create a new workflow
 */
router.post('/', authenticate, (req, res) => {
  const { name, description, nodes = [], connections = [] } = req.body;

  if (!name) return res.status(400).json({ error: 'Workflow name is required.' });

  const workflow = {
    id: `wf_${Date.now()}`,
    userId: req.user.id,
    name,
    description: description || '',
    nodes,
    connections,
    runs: 0,
    lastRunAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    thumbnail: null,
  };

  workflows.push(workflow);
  res.status(201).json(workflow);
});

/**
 * PUT /api/workflows/:id
 * Update a workflow
 */
router.put('/:id', authenticate, (req, res) => {
  const idx = workflows.findIndex(w => w.id === req.params.id && w.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Workflow not found.' });

  workflows[idx] = {
    ...workflows[idx],
    ...req.body,
    id: workflows[idx].id,
    userId: workflows[idx].userId,
    updatedAt: new Date().toISOString(),
  };

  res.json(workflows[idx]);
});

/**
 * DELETE /api/workflows/:id
 * Delete a workflow
 */
router.delete('/:id', authenticate, (req, res) => {
  const idx = workflows.findIndex(w => w.id === req.params.id && w.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Workflow not found.' });

  workflows.splice(idx, 1);
  res.json({ message: 'Workflow deleted successfully.' });
});

/**
 * POST /api/workflows/:id/run
 * Execute a workflow (mock simulation)
 */
router.post('/:id/run', authenticate, (req, res) => {
  const workflow = workflows.find(w => w.id === req.params.id && w.userId === req.user.id);
  if (!workflow) return res.status(404).json({ error: 'Workflow not found.' });

  const runId = `run_${Date.now()}`;

  // Simulate run steps
  const steps = workflow.nodes.map((node, i) => ({
    nodeId: node.id,
    nodeTitle: node.title,
    status: 'completed',
    durationMs: Math.floor(Math.random() * 3000) + 500,
    output: { type: 'image', url: `https://picsum.photos/seed/${runId}_${i}/800/600` },
  }));

  workflow.runs += 1;
  workflow.lastRunAt = new Date().toISOString();

  res.json({
    runId,
    workflowId: workflow.id,
    status: 'completed',
    steps,
    outputs: steps.filter(s => s.output).map(s => s.output),
    creditsUsed: workflow.nodes.length * 2,
    durationMs: steps.reduce((acc, s) => acc + s.durationMs, 0),
    completedAt: new Date().toISOString(),
  });
});

/**
 * GET /api/workflows/templates/list
 * Get workflow templates
 */
router.get('/templates/list', (req, res) => {
  res.json({
    templates: [
      {
        id: 'tpl_product',
        name: 'Product Photography',
        description: 'Upload → Flux → 4K Upscale → Remove BG → Export',
        nodeCount: 5,
        category: 'E-commerce',
        uses: 4820,
      },
      {
        id: 'tpl_social',
        name: 'Social Media Pack',
        description: 'Single image → 10 platform-optimized variations',
        nodeCount: 4,
        category: 'Marketing',
        uses: 3210,
      },
      {
        id: 'tpl_video',
        name: 'Promo Video Creator',
        description: 'Images → Kling AI → Video → Export',
        nodeCount: 4,
        category: 'Video',
        uses: 2150,
      },
      {
        id: 'tpl_headshot',
        name: 'Professional Headshots',
        description: 'Portrait photo → AI enhance → Background → 4K',
        nodeCount: 6,
        category: 'Portrait',
        uses: 1890,
      },
    ],
  });
});

module.exports = router;
