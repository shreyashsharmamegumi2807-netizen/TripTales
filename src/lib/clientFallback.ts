import { 
  PlannerInputs, 
  TripItinerary, 
  BudgetBreakdown, 
  HiddenGem, 
  CommunityPost 
} from '../types';

// Category rules for client fallback
const CATEGORY_LOGIC: Record<string, any> = {
  'Spiritual / Bhakti': {
    themePrefix: 'Sacred Pilgrimage & Divine Darshan',
    morningFocus: 'Morning Mangala Aarti, sacred river snan/cleansing, and temple rituals',
    afternoonFocus: 'Quiet ashram reflection, temple trust museum visit, and Vedic study',
    eveningFocus: 'Mesmerizing evening Deep Daan, Ghat Aarti, and devotional kirtan',
    foodFocus: 'Pure Satvik vegetarian meals, Temple Mahaprasad, and traditional sweet bhog',
    transportTip: 'Electric e-rickshaws, shared temple battery vans, or pedestrian sacred paths',
    insiderTip: 'Wear traditional modest clothing covering shoulders and knees; avoid leather items inside inner sanctums.',
    packingItem: 'Comfortable slip-on footwear, copper vessel for holy water, light cotton stole'
  },
  'Char Dham Yatra': {
    themePrefix: 'High Himalayan Holy Yatra',
    morningFocus: 'Early dawn mountain ascent, GMVN transit, and sacred holy darshan',
    afternoonFocus: 'High-altitude river sangam exploration, thermal spring snan, and rest',
    eveningFocus: 'Evening temple aarti amidst snow-capped peaks and spiritual chanting',
    foodFocus: 'Piping hot Pahadi dal-chawal, ginger-lemon tea, and energy dry fruits',
    transportTip: 'Shared Bolero/Sumo 4x4 mountain cabs, GMVN state buses, or registered pony/palki',
    insiderTip: 'Biometric yatra registration and medical fitness clearance are mandatory before proceeding past Rishikesh.',
    packingItem: 'Heavy woollens, thermal inners, waterproof trekking boots, portable oxygen canister, rain poncho'
  },
  'Hiking / Trekking': {
    themePrefix: 'Mountain Pass Ascent & Trail Exploration',
    morningFocus: 'Early dawn trail start, steady ridge ascent, and panoramic peak photography',
    afternoonFocus: 'Alpine meadow picnic lunch, glacial stream refill, and acclimatization walk',
    eveningFocus: 'Starlit camp campfire briefing, mountain sunset gaze, and warm soup dinner',
    foodFocus: 'High-calorie trail energy bars, local Pahadi rajma-chawal, and hot garlic soup',
    transportTip: 'Basecamp trailhead transport via shared mountain jeep, then foot trail trekking',
    insiderTip: 'Start ascents before 7 AM to avoid afternoon mountain mist and unpredictable storm clouds.',
    packingItem: 'Ankle-support trekking shoes, trekking poles, thermal layers, UV sunglasses'
  },
  'Adventure': {
    themePrefix: 'Adrenaline Rush & Outdoor Expeditions',
    morningFocus: 'Certified equipment briefing and high-octane river rafting / paragliding takeoff',
    afternoonFocus: 'Bungee jumping, canyoning gorge walk, or ATV off-road trail navigation',
    eveningFocus: 'Riverside cliffside relaxation, adventure photography review, and hearty dinner',
    foodFocus: 'High-protein wholesome cafe meals, fresh fruit smoothies, and barbecue platters',
    transportTip: 'Rented 4x4 open safari jeeps, shared adventure operator shuttles, or scooter rentals',
    insiderTip: 'Always verify operator safety certifications (ATOAI approved) and wear helmets/lifejackets securely.',
    packingItem: 'Quick-dry synthetic clothing, waterproof dry-bag pouch, GoPro/action camera'
  },
  'Nature and Wildlife': {
    themePrefix: 'Ecosystem Safari & Deep Forest Immersion',
    morningFocus: 'Early 5:30 AM open-top gypsy wildlife safari with certified naturalist guide',
    afternoonFocus: 'Interpretation center museum tour, canopy birdwatching, and botanical stroll',
    eveningFocus: 'Sunset waterhole observation deck vigil and jungle acoustic audio recording',
    foodFocus: 'Fresh organic farm-to-table lunch, herbal infusion teas, and regional millet meals',
    transportTip: 'Forest Department authorized 4WD safari jeeps and designated electric buggies',
    insiderTip: 'Wear earthy colors (khaki, olive green, brown). Strictly avoid bright neon apparel or perfumes.',
    packingItem: 'High-magnification binoculars (8x42 or 10x42), telephoto zoom lens, mosquito repellent'
  },
  'Historical and Cultural': {
    themePrefix: 'Heritage Architecture & Living Dynasties',
    morningFocus: 'Architectural walk through ancient UNESCO fort courtyards with certified ASI historian',
    afternoonFocus: 'Royal museum galleries, traditional textile block-printing atelier, and library visit',
    eveningFocus: 'Mesmerizing Son-et-Lumière (Sound & Light) show on ancient palace stone facades',
    foodFocus: 'Centuries-old royal heritage recipes, hand-pounded spices, and regional artisanal sweets',
    transportTip: 'City heritage hop-on buses, cycle-rickshaws through bazaar alleys, or tourist taxis',
    insiderTip: 'Carry valid student or government ID cards to receive up to 80% discount on monument entry tickets.',
    packingItem: 'Comfortable walking shoes for stone corridors, wide-brim sunhat, offline audio guide app'
  },
  'Family Trip': {
    themePrefix: 'Relaxed Family Discovery & Shared Comfort',
    morningFocus: 'Comfortable late morning breakfast, relaxed garden stroll, and kid-friendly interactive science center',
    afternoonFocus: 'Scenic lake boat ride with life jackets, artisan souvenir browsing, and hygienic family dining',
    eveningFocus: 'Scenic promenade family walk, cultural folklore puppet/dance show, and relaxing dessert outing',
    foodFocus: 'Kid-friendly mild multi-cuisine restaurants, fresh thalis, and hygienic dining establishments',
    transportTip: 'Pre-booked air-conditioned private tempo traveller or spacious SUV for door-to-door convenience',
    insiderTip: 'Keep a 2-hour afternoon rest buffer to keep younger children and seniors refreshed.',
    packingItem: 'Family first-aid pouch, wet wipes, favorite snacks for transit, light woollen shawl'
  },
  'Solo Trip': {
    themePrefix: 'Introspective Wandering & Independent Discovery',
    morningFocus: 'Quiet sunrise viewpoint walk, journaling at a scenic heritage cafe, and mindful exploration',
    afternoonFocus: 'Boutique art gallery visit, wandering through pedestrian book markets, and street photography',
    eveningFocus: 'Social backpacker hostel common room meetups, live acoustic music, and open-air food market',
    foodFocus: 'Cozy backpacker cafes, single-portion local street eats, and craft kombucha/chai stalls',
    transportTip: 'City metro passes, walking on foot, shared e-rickshaws, and bicycle rentals',
    insiderTip: 'Share your live GPS location with a trusted contact and store emergency helpline numbers offline.',
    packingItem: 'High-capacity power bank, personal travel journal & pen, compact doorstop alarm'
  },
  'Friends Trip': {
    themePrefix: 'Group Bonding, Outdoor Fun & Epic Memories',
    morningFocus: 'Lively group road trip breakfast stop, upbeat playlist driving, and group viewpoint photoshoot',
    afternoonFocus: 'Go-karting, cliff diving, group trekking challenge, or relaxing beach volleyball game',
    eveningFocus: 'Rooftop cafe dinner with scenic mountain/lake views, group board games, and night stroll',
    foodFocus: 'Shared family platters, wood-fired pizzas, sizzling hot tandoori platters, and street chaat',
    transportTip: 'Shared self-drive 7-seater SUV (rented) or hiring a private tempo traveller to split costs',
    insiderTip: 'Use split-expense apps (Splitwise) from day 1 to track shared vehicle fuel and group food smoothly.',
    packingItem: 'Portable waterproof Bluetooth speaker, deck of cards, multiple-port USB fast charger'
  },
  'Budget Travel': {
    themePrefix: 'Economical Smart Travel & Maximum Value',
    morningFocus: 'Free morning self-guided walking tour and visits to free-entry public monuments',
    afternoonFocus: 'Historic bazaars, public libraries, scenic public gardens, and budget eateries',
    eveningFocus: 'Vibrant public riverfront promenade, sunset steps, and bustling night stalls',
    foodFocus: 'Unlimited regional thali lunch (₹100-₹150), student food streets, and local dhabas',
    transportTip: 'Indian Railways General/Sleeper class, state transport roadways bus, and shared tempos',
    insiderTip: 'Stay in government tourist lodges (GMVN/RTDC), Gurudwara sarai, or hostel dorm beds to cut stay costs by 70%.',
    packingItem: 'Refillable stainless steel water bottle, lightweight microfiber towel, combination padlock'
  }
};

