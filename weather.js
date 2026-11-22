import express from 'express';
import { fetchRealWeather } from '../services/weatherService.js';

const router = express.Router();

// GET /api/weather?destination=Jaipur
router.get('/', async (req, res) => {
  const { destination } = req.query;

  if (!destination || !destination.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter "destination" is required.'
    });
  }

  try {
    const weather = await fetchRealWeather(destination.trim());
    return res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    console.error(`Weather lookup error for "${destination}":`, error.message);
    return res.status(404).json({
      success: false,
      message: error.message || 'Unable to retrieve real weather information for this location.'
    });
  }
});

export default router;
