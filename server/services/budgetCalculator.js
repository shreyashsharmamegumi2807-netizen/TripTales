/**
 * Deterministic Travel Budget Calculation Engine
 * Focused on Affordable, Realistic Travel Planning (MakeMyTrip Inspired)
 * Especially tailored for students, solo backpackers, and budget-conscious groups.
 */

export function calculateDeterministicBudget({
  travellers = 1,
  days = 1,
  travelStyle = 'budget',
  userBudget = null,
  transportationTotal = null,
  accommodationPerNight = null,
  foodPerDayPerPerson = null,
  activitiesPerDayPerPerson = null,
  localTransportPerDayTotal = null,
  otherExpensesTotal = null,
  rooms = null,
}) {
  // 1. Sanitize & Validate inputs
  const numTravellers = Math.max(1, parseInt(travellers) || 1);
  const numDays = Math.max(1, parseInt(days) || 1);
  const nights = Math.max(1, numDays - 1 > 0 ? numDays - 1 : 1);
  const parsedUserBudget = userBudget !== null && !isNaN(Number(userBudget)) ? Math.max(0, Number(userBudget)) : null;

  // 2. Room Count: 2 persons per room standard, 1 room for solo/duo
  const numRooms = rooms !== null && !isNaN(parseInt(rooms)) && parseInt(rooms) > 0
    ? parseInt(rooms)
    : Math.ceil(numTravellers / 2);

  // 3. Auto-adapt travel style if user budget is strictly specified
  let effectiveStyle = travelStyle;
  if (parsedUserBudget !== null) {
    const budgetPerDayPerPerson = parsedUserBudget / (numTravellers * numDays);
    if (budgetPerDayPerPerson <= 1800) {
      effectiveStyle = 'budget';
    } else if (budgetPerDayPerPerson > 6000) {
      effectiveStyle = 'luxury';
    } else {
      effectiveStyle = travelStyle === 'budget' ? 'budget' : 'moderate';
    }
  }

  // 4. Affordable & Realistic Indian Travel Rate Presets (INR)
  const ratePresets = {
    budget: {
      transportPerPerson: 650,          // Indian Railways Sleeper Class / State Roadways Bus
      transportLabel: 'Sleeper Class Train / State Roadways Bus',
      hotelPerRoomPerNight: 900,        // Verified Backpackers Hostel, Dharamshala, or Budget Homestay
      hotelLabel: 'Backpacker Hostel / Dharamshala / Homestay',
      foodPerPersonPerDay: 350,         // Authentic regional thalis, dhabas, local mess
      foodLabel: 'Local thalis & street dhabas',
      activitiesPerPersonPerDay: 150,   // Public monuments, student pass entry, walking tours
      activitiesLabel: 'Free entry sights & student pass monuments',
      localTransportTotalPerDay: 250,   // Shared auto-rickshaws, city metro, shared tempos
      localTransportLabel: 'Shared autos & city metro lines',
      otherTotal: 200 * numTravellers,  // Emergency reserves, water bottle refills
    },
    moderate: {
      transportPerPerson: 1800,         // AC 3-Tier Train / Intercity AC Volvo Bus
      transportLabel: 'AC 3-Tier Train / Intercity Volvo Bus',
      hotelPerRoomPerNight: 2200,       // Clean 2-3 Star Hotel / Private Boutique Room
      hotelLabel: '2-3 Star clean hotel / private room',
      foodPerPersonPerDay: 750,         // Reputed family restaurants & local cafes
      foodLabel: 'Popular family restaurants & cafes',
      activitiesPerPersonPerDay: 400,   // Guided entry tickets, ropeways, safaris
      activitiesLabel: 'Museums, fort entry & guided experiences',
      localTransportTotalPerDay: 600,   // App cabs (Uber/Ola) / rented scooters
      localTransportLabel: 'App-based cabs & rented scooters',
      otherTotal: 500 * numTravellers,  // Souvenirs & travel essentials
    },
    luxury: {
      transportPerPerson: 5500,         // Domestic flights / Chauffeur vehicle
      transportLabel: 'Domestic flight / Premium train',
      hotelPerRoomPerNight: 6500,       // 4-Star / Heritage resort
      hotelLabel: '4-Star / Heritage resort',
      foodPerPersonPerDay: 1800,        // Gourmet dining & specialty restaurants
      foodLabel: 'Fine dining & heritage restaurants',
      activitiesPerPersonPerDay: 1200,  // Private guides, VIP darshan passes, private boat/safari
      activitiesLabel: 'Private boat tours, safaris & VIP passes',
      localTransportTotalPerDay: 1800,  // Dedicated AC chauffeur car
      localTransportLabel: 'Dedicated private AC vehicle',
      otherTotal: 1500 * numTravellers, // Luxury shopping & experiences
    }
  };

  const preset = ratePresets[effectiveStyle] || ratePresets.budget;

  // 5. Individual category calculations
  const transportCost = transportationTotal !== null && !isNaN(Number(transportationTotal))
    ? Math.max(0, Number(transportationTotal))
    : preset.transportPerPerson * numTravellers;

  const roomRate = accommodationPerNight !== null && !isNaN(Number(accommodationPerNight))
    ? Math.max(0, Number(accommodationPerNight))
    : preset.hotelPerRoomPerNight;
  const accommodationCost = roomRate * numRooms * nights;

  const dailyFoodRate = foodPerDayPerPerson !== null && !isNaN(Number(foodPerDayPerPerson))
    ? Math.max(0, Number(foodPerDayPerPerson))
    : preset.foodPerPersonPerDay;
  const foodCost = dailyFoodRate * numTravellers * numDays;

  const dailyActivityRate = activitiesPerDayPerPerson !== null && !isNaN(Number(activitiesPerDayPerPerson))
    ? Math.max(0, Number(activitiesPerDayPerPerson))
    : preset.activitiesPerPersonPerDay;
  const activitiesCost = dailyActivityRate * numTravellers * numDays;

  const dailyLocalTransport = localTransportPerDayTotal !== null && !isNaN(Number(localTransportPerDayTotal))
    ? Math.max(0, Number(localTransportPerDayTotal))
    : preset.localTransportTotalPerDay;
  const localTransportCost = dailyLocalTransport * numDays;

  const otherCost = otherExpensesTotal !== null && !isNaN(Number(otherExpensesTotal))
    ? Math.max(0, Number(otherExpensesTotal))
    : preset.otherTotal;

  // 6. Total Calculation (Deterministic arithmetic addition)
  const totalBudget = Math.round(
    transportCost + accommodationCost + foodCost + activitiesCost + localTransportCost + otherCost
  );

  const perPersonTotal = Math.round(totalBudget / numTravellers);

  // 7. Remaining Budget & Savings Analysis
  let remainingBudget = null;
  let budgetStatus = 'balanced';
  if (parsedUserBudget !== null) {
    remainingBudget = Math.round(parsedUserBudget - totalBudget);
    if (remainingBudget > 0) budgetStatus = 'surplus';
    else if (remainingBudget < 0) budgetStatus = 'deficit';
    else budgetStatus = 'balanced';
  }

  // 8. Cheaper Alternatives & Money-Saving Swaps (MakeMyTrip Inspired)
  const cheaperAlternatives = [
    {
      category: 'Transportation',
      currentOption: preset.transportLabel,
      suggestedAlternative: 'Book Indian Railways Sleeper Class (SL) 15-30 days in advance via IRCTC, or take state roadways ordinary buses.',
      estimatedSavings: Math.max(500, Math.round(transportCost * 0.4)),
      tip: 'Train fares remain fixed regardless of dynamic surge, saving huge sums compared to private cabs or last-minute flights.'
    },
    {
      category: 'Accommodation',
      currentOption: preset.hotelLabel,
      suggestedAlternative: 'Opt for youth hostel dorms (Zostel/goSTOPS), Temple trust dharamsalas (e.g. GMVN / Gurudwara Sarai), or village homestays.',
      estimatedSavings: Math.max(600, Math.round(accommodationCost * 0.45)),
      tip: 'Hostel dorms provide clean bedding, hot water, and social common rooms at ₹400-₹700/night instead of costly hotel rooms.'
    },
    {
      category: 'Food & Dining',
      currentOption: preset.foodLabel,
      suggestedAlternative: 'Eat at busy local thali joints, college area messes, and temple community langars/prasadam counters.',
      estimatedSavings: Math.max(300, Math.round(foodCost * 0.35)),
      tip: 'Unlimited regional thalis (South Indian meals or Rajasthani/Gujarati thalis) provide wholesome, fresh food at just ₹100-₹150.'
    },
    {
      category: 'Local Transit',
      currentOption: preset.localTransportLabel,
      suggestedAlternative: 'Use shared e-rickshaws (₹10-₹20/hop), city metro day passes, or rent a 110cc scooter to split between 2 people.',
      estimatedSavings: Math.max(200, Math.round(localTransportCost * 0.5)),
      tip: 'Renting a scooter for ₹350/day with 2 travellers costs only ₹175/person, granting complete freedom without cab surge fares.'
    }
  ];

  return {
    summary: {
      travellers: numTravellers,
      days: numDays,
      nights: nights,
      rooms: numRooms,
      travelStyle: effectiveStyle,
      totalBudget: totalBudget,
      perPersonTotal: perPersonTotal,
      currency: 'INR',
      userBudget: parsedUserBudget,
      remainingBudget: remainingBudget,
      budgetStatus: budgetStatus
    },
    categories: [
      {
        id: 'transportation',
        name: 'Transportation (Train / Bus / Intercity)',
        amount: Math.round(transportCost),
        perPerson: Math.round(transportCost / numTravellers),
        isShared: false,
        assumption: `${numTravellers} traveller(s) × ₹${Math.round(transportCost / numTravellers).toLocaleString()} (${preset.transportLabel})`,
        economicalAlternative: 'Book Sleeper Class (SL) via IRCTC for lowest fares'
      },
      {
        id: 'accommodation',
        name: 'Accommodation',
        amount: Math.round(accommodationCost),
        perPerson: Math.round(accommodationCost / numTravellers),
        isShared: true,
        assumption: `${numRooms} room/dorm unit(s) × ${nights} night(s) @ ₹${Math.round(roomRate).toLocaleString()}/night (${preset.hotelLabel})`,
        economicalAlternative: 'Stay in verified backpacker hostel dorms or Dharamshalas'
      },
      {
        id: 'food',
        name: 'Food & Daily Dining',
        amount: Math.round(foodCost),
        perPerson: Math.round(foodCost / numTravellers),
        isShared: false,
        assumption: `${numTravellers} traveller(s) × ${numDays} days @ ₹${Math.round(dailyFoodRate).toLocaleString()}/day (${preset.foodLabel})`,
        economicalAlternative: 'Enjoy local thali joints and traditional street dhabas'
      },
      {
        id: 'localTransport',
        name: 'Local Transit (Shared Auto / Metro / Scooter)',
        amount: Math.round(localTransportCost),
        perPerson: Math.round(localTransportCost / numTravellers),
        isShared: true,
        assumption: `Shared transit @ ₹${Math.round(dailyLocalTransport).toLocaleString()}/day for ${numDays} days (${preset.localTransportLabel})`,
        economicalAlternative: 'Use shared 6-seater tempos, city metro, or rented scooter'
      },
      {
        id: 'activities',
        name: 'Sightseeing & Activities',
        amount: Math.round(activitiesCost),
        perPerson: Math.round(activitiesCost / numTravellers),
        isShared: false,
        assumption: `${numTravellers} traveller(s) × ${numDays} days @ ₹${Math.round(dailyActivityRate).toLocaleString()}/day (${preset.activitiesLabel})`,
        economicalAlternative: 'Avail student discounts, free temple entry & public walking viewpoints'
      },
      {
        id: 'otherExpenses',
        name: 'Emergency & Miscellaneous',
        amount: Math.round(otherCost),
        perPerson: Math.round(otherCost / numTravellers),
        isShared: false,
        assumption: 'Water refills, tea stops, emergency reserves & entry lockers',
        economicalAlternative: 'Carry a refillable water bottle and personal medicine pouch'
      }
    ],
    cheaperAlternatives,
    assumptionsNote: `Costs are estimated based on realistic budget options in India. Room occupancy assumes ${numRooms} room(s) for ${numTravellers} traveller(s). Local transit is treated as a shared vehicle/auto expense.`
  };
}
