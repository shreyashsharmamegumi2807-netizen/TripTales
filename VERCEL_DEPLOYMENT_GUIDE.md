# TripTales — Vercel 1-Click Deployment Guide

This project is now fully unified and configured for seamless deployment on **Vercel** in **one single folder**. Both the **frontend (React + Vite)** and the **backend APIs (Express Serverless)** deploy together automatically.

---

## Why Deployment Failed Previously (And How It's Fixed)

1. **Missing `vercel.json`**: Vercel did not know how to route API calls or handle client-side page refreshes.  
   ✅ **Fixed**: Created [vercel.json](file:///c:/Users/lanovo/OneDrive/Documents/Desktop/prompt%20ppj/vercel.json) with SPA rewrites and serverless function routing.
2. **Missing `api/` Serverless Function**: Vercel does not run persistent `node server/index.js` servers; it runs serverless functions from the `api/` folder.  
   ✅ **Fixed**: Created [api/index.js](file:///c:/Users/lanovo/OneDrive/Documents/Desktop/prompt%20ppj/api/index.js) exporting the unified Express app as a Vercel Serverless Function.
3. **Smart Client Fallback**:  
   ✅ **Fixed**: Added resilient fallback in `src/lib/api.ts` so even if serverless functions experience network timeouts, all 10 travel categories, budget calculations, and hidden gems continue to work client-side.

---

## Option 1: Deploy via GitHub (Recommended)

1. **Push this folder to a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "TripTales fullstack release for Vercel"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository.
   - Vercel will automatically detect the settings:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `./` (Leave as root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables (Optional)**:
   In Vercel's **Environment Variables** section, you can add:
   - `ZAPIER_API_KEY`: `8399ed4bd3a2a8dca7c15fe93327d3c7`
   - `ZAPIER_CHATBOT_ID`: `cmwrh53ht0051amfak27vp6do`

4. Click **Deploy**!
   Your website will be live at `https://your-project.vercel.app` in under 1 minute.

---

## Option 2: Deploy using Vercel CLI (Direct from Terminal)

If you have Node.js installed, you can deploy directly from this folder:

```powershell
# In this project folder:
npx vercel
```

- When asked `Set up and deploy?`, press **Y**.
- Accept the default project settings by pressing **Enter**.
- To deploy to production:
```powershell
npx vercel --prod
```

---

## Project Structure (All Files in One Folder)

```
prompt ppj/
├── api/                    # Vercel Serverless Functions
│   └── index.js            # Express app handler for /api/*
├── dist/                   # Production build output
├── server/                 # Express backend services & routes
│   ├── index.js            # Local server runner
│   ├── routes/             # Planner, Budget, Weather, Hidden Gems
│   └── services/           # Itinerary engine, Budget calculator
├── src/                    # React frontend application
│   ├── components/         # Navbar, Footer, AuthModal
│   ├── pages/              # Home, Planner, Budget, Gems, Login, etc.
│   └── lib/                # API client with automatic serverless fallback
├── vercel.json             # Vercel routing configuration
├── package.json            # Unified dependencies & build scripts
├── vite.config.ts          # Vite configuration
└── index.html              # Main HTML entry with Zapier chatbot embed
```