const DESTINATION_KNOWLEDGE: Record<string, any> = {
  jaipur: {
    title: 'Jaipur — The Royal Pink City',
    areas: ['Amer Road', 'Old Walled City (Badi Chaupar)', 'C-Scheme & Civil Lines'],
    attractions: ['Amber Fort & Sheesh Mahal', 'Hawa Mahal', 'City Palace', 'Jantar Mantar Observatory', 'Nahargarh Fort Sunset Point', 'Albert Hall Museum', 'Patrika Gate', 'Galta Ji Monkey Temple'],
    foods: ['Pyaaz Kachori at Rawat Mishtan Bhandar', 'Dal Baati Churma', 'Lassi at Lassiwala MI Road', 'Ghevar from LMB'],
    transit: 'Low-cost Jaipur Metro, shared autos, and e-rickshaws around the walled bazaars.',
    packing: ['Cotton breathable clothes', 'Sun hat and sunglasses', 'Comfortable footwear for fort stone ramps']
  },
  varanasi: {
    title: 'Varanasi — Eternal Spiritual Capital of India',
    areas: ['Assi Ghat Area', 'Dashashwamedh Ghat Area', 'Cantonment'],
    attractions: ['Kashi Vishwanath Corridor', 'Dashashwamedh Evening Maha Aarti', 'Dawn boat row along 84 Ghats', 'Sarnath Buddhist Deer Park', 'Sankat Mochan Temple', 'Manikarnika Ghat viewpoint', 'BHU Vishwanath Temple'],
    foods: ['Banarasi Tamatar Chaat at Kashi Chaat Bhandar', 'Malaiyo saffron milk froth (winter)', 'Kachori Jalebi breakfast', 'Authentic Banarasi Paan'],
    transit: 'Walking through ancient pedestrian gallis, shared battery e-rickshaws, and wooden hand-rowed boats.',
    packing: ['Traditional modest cottons', 'Slip-on shoes for temple entry', 'Waterproof phone pouch for boat rides']
  },
  chopta: {
    title: 'Chopta & Tungnath — Mini Switzerland of Uttarakhand',
    areas: ['Chopta Meadows Eco-camps', 'Sari Village Base', 'Ukhimath'],
    attractions: ['Tungnath Shiva Temple (World Highest at 3,680m)', 'Chandrashila Peak 360-degree Summit', 'Deoria Tal Emerald Lake trek', 'Rohini Bugyal meadows', 'Omkareshwar Temple Ukhimath'],
    foods: ['Pahadi Mandua (Ragi) Rotis', 'Gahat ki Dal (Horsegram soup)', 'Buransh (Rhododendron) floral juice', 'Hot ginger chai'],
    transit: 'Mountain taxi from Rishikesh/Haridwar via Rudraprayag, followed by scenic foot trekking.',
    packing: ['Thermal underlayers', 'Trekking poles with rubber tips', 'Sturdy high-traction shoes', 'Personal water bottle']
  }
};

