⸻

🎮 AI Story Creator

AI-powered pixel art character generator with story creation.

---

## 📅 Progress Update - November 23, 2025

### ✅ Completed Today (Backend + Frontend Integration + Testing)

#### 🧠 Backend (Python Flask) — First Working Version Completed

**New Features:**

- ✅ Full Flask backend created (`/backend`)
- ✅ CORS enabled for frontend connection
- ✅ Stable Diffusion 3 API integration
- ✅ Multi-image generation
  - 1 image → front
  - 4 images → front/back/left/right
  - 8 images → +4 diagonal directions
- ✅ AI story generation placeholder added
- ✅ Returns:
  - Base64 image array
  - Story string
- ✅ Error handling for missing credits / invalid request

**API Endpoint:**

```
POST /api/characters/generate
```

**Backend Output Example:**

```json
{
  "images": ["data:image/jpeg;base64, ..."],
  "story": "Astra is a Mage characterized by Calm..."
}
```

---

#### ⚛️ Frontend Integration Completed

**Changes:**

- Connected CreateResultPage → real backend
- Replaced mock data with live API responses
- Loader animation works during generation
- ImageGrid now displays generated frames
- ImageCard uses real base64 images (with hover overlay)

---

#### 🖼️ ImageGrid Improvements

- Better responsive layout:
  - 1–4 images → 2 columns
  - 8 images → 3 columns
- Images now use `object-contain`
- Prevents cropping and matches pixel-art style

---

#### 🧪 Added Full Frontend Test Suite

New tests added under `src/tests/`:

| File                      | Description                                 |
| ------------------------- | ------------------------------------------- |
| `test_api.js`             | Basic backend connectivity                  |
| `test_generate_images.js` | Tests 1/4/8 image generation result         |
| `test_character_form.jsx` | Form input + dropdown + loading + submit    |
| `test_create_result.jsx`  | Loader → result state transition            |
| `test_image_grid.jsx`     | Grid layout and image count test            |
| `test_image_card.jsx`     | Hover overlay + button + image rendering    |
| `test_api_mock.js`        | Mock API without hitting backend (optional) |
| `test_navbar.jsx`         | Navbar active link tests (待写)             |

All API tests now pass once credits are active.

---

#### 🛠️ Completed Frontend (From Previous Update)

**Project Setup:**

- React 18 + Vite + Tailwind CSS v3
- Cyberpunk color scheme (neon pink, cyan, purple)
- React Router 6 navigation
- Project structure complete

**Pages:**

- HomePage
- CreateResultPage (now fully integrated with backend)
- GalleryPage (placeholder)
- ProfilePage (placeholder)

**Components:**

- Navbar
- Home (Hero, Features, Showcase, Footer)
- Form (CharacterForm, FormInput, FormTextarea, GenerateButton)
- Result (ImageGrid, ImageCard, StoryDisplay, ActionButtons, GeneratingLoader)

---

## 🏗️ Project Structure

```
AI-Story-Creator/
├── frontend/                    # Frontend
│   ├── src/
│   │   ├── pages/              # 4 main pages
│   │   ├── components/         # Organized by feature
│   │   │   ├── home/           # ✅ Complete
│   │   │   ├── create/         # ✅ Complete
│   │   │   ├── result/         # ✅ Complete
│   │   │   ├── gallery/        # 🔜 TODO
│   │   │   ├── profile/        # 🔜 TODO
│   │   │   └── common/         # ✅ Navbar done
│   │   ├── services/           # 🔜 Developing (API integration)
│   │   ├── context/            # 🔜 TODO (Auth)
│   │   └── hooks/              # 🔜 TODO
│   └── package.json
│
└── backend/                     # Backend
    ├── server.py
    ├── stable_diffusion_api.py
    └── (future structure)
        ├── models/             # 🔜 Developing
        ├── controllers/        # 🔜 Developing
        ├── routes/             # 🔜 Developing
        ├── services/           # ✅ Complete (AI integration)
        └── middleware/         # 🔜 Developing
```

---

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on → http://localhost:5173

---

### Backend (Python Flask)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install flask requests python-dotenv
python server.py
```

Runs on → http://localhost:5000

---

## 🎨 Design Theme

**Cyberpunk / Neon:**

- Dark bg: `#0a0e27`, `#1a1a2e`
- Pink: `#ff006e`
- Cyan: `#00d9ff`
- Purple: `#bd00ff`

Includes grid backgrounds + glow effects.

---

## 👥 Team Division

### Frontend (Xuanyou)

**Completed:**

- All pages & layouts
- All UI components
- Tailwind cyberpunk design
- Connected to backend
- ImageGrid & Create page refinement
- Full test suite

**Next:**

- Gallery page
- Profile page
- ZIP download
- Save to gallery API

---

### Backend (Juran)

**Completed:**

- Flask backend
- Stable Diffusion integration
- Multi-image generation
- Error handling

**Next:**

- Switching from mock story to GPT-4
- Character saving
- ZIP generator
- User profiles
- Auth (JWT / OAuth optional)
- Gallery endpoints

---

## 📡 API Contract (Updated Today)

**POST** `/api/characters/generate`

**Request:**

```json
{
  "name": "string",
  "characterClass": "string",
  "personality": "string",
  "appearance": "string",
  "specialFeatures": "string",
  "imageCount": 1 | 4 | 8
}
```

**Response:**

```json
{
  "images": ["data:image/jpeg;base64,..."],
  "story": "string"
}
```

---

## 🗄️ Data Models (Planned)

### User

- `username`
- `email`
- `password`
- `createdAt`

### Character

- `input`: { name, class, traits, appearance, ... }
- `generated`: { images[], story }
- `createdAt`

---

## 🔧 Environment Variables

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

### Backend `.env`

```env
SDF_KEY=your_stability_ai_key
PORT=5000
```

---

## 📝 Next Steps

1. Gallery system
2. Save to backend
3. Download ZIP feature
4. Add GPT-4 for story generation
5. Add Navbar tests
6. Improve UI scaling on Create page

---

## 🔗 Useful Links

- Frontend → http://localhost:5173
- Backend → http://localhost:5000
- GitHub → https://github.com/JuranHuang4399/AI-Story-Creator
