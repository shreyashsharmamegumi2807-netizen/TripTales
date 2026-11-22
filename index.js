import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import plannerRouter from './routes/planner.js';
import budgetRouter from './routes/budget.js';
import weatherRouter from './routes/weather.js';
import hiddenGemsRouter from './routes/hiddenGems.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/planner', plannerRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/hidden-gems', hiddenGemsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasZapierKey = Boolean(process.env.ZAPIER_API_KEY && process.env.ZAPIER_API_KEY !== 'your_zapier_api_key_here');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      zapierConfigured: hasZapierKey,
      itineraryEngine: 'dynamic-active',
      budgetEngine: 'affordable-make-my-trip-active',
      weatherAvailable: true,
      hiddenGemsCommunityActive: true
    }
  });
});

// Serve frontend static files if dist folder exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Client-side routing fallback to index.html for non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}

// Start Express Server
app.listen(PORT, () => {
  console.log(` TripTales Server running on http://localhost:${PORT}`);
  console.log(` Web Application available at http://localhost:${PORT}`);
  console.log(` Zapier Integration status: ${process.env.ZAPIER_API_KEY ? 'Configured' : 'Ready'}`);
});
