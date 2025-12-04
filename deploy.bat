@echo off
echo ========================================
echo   SpiritBoard AI - Deployment Helper
echo ========================================
echo.

echo Step 1: Install Vercel CLI (if not installed)
echo Run: npm install -g vercel
echo.
pause

echo Step 2: Deploy Backend
echo.
cd backend
echo Deploying backend to Vercel...
call vercel --prod
cd ..
echo.
echo Backend deployed! Copy the URL shown above.
echo.
pause

echo Step 3: Update Frontend API URL
echo.
echo IMPORTANT: Open frontend/src/App.jsx
echo Find: http://localhost:3000
echo Replace with: YOUR_BACKEND_URL (from step 2)
echo.
pause

echo Step 4: Deploy Frontend
echo.
cd frontend
echo Deploying frontend to Vercel...
call vercel --prod
cd ..
echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your SpiritBoard AI is now LIVE!
echo.
pause
