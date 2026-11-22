import express from 'express';
import { calculateDeterministicBudget } from '../services/budgetCalculator.js';

const router = express.Router();

// POST /api/budget/calculate
router.post('/calculate', (req, res) => {
  try {
    const {
      travellers,
      days,
      travelStyle,
      userBudget,
      transportationTotal,
      accommodationPerNight,
      foodPerDayPerPerson,
      activitiesPerDayPerPerson,
      localTransportPerDayTotal,
      otherExpensesTotal,
      rooms,
    } = req.body;

    const calculation = calculateDeterministicBudget({
      travellers,
      days,
      travelStyle,
      userBudget,
      transportationTotal,
      accommodationPerNight,
      foodPerDayPerPerson,
      activitiesPerDayPerPerson,
      localTransportPerDayTotal,
      otherExpensesTotal,
      rooms,
    });

    return res.json({
      success: true,
      data: calculation
    });
  } catch (error) {
    console.error('Budget calculation error:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to compute budget calculation: ' + error.message
    });
  }
});

export default router;
