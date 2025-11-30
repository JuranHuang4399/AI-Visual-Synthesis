## User Guide:

1. Create a .env file with your Stability API key
2. Run app.py

## Installation Reminder:
### Flask:
pip install flask
### Requests:
pip install requests
### Dotenv
pip install python-dotenv
### huggingface
pip install huggingface_hub

## For Developers:
Before you run the frontend, run Flask backend first:
cd AI-Story-Creator
python backend/server.py

Backend will run at:
http://localhost:5000

Frontend can call these two endpoints:
POST /generate_art
POST /generate_story

# 🎮 AI Story Creator

AI-powered pixel art character generator with story creation.

## 📅 Progress Update 

### ✅ Completed 

**Project Setup:**

- ✅ React 19 + Vite + Tailwind CSS v3
- ✅ Cyberpunk color scheme (neon pink, cyan, purple)
- ✅ React Router 6 navigation
- ✅ Project structure created

**Pages Built:**

- ✅ HomePage - Hero, Features, Showcase, Footer
- ✅ CreateResultPage - Form + Result display (split view)
- ✅ GalleryPage - Placeholder
- ✅ ProfilePage - Placeholder

**Components Built:**

- ✅ Navbar with active link highlighting
- ✅ Home components (Hero, Features, Showcase, Footer)
- ✅ Form components (CharacterForm, FormInput, FormTextarea, GenerateButton)
- ✅ Result components (ImageGrid, ImageCard, StoryDisplay, ActionButtons, GeneratingLoader)

**Status:** Frontend framework complete with mock data. Ready for API integration.

---

## 🏗️ Project Structure

```
AI-Story-Creator/
├── frontend/                    # Frontend 
│   ├── src/
│   │   ├── pages/              # 4 main pages
│   │   ├── components/         # Organized by feature
│   │   │   ├── home/          # ✅ Complete
│   │   │   ├── create/        # ✅ Complete
│   │   │   ├── result/        # ✅ Complete
│   │   │   ├── gallery/       # 🔜 TODO
│   │   │   ├── profile/       # 🔜 TODO
│   │   │   └── common/        # ✅ Navbar done
│   │   ├── services/          # 🔜 Developing (API integration)
│   │   ├── context/           # 🔜 TODO (Auth)
│   │   └── hooks/             # 🔜 TODO
│   └── package.json
│
└── backend/                    # Backend 
    ├── src/
    │   ├── models/            # 🔜 Developing
    │   ├── controllers/       # 🔜 Developing
    │   ├── routes/            # 🔜 Developing
    │   ├── services/          # 🔜 Developing (AI integration)
    │   └── middleware/        # 🔜 Developing
    └── package.json
```

---

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**Runs on:** http://localhost:5173

**Pages available:**

- `/` - Home page
- `/create` - Character creation (with mock data)
- `/gallery` - Gallery (placeholder)
- `/profile` - Profile (placeholder)

### Backend (To be implemented)

```bash
cd backend
npm install
npm run dev
```

**Will run on:** http://localhost:5000

---

## 🎨 Design Theme

**Cyberpunk / Neon Style**

- Dark backgrounds: `#0a0e27`, `#1a1a2e`
- Neon pink: `#ff006e`
- Neon cyan: `#00d9ff`
- Neon purple: `#bd00ff`
- Grid background pattern
- Glow effects on hover

---

## 👥 Team Division

### Frontend

**Completed:**

- Project setup and configuration
- All page layouts
- Home page components
- Create/Result page components
- Cyberpunk styling

**Next Steps:**

- Gallery page components
- Profile page components
- API service layer
- Authentication context
- Connect to backend APIs

### Backend

**To Do:**

- Setup Express server
- MongoDB models (User, Character)
- Authentication (JWT)
- Character generation endpoints
- AI integration (OpenAI + Replicate)
- Image storage/processing

---

## 📡 API Endpoints Needed

### Authentication(Google..)

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Characters(example)

```
POST /api/characters/generate
  Body: {
    name: string,
    characterClass: string,
    personality: string,
    appearance: string,
    specialFeatures: string,
    imageCount: number
  }
  Response: {
    id: string,
    name: string,
    images: [{url: string}],
    story: string
  }

GET  /api/characters          # Get user's characters
GET  /api/characters/:id      # Get specific character
GET  /api/characters/:id/download  # Download ZIP
DELETE /api/characters/:id    # Delete character
```

### Users

```
GET  /api/users/profile
PUT  /api/users/profile
```

---

## 🗄️ Data Models(example)

### User Model

```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Character Model(example)

```javascript
{
  userId: ObjectId (ref: User),
  input: {
    name: String,
    characterClass: String,
    personality: String,
    appearance: String,
    specialFeatures: String,
    imageCount: Number
  },
  generated: {
    images: [{
      url: String,
      index: Number
    }],
    story: String
  },
  status: String (generating/completed/failed),
  createdAt: Date
}
```

---

## 🔧 Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
```

### Backend (.env) - Developing

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-story-creator(Optional)
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_key
REPLICATE_API_KEY=your_replicate_key
FRONTEND_URL=http://localhost:5173
```

---

## 📝 Next Meeting Discussion

1. **API Contract** - Confirm request/response formats
2. **MongoDB Setup** - Local or Atlas?
3. **AI API Keys** - Who will create accounts?
4. **Timeline** - Week by week plan
5. **Testing Strategy** - How to test integration?

---

## 🔗 Useful Links

- Frontend: http://localhost:5173
- Backend: http://localhost:5000 (when ready)
- GitHub: https://github.com/JuranHuang4399/AI-Story-Creator

---

## 💡 Notes

- Frontend is using **mock data** for now
- Form submission works but calls fake API
- Need to replace mock data with real API calls
- Character images use placeholder images
- Download/Save buttons show alerts (not functional yet)

---

**Last Updated:** October 31, 2025  
**Frontend Status:** Framework almost complete, ready for API integration  
**Backend Status:** Developing

---