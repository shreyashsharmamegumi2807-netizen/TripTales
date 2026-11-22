import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const PORT = process.env.PORT || 5000;

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