/**
 * Generate client-side dynamic itinerary
 */
export function generateClientItinerary(inputs: PlannerInputs): TripItinerary {
  const numDays = Math.min(30, Math.max(1, inputs.days || 3));
  const normalizedDest = inputs.destination.trim().toLowerCase();
  
  let destData = DESTINATION_KNOWLEDGE[normalizedDest];
  if (!destData) {
    for (const [key, val] of Object.entries(DESTINATION_KNOWLEDGE)) {
      if (normalizedDest.includes(key) || key.includes(normalizedDest)) {
        destData = val;
        break;
      }
    }
  }

  if (!destData) {
    destData = {
      title: `${inputs.destination}`,
      areas: [`${inputs.destination} Central Heritage Area`, `${inputs.destination} Riverside / Scenic Quarter`, `${inputs.destination} Bazaars & Cultural Sector`],
      attractions: [
        `${inputs.destination} Grand Historic Landmark`,
        `${inputs.destination} Panoramic Sunset Vantage Point`,
        `${inputs.destination} Cultural Artisan Bazaar`,
        `${inputs.destination} Nature Trail & Botanical Garden`,
        `${inputs.destination} Ancient Spiritual Sanctuary`
      ],
      foods: [`Authentic regional specialities of ${inputs.destination}`, 'Freshly prepared traditional thali', 'Locally acclaimed heritage tea stall and sweets'],
      transit: 'Local government buses, shared electric autos, and pleasant pedestrian promenades.',
      packing: ['Comfortable walking shoes', 'Breathable cotton apparel', 'Light jacket for cooler evenings']
    };
  }

  const categoryProfile = CATEGORY_LOGIC[inputs.tripType] || CATEGORY_LOGIC['Budget Travel'];
  const dayExpenseBase = inputs.budget && inputs.budget > 0 
    ? Math.round(inputs.budget / numDays)
    : 2200;

  const daysList = [];
  for (let i = 1; i <= numDays; i++) {
    const area = destData.areas[(i - 1) % destData.areas.length];
    const morningAttraction = destData.attractions[(i * 2 - 2) % destData.attractions.length];
    const eveningAttraction = destData.attractions[(i * 2 - 1) % destData.attractions.length];
    const food = destData.foods[(i - 1) % destData.foods.length];

    let morningDesc = `${categoryProfile.morningFocus}. Visit ${morningAttraction} and explore surrounding sights.`;
    let afternoonDesc = `Enjoy lunch featuring ${food}. ${categoryProfile.afternoonFocus}.`;
    let eveningDesc = `Proceed to ${eveningAttraction}. ${categoryProfile.eveningFocus}.`;

    if (i === 1) {
      morningDesc = `Depart from ${inputs.startingLocation} and arrive in ${inputs.destination}. Transfer to your base near ${area}, refresh, and explore nearby landmarks.`;
    } else if (i === numDays) {
      eveningDesc = `Conclude your ${inputs.tripType} journey. Transfer to transit hubs with wonderful memories of ${inputs.destination}. Return journey back to ${inputs.startingLocation}.`;
    }

    daysList.push({
      dayNumber: i,
      date: `Day ${i}`,
      theme: `Day ${i}: ${categoryProfile.themePrefix} at ${area}`,
      morning: morningDesc,
      afternoon: afternoonDesc,
      evening: eveningDesc,
      placesToVisit: [morningAttraction, eveningAttraction],
      recommendedFood: food,
      transportSuggestion: categoryProfile.transportTip,
      estimatedDayExpense: dayExpenseBase,
      accommodationArea: area,
      insiderTip: categoryProfile.insiderTip
    });
  }

  return {
    tripTitle: `${numDays}-Day ${inputs.destination} ${inputs.tripType}`,
    summary: `A tailor-made ${numDays}-day ${inputs.tripType.toLowerCase()} from ${inputs.startingLocation} to ${inputs.destination} designed for ${inputs.travellers} traveller(s). Optimized for a budget of ₹${(inputs.budget || dayExpenseBase * numDays).toLocaleString()}, balancing cultural depth, practical transit, and authentic local experiences.`,
    highlightTags: [inputs.tripType, `${numDays} Days`, `${inputs.travellers} Travellers`, 'Verified Route'],
    days: daysList,
    packingEssentials: [
      categoryProfile.packingItem,
      ...destData.packing,
      'Valid photo ID and emergency contact details',
      'High-capacity power bank & essential medicines'
    ],
    culturalEtiquette: [
      categoryProfile.insiderTip,
      'Always request permission before photographing local residents or private sanctums.',
      'Maintain environmental cleanliness and minimize single-use plastics.'
    ],
    transitAdvice: `From ${inputs.startingLocation} to ${inputs.destination}, rely on Indian Railways or state roadways for affordable journeys. Locally, use shared autos and metro where available.`,
    estimatedTotalCost: inputs.budget || dayExpenseBase * numDays
  };
}

