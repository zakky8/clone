# Draftly Clone — Visual AI Studio

A full-stack clone of [draftly.space](https://www.draftly.space) — a node-based Visual AI Studio for creating professional content with AI models.

## 📁 Project Structure

```
draftly-clone/
├── frontend/
│   ├── index.html       # Landing page (hero, features, pricing, testimonials)
│   └── studio.html      # Node-based workflow canvas (drag & drop AI studio)
│
├── backend/
│   ├── server.js        # Express app entry point
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js      # JWT authentication middleware
│   └── routes/
│       ├── auth.js      # Register, login, logout, /me
│       ├── workflows.js # CRUD + run workflows
│       ├── images.js    # Generate, upscale, remove-bg
│       ├── users.js     # Profile, credits, usage, settings
│       └── models.js    # AI model catalog
│
└── README.md
```

## 🚀 Getting Started

### Frontend (static)

Open `frontend/index.html` directly in a browser — no build step needed.

### Backend (Node.js/Express)

```bash
cd backend
npm install
npm run dev       # development (nodemon)
# or
npm start         # production
```

Server runs at: `http://localhost:3001`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/workflows` | List workflows |
| POST | `/api/workflows` | Create workflow |
| PUT | `/api/workflows/:id` | Update workflow |
| DELETE | `/api/workflows/:id` | Delete workflow |
| POST | `/api/workflows/:id/run` | Execute workflow |
| GET | `/api/workflows/templates/list` | Workflow templates |
| POST | `/api/images/generate` | Generate images |
| POST | `/api/images/upscale` | 4K upscale |
| POST | `/api/images/remove-background` | Remove BG |
| GET | `/api/images` | Image gallery |
| GET | `/api/users/profile` | User profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/credits` | Credit balance |
| GET | `/api/users/usage` | Usage stats |
| GET | `/api/models` | AI model catalog |
| GET | `/api/models/:id` | Model details |

## 🔐 Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

**Demo credentials:**
- Email: `demo@draftly.space`
- Password: `demo1234`

## 🎨 Features Cloned

- ✅ Dark-themed landing page with animated hero
- ✅ Node-based canvas workflow builder (drag & drop)
- ✅ AI model node library (Flux, SDXL, Kling, etc.)
- ✅ Live SVG connection rendering
- ✅ Run simulation with step-by-step progress
- ✅ Properties panel, output panel, history panel
- ✅ Execution log
- ✅ Zoom + minimap controls
- ✅ REST API for all core features
- ✅ JWT authentication
- ✅ Workflow CRUD + execution
- ✅ Image generation / upscaling / background removal

## 📝 Notes

> This is a **mock/demo clone** built for educational/workshop purposes. The AI generation endpoints return placeholder images from picsum.photos. To connect real AI models, replace the mock logic in `backend/routes/images.js` with actual API calls (Replicate, OpenAI, etc.).

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no framework)
- **Backend**: Node.js + Express
- **Auth**: JWT (jsonwebtoken)
- **AI Models**: Mock (placeholders) — replace with Replicate / OpenAI APIs
