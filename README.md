# 🕯️ SpiritBoard AI - FULL HORROR EXPERIENCE 💀

An AI-powered Ouija-style interactive HORROR game web app with intense scary features!

## 🎃 Horror Features

### 👻 Ghost Mood System
- **NORMAL**: Calm spirits, mysterious responses
- **IRRITATED**: Aggressive behavior, screen effects
- **ANGRY**: FULL HORROR MODE - screaming, blood, fog, ghost apparitions!

### 🕯️ Life System (3 Candles)
- Start with 3 candles (lives)
- Lose candles randomly as you ask questions
- Each candle lost triggers scarier effects
- When all candles burn out... GAME OVER

### 💀 Scary Effects
- **Blood dripping** from top of screen
- **Fog effects** that roll across the screen
- **Screen shaking** and flickering
- **Ghost apparitions** that suddenly appear
- **Warning popups** with scary messages
- **Planchette cursor** moving across the board
- **Letters lighting up** one by one as spirit responds
- **Horror sounds** (screams, crying, ambient)

### 🩸 Game Over Experience
- Reveals the ghost's name on a rusty, blood-stained board
- Names like "BLOODY MARY", "THE WEEPING WIDOW", "SHADOW DEMON"
- Option to summon a new spirit and restart

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Google Gemini API

## 🚀 Deployment

Want to deploy your SpiritBoard AI? Check out **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete deployment instructions!

**Quick Deploy:**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `deploy.bat` (Windows) and follow the steps
3. Or manually deploy to Vercel, Netlify, or Render (see DEPLOYMENT.md)

## Setup

✅ **Already Configured!** Both backend and frontend are set up and running.

### Quick Start
Just double-click `start.bat` to launch both servers!

Or manually:

**Backend:**
```
cd backend
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

**Frontend:**
```
cd frontend
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### Important: Add Your Gemini API Key
1. Get your free API key from: https://makersuite.google.com/app/apikey
2. Edit `backend/.env` and replace `your_gemini_api_key_here` with your actual Gemini API key.

### Access the App
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Route

### POST /ask-spirit
Request:
```json
{
  "question": "What does the future hold?",
  "persona": "mysterious"
}
```

Response:
```json
{
  "answer": "The shadows whisper of change... but beware the path you choose..."
}
```

## Note
⚠️ This is for entertainment purposes only. All responses are fictional.
