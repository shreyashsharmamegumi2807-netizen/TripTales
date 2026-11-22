import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import plannerRouter from './routes/planner.js';
import budgetRouter from './routes/budget.js';
import weatherRouter from './routes/weather.js';
import hiddenGemsRouter from './routes/hiddenGems.js';
import { createAccountRouter } from './routes/account.js';

dotenv.config();

const app = express();

app.use('/api/account', createAccountRouter());
app.use(cors());
app.use(express.json());

app.use('/api/planner', plannerRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/hidden-gems', hiddenGemsRouter);

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

export default app;
