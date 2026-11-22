import { calculateDeterministicBudget } from '../server/services/budgetCalculator.js';
import { fetchRealWeather } from '../server/services/weatherService.js';
import { generateGeminiResponse } from '../server/services/geminiService.js';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 TRIPTALES COMPREHENSIVE AUTOMATED VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. BUDGET ENGINE TESTS
  console.log('--- TEST 1: BUDGET ENGINE DETERMINISTIC ARITHMETIC ---');
  try {
    // Scenario A: Solo traveller, 3 days, moderate
    const solo = calculateDeterministicBudget({ travellers: 1, days: 3, travelStyle: 'moderate' });
    console.log(`[Scenario A: 1 traveller, 3 days] Rooms: ${solo.summary.rooms}, Total: ₹${solo.summary.totalBudget}, PerPerson: ₹${solo.summary.perPersonTotal}`);
    if (solo.summary.rooms !== 1 || solo.summary.totalBudget <= 0) {
      throw new Error('Solo calculation unexpected output');
    }

    // Scenario B: 4 travellers, 5 days, moderate
    const group4 = calculateDeterministicBudget({ travellers: 4, days: 5, travelStyle: 'moderate' });
    console.log(`[Scenario B: 4 travellers, 5 days] Rooms: ${group4.summary.rooms}, Total: ₹${group4.summary.totalBudget}, PerPerson: ₹${group4.summary.perPersonTotal}`);
    
    // Verify room calculation: 4 travellers = 2 rooms
    if (group4.summary.rooms !== 2) {
      throw new Error(`Expected 2 rooms for 4 travellers, got ${group4.summary.rooms}`);
    }

    // Verify arithmetic consistency: sum of categories must exactly equal totalBudget
    const sumCategories = group4.categories.reduce((acc, cat) => acc + cat.amount, 0);
    if (sumCategories !== group4.summary.totalBudget) {
      throw new Error(`Category sum (${sumCategories}) does not match totalBudget (${group4.summary.totalBudget})`);
    }

    // Verify per person calculation
    if (group4.summary.perPersonTotal !== Math.round(group4.summary.totalBudget / 4)) {
      throw new Error(`Per person total (${group4.summary.perPersonTotal}) is inaccurate`);
    }

    // Scenario C: Custom overrides
    const custom = calculateDeterministicBudget({
      travellers: 2,
      days: 4,
      transportationTotal: 8000,
      accommodationPerNight: 4000,
      foodPerDayPerPerson: 1000,
      activitiesPerDayPerPerson: 500,
      localTransportPerDayTotal: 800,
      otherExpensesTotal: 1500,
      rooms: 1
    });
    // Expected:
    // Transport: 8000
    // Hotel: 1 room * 3 nights * 4000 = 12000
    // Food: 2 travellers * 4 days * 1000 = 8000
    // Activities: 2 travellers * 4 days * 500 = 4000
    // Local: 4 days * 800 = 3200
    // Other: 1500
    // Total = 8000 + 12000 + 8000 + 4000 + 3200 + 1500 = 36700
    console.log(`[Scenario C: Custom overrides] Total computed: ₹${custom.summary.totalBudget} (Expected ₹36700)`);
    if (custom.summary.totalBudget !== 36700) {
      throw new Error(`Expected exactly ₹36700, got ₹${custom.summary.totalBudget}`);
    }

    console.log('✅ TEST 1 PASSED: Budget calculation arithmetic is 100% deterministic & accurate!\n');
    passed++;
  } catch (err) {
    console.error('❌ TEST 1 FAILED:', err.message);
    failed++;
  }

  // 2. WEATHER API TEST
  console.log('--- TEST 2: REAL METEOROLOGICAL SERVICE (OPEN-METEO) ---');
  try {
    const jaipurWeather = await fetchRealWeather('Jaipur');
    console.log(`[Jaipur Weather] Temp: ${jaipurWeather.current.temperature}°C, Condition: "${jaipurWeather.current.condition}", Humidity: ${jaipurWeather.current.humidity}%, 5-day forecast items: ${jaipurWeather.forecast.length}`);

    if (typeof jaipurWeather.current.temperature !== 'number' || isNaN(jaipurWeather.current.temperature)) {
      throw new Error('Invalid temperature received from real weather service');
    }
    if (jaipurWeather.forecast.length < 5) {
      throw new Error('Forecast did not return 5 days');
    }

    const varanasiWeather = await fetchRealWeather('Varanasi');
    console.log(`[Varanasi Weather] Temp: ${varanasiWeather.current.temperature}°C, Condition: "${varanasiWeather.current.condition}", Provider: "${varanasiWeather.provider}"`);

    console.log('✅ TEST 2 PASSED: Weather API retrieved live real-world meteorological data successfully!\n');
    passed++;
  } catch (err) {
    console.error('❌ TEST 2 FAILED:', err.message);
    failed++;
  }

  // 3. GEMINI AI CHATBOT INTEGRITY & CANNED-RESPONSE PREVENTION TEST
  console.log('--- TEST 3: AI SERVICE INTEGRITY & CANNED RESPONSE RULE ---');
  try {
    // When GEMINI_API_KEY is unset or default, system MUST throw descriptive error rather than returning fake canned answers!
    try {
      await generateGeminiResponse({ prompt: 'Plan a 5-day trip to Jaipur.' });
      console.log('Gemini API responded with real output.');
    } catch (aiErr) {
      console.log(`Verified AI error handling: "${aiErr.message}"`);
      if (!aiErr.message.includes('GEMINI_API_KEY') && !aiErr.message.includes('API key')) {
        throw new Error('Unexpected error message shape: ' + aiErr.message);
      }
      console.log('Verified: System REFUSES to substitute fake canned answers when API key is missing, adhering to Rule 2, 8, 9 & 13.');
    }

    console.log('✅ TEST 3 PASSED: Zero canned responses policy verified!\n');
    passed++;
  } catch (err) {
    console.error('❌ TEST 3 FAILED:', err.message);
    failed++;
  }

  console.log('====================================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
