import express from 'express';
import { buildDynamicItinerary } from '../services/itineraryEngine.js';
import { calculateDeterministicBudget } from '../services/budgetCalculator.js';
import { triggerZapierTravelWorkflow } from '../services/zapierService.js';

const router = express.Router();

// POST /api/planner/generate
router.post('/generate', async (req, res) => {
  try {
    const {
      startingLocation,
      destination,
      travellers,
      days,
      budget,
      travelDate,
      tripType,
      preferences
    } = req.body;

    // 1. Validate required inputs
    if (!destination || !destination.trim()) {
      return res.status(400).json({ success: false, message: 'Destination is required.' });
    }
    if (!startingLocation || !startingLocation.trim()) {
      return res.status(400).json({ success: false, message: 'Starting location is required.' });
    }

    const numTravellers = Math.max(1, parseInt(travellers) || 1);
    const numDays = Math.min(30, Math.max(1, parseInt(days) || 3));
    const totalBudgetInput = budget ? Math.max(0, Number(budget)) : null;
    const selectedType = tripType || 'Family Trip';

    // 2. Generate specialized, structured day-by-day itinerary
    const generatedItinerary = buildDynamicItinerary({
      startingLocation: startingLocation.trim(),
      destination: destination.trim(),
      travellers: numTravellers,
      days: numDays,
      budget: totalBudgetInput,
      travelDate: travelDate || undefined,
      tripType: selectedType,
      preferences: preferences?.trim() || undefined
    });

    // 3. Compute deterministic affordable budget breakdown
    const budgetCalculation = calculateDeterministicBudget({
      travellers: numTravellers,
      days: numDays,
      userBudget: totalBudgetInput,
      travelStyle: totalBudgetInput && (totalBudgetInput / (numTravellers * numDays) < 1800) ? 'budget' : 'moderate'
    });

    // 4. Trigger Zapier travel workflow asynchronously if configured
    triggerZapierTravelWorkflow({
      startingLocation,
      destination,
      travellers: numTravellers,
      days: numDays,
      budget: totalBudgetInput,
      tripType: selectedType,
      tripTitle: generatedItinerary.tripTitle,
      itineraryDaysCount: generatedItinerary.days.length
    }).catch(err => console.warn('Zapier background trigger error:', err.message));

    return res.json({
      success: true,
      data: {
        inputs: {
          startingLocation,
          destination,
          travellers: numTravellers,
          days: numDays,
          budget: totalBudgetInput,
          travelDate,
          tripType: selectedType,
          preferences
        },
        itinerary: generatedItinerary,
        budgetBreakdown: budgetCalculation
      }
    });

  } catch (error) {
    console.error('Planner generation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate itinerary. Please verify your inputs.'
    });
  }
});

export default router;