/**
 * Generate client-side affordable budget breakdown
 */
export function generateClientBudget(params: {
  travellers: number;
  days: number;
  travelStyle: string;
  userBudget?: number | null;
}): BudgetBreakdown {
  const numTravellers = Math.max(1, params.travellers || 1);
  const numDays = Math.max(1, params.days || 1);
  const nights = Math.max(1, numDays - 1 > 0 ? numDays - 1 : 1);
  const rooms = Math.ceil(numTravellers / 2);

  const transTotal = numTravellers * 650;
  const accomTotal = rooms * nights * 900;
  const foodTotal = numTravellers * numDays * 350;
  const localTransTotal = numDays * 250;
  const actTotal = numTravellers * numDays * 150;
  const otherTotal = 400;

  const total = transTotal + accomTotal + foodTotal + localTransTotal + actTotal + otherTotal;
  const perPerson = Math.round(total / numTravellers);
  const userBudget = params.userBudget || null;

  let remaining = null;
  let status: 'surplus' | 'deficit' | 'balanced' = 'balanced';

  if (userBudget !== null) {
    remaining = userBudget - total;
    if (remaining > 50) status = 'surplus';
    else if (remaining < -50) status = 'deficit';
    else status = 'balanced';
  }

  return {
    summary: {
      travellers: numTravellers,
      days: numDays,
      nights,
      rooms,
      travelStyle: params.travelStyle || 'budget',
      totalBudget: total,
      perPersonTotal: perPerson,
      currency: 'INR',
      userBudget,
      remainingBudget: remaining,
      budgetStatus: status
    },
    categories: [
      {
        id: 'transportation',
        name: 'Transportation (Train / Bus / Intercity)',
        amount: transTotal,
        perPerson: Math.round(transTotal / numTravellers),
        isShared: false,
        assumption: `${numTravellers} traveller(s) × ₹650 (Sleeper Class / Ordinary Bus)`,
        economicalAlternative: 'Book Sleeper Class (SL) via IRCTC for lowest fares'
      },
      {
        id: 'accommodation',
        name: 'Accommodation',
        amount: accomTotal,
        perPerson: Math.round(accomTotal / numTravellers),
        isShared: true,
        assumption: `${rooms} room/dorm unit(s) × ${nights} night(s) @ ₹900/night`,
        economicalAlternative: 'Stay in backpacker hostel dorms or temple dharamshalas'
      },
      {
        id: 'food',
        name: 'Food & Daily Dining',
        amount: foodTotal,
        perPerson: Math.round(foodTotal / numTravellers),
        isShared: false,
        assumption: `${numTravellers} traveller(s) × ${numDays} days @ ₹350/day`,
        economicalAlternative: 'Enjoy local thali joints and traditional street dhabas'
      },
      {
        id: 'localTransport',
        name: 'Local Transit (Shared Auto / Metro / Scooter)',
        amount: localTransTotal,
        perPerson: Math.round(localTransTotal / numTravellers),
        isShared: true,
        assumption: `Shared transit @ ₹250/day for ${numDays} days`,
        economicalAlternative: 'Use shared 6-seater tempos, city metro, or rented scooter'
      },
      {
        id: 'activities',
        name: 'Sightseeing & Activities',
        amount: actTotal,
        perPerson: Math.round(actTotal / numTravellers),
        isShared: false,
        assumption: `${numTravellers} traveller(s) × ${numDays} days @ ₹150/day`,
        economicalAlternative: 'Avail student discounts, free temple entry & public walking viewpoints'
      },
      {
        id: 'otherExpenses',
        name: 'Emergency & Miscellaneous',
        amount: otherTotal,
        perPerson: Math.round(otherTotal / numTravellers),
        isShared: false,
        assumption: 'Water refills, tea stops, emergency reserves & entry lockers',
        economicalAlternative: 'Carry a refillable water bottle and personal medicine pouch'
      }
    ],
    cheaperAlternatives: [
      {
        category: 'Transportation',
        currentOption: 'Sleeper Class Train / State Roadways Bus',
        suggestedAlternative: 'Book Indian Railways Sleeper Class (SL) 15-30 days in advance via IRCTC, or take state roadways ordinary buses.',
        estimatedSavings: 520,
        tip: 'Train fares remain fixed regardless of dynamic surge, saving huge sums compared to private cabs or last-minute flights.'
      },
      {
        category: 'Accommodation',
        currentOption: 'Backpacker Hostel / Dharamshala / Homestay',
        suggestedAlternative: 'Opt for youth hostel dorms (Zostel/goSTOPS), Temple trust dharamsalas (e.g. GMVN / Gurudwara Sarai), or village homestays.',
        estimatedSavings: 810,
        tip: 'Hostel dorms provide clean bedding, hot water, and social common rooms at ₹400-₹700/night instead of costly hotel rooms.'
      },
      {
        category: 'Food & Dining',
        currentOption: 'Local thalis & street dhabas',
        suggestedAlternative: 'Eat at busy local thali joints, college area messes, and temple community langars/prasadam counters.',
        estimatedSavings: 735,
        tip: 'Unlimited regional thalis (South Indian meals or Rajasthani/Gujarati thalis) provide wholesome, fresh food at just ₹100-₹150.'
      },
      {
        category: 'Local Transit',
        currentOption: 'Shared autos & city metro lines',
        suggestedAlternative: 'Use shared e-rickshaws (₹10-₹20/hop), city metro day passes, or rent a 110cc scooter to split between 2 people.',
        estimatedSavings: 375,
        tip: 'Renting a scooter for ₹350/day with 2 travellers costs only ₹175/person, granting complete freedom without cab surge fares.'
      }
    ],
    assumptionsNote: 'Costs are estimated based on realistic budget options in India. Room occupancy assumes 1 room per 2 travellers.'
  };
}

