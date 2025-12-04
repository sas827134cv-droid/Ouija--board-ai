# 🕯️ SpiritBoard AI - Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free): https://vercel.com
- Your Gemini API key

## Option 1: Deploy to Vercel (Recommended - FREE)

### Step 1: Deploy Backend

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SpiritBoard AI"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy Backend on Vercel:**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `backend` folder as root directory
   - Add Environment Variable:
     - Name: `GEMINI_API_KEY`
     - Value: `AIzaSyB6ugZ9L0Wv75WETjOBS6i-VZGLzJSvSa8`
   - Click "Deploy"
   - Copy the deployment URL (e.g., `https://spiritboard-backend.vercel.app`)

### Step 2: Deploy Frontend

1. **Update Frontend API URL:**
   - Open `frontend/src/App.jsx`
   - Replace `http://localhost:3000` with your backend URL
   - Find all instances of `'http://localhost:3000/ask-spirit'`
   - Replace with `'https://YOUR-BACKEND-URL.vercel.app/ask-spirit'`

2. **Deploy Frontend on Vercel:**
   - Go to Vercel dashboard
   - Click "Add New" → "Project"
   - Import the same GitHub repository
   - Select the `frontend` folder as root directory
   - Framework Preset: Vite
   - Click "Deploy"
   - Your app will be live at `https://spiritboard-frontend.vercel.app`

## Option 2: Deploy to Netlify (Alternative - FREE)

### Backend (Use Vercel for backend)
Follow Step 1 above for backend deployment on Vercel.

### Frontend on Netlify:

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to https://netlify.com
   - Drag and drop the `frontend/dist` folder
   - Or connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

## Option 3: Deploy to Render (Full Stack - FREE)

### Backend:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add Environment Variable: `GEMINI_API_KEY`
8. Deploy

### Frontend:
1. New → Static Site
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Deploy

## Important: Update Frontend API URL

After deploying backend, update this line in `frontend/src/App.jsx`:

```javascript
// Change from:
const response = await fetch('http://localhost:3000/ask-spirit', {

// To:
const response = await fetch('https://YOUR-BACKEND-URL.vercel.app/ask-spirit', {
```

Do this for all fetch calls in the file.

## Quick Deploy Commands

```bash
# Backend
cd backend
vercel

# Frontend (after updating API URL)
cd frontend
vercel
```

## Environment Variables Needed

**Backend:**
- `GEMINI_API_KEY`: Your Gemini API key
- `PORT`: 3000 (optional, auto-set by hosting)

**Frontend:**
- No environment variables needed (API URL is hardcoded)

## Post-Deployment Checklist

✅ Backend is live and accessible
✅ Frontend is live
✅ Frontend can connect to backend (check browser console)
✅ Test asking a question
✅ Check all horror effects work
✅ Verify candles system works
✅ Test game over and restart

## Troubleshooting

**CORS Error:**
- Make sure backend has `cors()` enabled (already configured)

**API Not Responding:**
- Check backend logs on Vercel
- Verify Gemini API key is set correctly

**Frontend Can't Connect:**
- Verify you updated the API URL in frontend code
- Check browser console for errors

## Free Hosting Limits

**Vercel (Free):**
- 100 GB bandwidth/month
- Unlimited projects
- Perfect for this app!

**Netlify (Free):**
- 100 GB bandwidth/month
- 300 build minutes/month

**Render (Free):**
- 750 hours/month
- Sleeps after 15 min inactivity

## Your App URLs (After Deployment)

- Frontend: `https://spiritboard-ai.vercel.app`
- Backend: `https://spiritboard-backend.vercel.app`

🕯️ **Your SpiritBoard AI is now LIVE!** 👻