/**
 * Curated Fallback Hidden Gems list
 */
export const CLIENT_HIDDEN_GEMS: HiddenGem[] = [
  {
    id: 'chopta-tungnath',
    name: 'Chopta & Tungnath',
    location: 'Rudraprayag District, Uttarakhand, India',
    state: 'Uttarakhand',
    region: 'North India',
    category: 'Hiking / Trekking',
    tags: ['Hiking / Trekking', 'Spiritual / Bhakti', 'Nature and Wildlife'],
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Perched at 2,680m amidst rhododendron forests and alpine meadows, Chopta serves as the base for Tungnath—the world\'s highest Shiva shrine—and the breathtaking Chandrashila peak.',
    about: 'Chopta is a pristine meadow nestled inside Kedarnath Wildlife Sanctuary in Garhwal Himalayas. Offers dense deodar canopy, chirping monal birds, and 360-degree vistas of Himalayan giants like Nanda Devi and Chaukhamba.',
    whyVisit: 'Combines high-altitude spiritual solace with an accessible Himalayan ridge trek.',
    bestTimeToVisit: 'April to June (flowering rhododendrons); October to December (clear skies & early snow).',
    recommendedDuration: '3 to 4 Days',
    approximateExpenses: {
      budgetPerDay: '₹1,200 - ₹2,000/day',
      stay: 'Eco-camps & village homestays: ₹800 - ₹1,500/night',
      food: 'Pahadi thali & hot tea: ₹300 - ₹500/day'
    },
    howToReach: {
      air: 'Jolly Grant Airport, Dehradun (220 km). Hired cabs or buses to Ukhimath/Chopta.',
      rail: 'Rishikesh / Haridwar Railway Station (200 km). Frequent shared cabs via Devprayag.',
      road: 'Well connected from Rishikesh via NH58 to Rudraprayag, then Kund, Ukhimath, and Chopta.'
    },
    nearbyAttractions: [
      'Tungnath Temple (World\'s highest Shiva shrine at 3,680m)',
      'Chandrashila Peak Summit (4,000m panoramic vantage point)',
      'Deoria Tal Emerald Lake (reflection of Chaukhamba peaks)',
      'Rohini Bugyal alpine meadow'
    ],
    recommendedActivities: [
      'Trek 3.5 km stone trail from Chopta to Tungnath Temple',
      'Summit Chandrashila for early morning sunrise over Nanda Devi',
      'Camp under crystal-clear starlit skies with zero light pollution'
    ],
    importantTips: [
      'Carry cash as the last reliable ATM is in Ukhimath (30 km prior).',
      'Mobile signal is patchy; download offline maps in advance.',
      'Night temperatures plunge below 5°C; pack thermal layers.'
    ],
    travelTips: [
      'Start the Tungnath trek before 7:00 AM to avoid mid-day clouds obscuring the summit view.',
      'Stay in Sari village for 1 night to do the Deoria Tal trek before heading to Chopta.'
    ],
    nearestTransit: 'Rishikesh Railway Station (200 km); Dehradun Airport (220 km)',
    accommodationSuggestions: [
      { name: 'Monal Adventure Eco Camps', type: 'Swiss Tent / Camp', priceRange: '₹1,000 - ₹1,800/night', badge: 'Popular with Trekkers' },
      { name: 'Sari Village Traditional Homestay', type: 'Homestay', priceRange: '₹700 - ₹1,200/night', badge: 'Authentic Local Food' }
    ],
    communityPosts: [
      {
        id: 'post-chopta-1',
        destinationId: 'chopta-tungnath',
        authorName: 'Rohan Deshmukh',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        days: 3,
        budget: 6200,
        startingLocation: 'Delhi',
        tripType: 'Hiking / Trekking',
        dayWisePlan: [
          { dayNumber: 1, title: 'Delhi to Sari Village & Deoria Tal Sunset', highlights: 'Took overnight bus from Delhi to Rishikesh, shared cab to Sari. Hiked 2.5km to Deoria Tal for sunset.' },
          { dayNumber: 2, title: 'Chopta Base to Tungnath & Chandrashila Summit', highlights: 'Started trek at 6 AM from Chopta. Reached Tungnath at 8:30 AM, climbed steep ridge to Chandrashila summit at 10 AM.' },
          { dayNumber: 3, title: 'Rhododendron Forest Walk & Return Journey', highlights: 'Morning walk in Chopta meadows. Local breakfast of Mandua roti, then shared cab back to Rishikesh.' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'
        ],
        experience: 'Climbing up to Tungnath and then Chandrashila was spiritual and adventurous at once. Standing on the summit with prayer flags fluttering and seeing Nanda Devi, Trishul, and Chaukhamba all around you is an experience no words can capture.',
        tips: [
          'Take trekking poles; the descent from Chandrashila puts pressure on the knees.',
          'Start very early to catch the mountain peaks before afternoon clouds roll in.'
        ],
        likes: 54,
        createdAt: '2026-10-15',
        isSample: false
      }
    ]
  },
  {
    id: 'gandikota-canyon',
    name: 'Gandikota (The Grand Canyon of India)',
    location: 'Kadapa District, Andhra Pradesh, India',
    state: 'Andhra Pradesh',
    region: 'South India',
    category: 'Adventure',
    tags: ['Adventure', 'Historical and Cultural', 'Solo Trip'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    description: 'A spectacular gorge of red granite formed by the Pennar River cutting through the Erramala hills, topped by a 13th-century red-stone fort.',
    bestTimeToVisit: 'October to February',
    approximateExpenses: {
      budgetPerDay: '₹1,000 - ₹1,800/day',
      stay: 'Cliffside tents & Haritha resort: ₹900 - ₹1,800/night',
      food: 'Andhra spicy meals: ₹250 - ₹450/day'
    },
    travelTips: ['Camp near the gorge for sunset', 'Wear shoes with good grip on red rock'],
    nearestTransit: 'Jammalamadugu Railway Station (18 km); Bangalore Airport (280 km)',
    communityPosts: []
  },
  {
    id: 'spiti-tabo',
    name: 'Spiti Valley & Tabo Monastery',
    location: 'Lahaul and Spiti District, Himachal Pradesh, India',
    state: 'Himachal Pradesh',
    region: 'North India',
    category: 'Cultural and historical travel',
    tags: ['Cultural and historical travel', 'Adventure', 'Hiking / Trekking'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'The Middle Land between Tibet and India featuring ancient mud-walled monasteries, surreal lunar landscapes, and snow-fed river valleys.',
    bestTimeToVisit: 'May to October',
    approximateExpenses: {
      budgetPerDay: '₹1,500 - ₹2,500/day',
      stay: 'Homestays: ₹800 - ₹1,400/night with meals',
      food: 'Tibetan thukpa & momos: ₹300 - ₹500/day'
    },
    travelTips: ['Acclimatize in Kalpa or Kaza for 24 hours', 'Carry cash as ATMs are rarely operational'],
    nearestTransit: 'Shimla (420 km); Chandigarh Airport (450 km)',
    communityPosts: []
  }
];
