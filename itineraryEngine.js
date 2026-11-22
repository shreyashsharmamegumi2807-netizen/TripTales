/**
 * Dynamic Travel Itinerary Generation Engine
 * 
 * Supports all 10 travel categories with authentic destination intelligence,
 * day-by-day morning/afternoon/evening schedules, places to visit, local cuisine,
 * transport recommendations, estimated expenses, and useful travel tips.
 */

// Category specialized templates and rules
const CATEGORY_LOGIC = {
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
    themePrefix: 'Alpine Trail & Wilderness Ascent',
    morningFocus: 'Early dawn trail start, steady ridge ascent, and panoramic peak photography',
    afternoonFocus: 'Trailside meadow lunch, stream crossing, and alpine campsite pitching',
    eveningFocus: 'Sunset alpenglow over high peaks, stargazing, and campsite campfire',
    foodFocus: 'High-carb porridge, trail nuts, peanut butter wraps, and instant hot stews',
    transportTip: 'Hired 4x4 pickup to trailhead, followed by self-supported foot trekking',
    insiderTip: 'Maintain a rhythmic slow pace for altitude acclimatization; drink at least 3-4 litres of water daily.',
    packingItem: 'High-ankle trekking boots, trekking poles, headlamp with extra batteries, quick-dry layers, blister kit'
  },
  'Adventure': {
    themePrefix: 'High-Adrenaline Expedition',
    morningFocus: 'Gear check, safety briefing, and morning thrill session (Rafting / Paragliding)',
    afternoonFocus: 'Action sport continuation (Ziplining / Rock climbing / Quad biking)',
    eveningFocus: 'Riverside chill, adventure camp stories, and outdoor barbecue dinner',
    foodFocus: 'High-protein meals, fresh local fruit juices, and wholesome grilled specials',
    transportTip: 'Adventure operator shuttles, rented all-terrain bikes, or private open jeeps',
    insiderTip: 'Always verify international CE/UIAA safety certification of operators before booking extreme activities.',
    packingItem: 'GoPro/action camera, quick-dry athletic wear, waterproof dry bag, sunscreen SPF 50+'
  },
  'Nature and Wildlife': {
    themePrefix: 'Forest Trail & Eco Wildlife Encounter',
    morningFocus: 'Dawn core-zone wildlife jeep safari for peak predator and bird sightings',
    afternoonFocus: 'Nature interpretation centre, botanical walk, and canopy watchtower',
    eveningFocus: 'Twilight buffer safari, tranquil lake birdwatching, and documentary screening',
    foodFocus: 'Farm-to-table organic meals, regional woodland herbs, and fresh rural dishes',
    transportTip: 'Forest department approved 4x4 open Gypsy vehicles with mandatory certified naturalist',
    insiderTip: 'Wear earthy camouflage tones (khaki, olive, brown); avoid bright fluorescent clothes and loud phone rings.',
    packingItem: '8x42 binoculars, telephoto lens, insect repellent spray, wide-brim safari hat'
  },
  'Historical and Cultural': {
    themePrefix: 'Heritage Citadel & Artisan Traditions',
    morningFocus: 'Grand fortress and palace exploration with licensed architectural guide',
    afternoonFocus: 'Traditional handicraft weaving bazaar, state museum, and artisan studio',
    eveningFocus: 'Heritage sound & light spectacle, classical folk dance, and courtyard dining',
    foodFocus: 'Royal heritage culinary thali (e.g. Laal Maas/Ker Sangri or Awadhi Biryani)',
    transportTip: 'Local heritage walking tours, metered auto-rickshaws, or hop-on-hop-off tourist buses',
    insiderTip: 'Purchase combo tickets at ASI monuments online in advance to skip long physical queues.',
    packingItem: 'Comfortable walking shoes, digital camera, notebook for historical legends'
  },
  'Family Trip': {
    themePrefix: 'Relaxed & Joyful Family Discovery',
    morningFocus: 'Leisurely breakfast followed by iconic kid & senior-friendly landmark visit',
    afternoonFocus: 'Interactive science museum, tranquil botanical garden, or serene boat ride',
    eveningFocus: 'Vibrant local promenade walk, sweet shop sampling, and family feast',
    foodFocus: 'Hygienic multi-cuisine family restaurants, mild gravies, and delicious regional desserts',
    transportTip: 'Pre-booked air-conditioned Innova/Ertiga with reliable vetted driver',
    insiderTip: 'Schedule mid-day rest periods to keep both children and senior family members energized and happy.',
    packingItem: 'First-aid family kit, portable phone power bank, child entertainment games, wet wipes'
  },
  'Solo Trip': {
    themePrefix: 'Independent Explorer & Mindful Journey',
    morningFocus: 'Early quiet photography stroll before tour crowds arrive, and cafe breakfast',
    afternoonFocus: 'Independent museum wander, hidden alley exploration, and bookstore browsing',
    eveningFocus: 'Sunset viewpoint meetups, social backpacker cafe dinner, and live music',
    foodFocus: 'Popular street food carts with long queues (high turnover) and specialty coffee cafes',
    transportTip: 'Public metro lines, rented two-wheeler scooter, or shared local buses',
    insiderTip: 'Keep emergency contacts and offline Google Maps pinned; stay in verified hostels for easy peer connection.',
    packingItem: 'Secure anti-theft sling bag, universal travel adapter, personal journal and pen'
  },
  'Friends Trip': {
    themePrefix: 'Social Adventure & Group Escapade',
    morningFocus: 'Group breakfast, road trip music drive, and exciting scenic group activity',
    afternoonFocus: 'Water sports, cafe hopping, local bazaar challenge, and street food crawl',
    eveningFocus: 'Sunset cliff gathering, night market exploration, and group dinner with music',
    foodFocus: 'Shared platters, famous roadside dhabas, woodfired pizza, and late-night chai stops',
    transportTip: 'Self-drive rental car or shared SUV to comfortably split fuel and toll costs',
    insiderTip: 'Use expense-splitting apps like Splitwise to settle group meals and cab fares transparently on the go.',
    packingItem: 'Bluetooth portable speaker, deck of cards, multiple USB car chargers, sunglasses'
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

/**
 * Destination-specific landmark banks for genuine itinerary customization
 */
const DESTINATION_KNOWLEDGE = {
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
  'spiti valley': {
    title: 'Spiti Valley — The Middle Land of Tibetan Buddhism',
    areas: ['Kaza Town', 'Tabo Village', 'Mud Village (Pin Valley)', 'Chandratal Lake Camp'],
    attractions: ['Key Monastery', 'Dhankar Fort & Monastery on cliff edge', 'Tabo 1000-year UNESCO Monastery', 'Hikkim World Highest Post Office', 'Komic Highest Motorrable Village', 'Chicham Bridge (Highest in Asia)', 'Chandratal Moon Lake'],
    foods: ['Tibetan Thukpa', 'Steamed Momos with fiery chili dip', 'Butter tea (Po Cha)', 'Himachali Siddu with ghee'],
    transit: 'Rugged 4x4 Bolero Camper or state HRTC buses navigating the Hindustan-Tibet Highway.',
    packing: ['Heavy windproof down jacket', 'High UV sunglasses', 'Diamox for AMS prevention', 'Plenty of cash (ATMs rare)']
  },
  chopta: {
    title: 'Chopta & Tungnath — Mini Switzerland of Uttarakhand',
    areas: ['Chopta Meadows Eco-camps', 'Sari Village Base', 'Ukhimath'],
    attractions: ['Tungnath Shiva Temple (World Highest at 3,680m)', 'Chandrashila Peak 360-degree Summit', 'Deoria Tal Emerald Lake trek', 'Rohini Bugyal meadows', 'Omkareshwar Temple Ukhimath'],
    foods: ['Pahadi Mandua (Ragi) Rotis', 'Gahat ki Dal (Horsegram soup)', 'Buransh (Rhododendron) floral juice', 'Hot ginger chai'],
    transit: 'Mountain taxi from Rishikesh/Haridwar via Rudraprayag, followed by scenic foot trekking.',
    packing: ['Thermal underlayers', 'Trekking poles with rubber tips', 'Sturdy high-traction shoes', 'Personal water bottle']
  },
  kerala: {
    title: 'Kerala Backwaters & Mist-Clad Tea Hills',
    areas: ['Munnar Tea Hills', 'Alleppey Backwaters', 'Fort Kochi Heritage Quarter', 'Varkala Cliff Beach'],
    attractions: ['Alleppey Houseboat / Shikara cruise', 'Munnar Eravikulam National Park (Nilgiri Tahr)', 'Mattupetty Dam', 'Fort Kochi Chinese Fishing Nets', 'Kathakali cultural performance', 'Periyar Wildlife Sanctuary (Thekkady)'],
    foods: ['Kerala Sadhya served on banana leaf', 'Appam with vegetable stew', 'Malabar Parotta', 'Karimeen Pollichathu (pearl spot fish)'],
    transit: 'Kerala State Road Transport Corporation (KSRTC) buses, passenger ferry boats (₹15), and auto-rickshaws.',
    packing: ['Light umbrella or rain poncho', 'Comfortable cotton resort wear', 'Natural mosquito repellent ointment']
  },
  goa: {
    title: 'Goa — Coastal Charms, Heritage Churches & Golden Sands',
    areas: ['Fontainhas Latin Quarter (Panaji)', 'Anjuna & Vagator (North)', 'Palolem & Agonda (South)'],
    attractions: ['Basilica of Bom Jesus (Old Goa)', 'Fort Aguada & Lighthouse', 'Dudhsagar Waterfalls jeep trek', 'Fontainhas colorful heritage walk', 'Palolem quiet crescent beach', 'Anjuna Flea Market'],
    foods: ['Goan Fish Curry Thali', 'Pao with Goan Mushroom/Chicken Xacuti', 'Bebinca multi-layered dessert', 'Fresh coconut water'],
    transit: 'Rented automatic gear scooter (₹350-₹500/day) or government Kadamba electric buses.',
    packing: ['Breathable linen/cotton shirts', 'Beach footwear', 'Reef-safe sunscreen', 'Valid driving license']
  },
  manali: {
    title: 'Manali & Solang — Pine Forests and Snow Peaks',
    areas: ['Old Manali Village', 'Mall Road & Model Town', 'Naggar Heritage Village', 'Solang Valley'],
    attractions: ['Hadimba Devi Ancient Cedar Temple', 'Solang Valley adventure ropeway', 'Atal Tunnel into Lahaul Sissu waterfall', 'Jogini Waterfalls nature trek', 'Naggar Castle & Roerich Art Gallery', 'Vashisht natural sulphur hot springs'],
    foods: ['Himachali Siddu stuffed with poppy seeds/dal', 'Trout fish delicacy', 'Tibetan Tingmo & shyabhale', 'Fresh Kullu apple cider'],
    transit: 'Shared local cabs, self-drive royal enfield motorcycles, or local HRTC valley shuttles.',
    packing: ['Insulated windproof jacket', 'Woollen gloves and cap', 'Water-resistant walking boots']
  },
  'char dham': {
    title: 'Holy Char Dham Circuit — Garhwal Himalayas',
    areas: ['Barkot (Yamunotri base)', 'Uttarkashi (Gangotri base)', 'Guptkashi/Sonprayag (Kedarnath base)', 'Joshimath (Badrinath base)'],
    attractions: ['Yamunotri Shrine & Surya Kund thermal spring', 'Gangotri Temple on the banks of Bhagirathi', 'Kedarnath Jyotirlinga surrounded by snow peaks', 'Badrinath Temple & Tapt Kund', 'Mana (Last Indian Village on Tibet border)', 'Bhairavnath Temple Kedarnath'],
    foods: ['Simple Satvik Khichdi and Dal-Roti', 'Warm ginger herbal tea', 'Pahadi sweet Arsa and Roat'],
    transit: 'Dedicated 4x4 mountain vehicles, GMVN pilgrimage coaches, or official yatra helicopter shuttles.',
    packing: ['Heavy thermal layers', 'Emergency rainwear', 'Trekking poles', 'Personal medical pouch with altitude pills']
  }
};

/**
 * Generate fully dynamic, category-specialized itinerary
 */
export function buildDynamicItinerary({
  startingLocation,
  destination,
  travellers = 2,
  days = 3,
  budget = null,
  travelDate = 'Upcoming',
  tripType = 'Family Trip',
  preferences = ''
}) {
  const numDays = Math.min(30, Math.max(1, parseInt(days) || 3));
  const numTravellers = Math.max(1, parseInt(travellers) || 1);
  const normalizedDest = destination.trim().toLowerCase();
  
  // Find closest matching destination knowledge or generate clean contextual landmarks
  let destMatch = null;
  for (const [key, data] of Object.entries(DESTINATION_KNOWLEDGE)) {
    if (normalizedDest.includes(key) || key.includes(normalizedDest)) {
      destMatch = data;
      break;
    }
  }

  const categoryMeta = CATEGORY_LOGIC[tripType] || CATEGORY_LOGIC['Family Trip'];

  // Calculate target daily budget per person
  const totalBudgetVal = budget ? Number(budget) : (numTravellers * numDays * 2200);
  const dailyTotalBudget = Math.round(totalBudgetVal / numDays);
  const dailyPerPersonBudget = Math.round(dailyTotalBudget / numTravellers);

  const itineraryDays = [];

  for (let d = 1; d <= numDays; d++) {
    let dayTheme = '';
    let morning = '';
    let afternoon = '';
    let evening = '';
    let places = [];
    let food = '';
    let accommodation = '';
    let transport = '';
    let insiderTip = '';

    if (destMatch) {
      const area = destMatch.areas[(d - 1) % destMatch.areas.length];
      accommodation = area;
      food = destMatch.foods[(d - 1) % destMatch.foods.length];
      transport = destMatch.transit;
      insiderTip = destMatch.transit.includes('walking') ? destMatch.transit : categoryMeta.insiderTip;

      if (d === 1) {
        dayTheme = `Arrival, Acclimatization & ${destMatch.attractions[0]}`;
        morning = `Depart from ${startingLocation} and arrive in ${destination}. Transfer to your base near ${area}, complete check-in, refresh, and get oriented with local surroundings.`;
        afternoon = `Enjoy a traditional lunch featuring ${destMatch.foods[0]}. Head out for your first landmark visit to ${destMatch.attractions[0]} with a certified local guide.`;
        evening = `Visit ${destMatch.attractions[1] || 'the scenic local promenade'}. Soak in the sunset atmosphere, capture photos, and enjoy dinner nearby.`;
        places = [destMatch.attractions[0], destMatch.attractions[1] || 'Central Town Promenade'];
      } else if (d === numDays) {
        dayTheme = `Scenic Highlights, Local Souvenirs & Departure`;
        morning = `Begin early with ${categoryMeta.morningFocus.toLowerCase()} at ${destMatch.attractions[(d * 2) % destMatch.attractions.length] || destMatch.attractions[2]}. Enjoy panoramic morning vistas.`;
        afternoon = `Explore local artisan bazaars near ${area}. Pick up authentic handcrafted souvenirs and savor ${food}. Pack bags and settle hotel dues.`;
        evening = `Conclude your ${tripType} journey. Transfer to railway station / airport with unforgettable memories of ${destination}. Return journey back to ${startingLocation}.`;
        places = [destMatch.attractions[(d * 2) % destMatch.attractions.length] || destMatch.attractions[2], 'Local Heritage Crafts Market'];
      } else {
        const attr1 = destMatch.attractions[((d - 1) * 2) % destMatch.attractions.length];
        const attr2 = destMatch.attractions[((d - 1) * 2 + 1) % destMatch.attractions.length] || destMatch.attractions[3];
        dayTheme = `${attr1.split(' ')[0]} Exploration & ${attr2.split(' ')[0]} Experience`;
        morning = `Kick off the day with ${categoryMeta.morningFocus.toLowerCase()}. Visit the iconic ${attr1} and learn about its geographical and cultural significance.`;
        afternoon = `Relish authentic ${food} at a reputed nearby dining establishment. Proceed to ${attr2} for an in-depth afternoon tour.`;
        evening = `${categoryMeta.eveningFocus}. Take a relaxed evening walk through picturesque alleys, enjoy local street delicacies, and review photos from the day.`;
        places = [attr1, attr2];
      }
    } else {
      // General dynamic generator for any world destination
      accommodation = `Central ${destination} Tourist District`;
      food = `Authentic regional delicacies and popular local chef recommendations in ${destination}`;
      transport = categoryMeta.transportTip;
      insiderTip = categoryMeta.insiderTip;

      if (d === 1) {
        dayTheme = `Arrival in ${destination} & Orientation Walk`;
        morning = `Journey from ${startingLocation} and check in to your stay in ${destination}. Rest, hydrate, and prepare for your ${tripType} itinerary.`;
        afternoon = `Explore the historical downtown and prominent civic square. Savor a wholesome regional lunch tailored for ${numTravellers} traveller(s).`;
        evening = `Sunset viewpoint stroll and scenic welcome dinner. Experience the vibrant evening pulse of ${destination}.`;
        places = [`Downtown ${destination} Plaza`, `Historic Landmark District`, `Sunset Riverfront / Hilltop`];
      } else if (d === numDays) {
        dayTheme = `Final Sightseeing, Artisan Bazaars & Departure`;
        morning = `Visit the renowned scenic observation viewpoint and cultural museum of ${destination} during morning quiet hours.`;
        afternoon = `Shop for authentic local spice, textile, or handcrafted souvenirs in the bustling old marketplace. Enjoy a memorable farewell lunch.`;
        evening = `Conclude your memorable ${tripType} journey. Transfer for departure back to ${startingLocation}.`;
        places = [`${destination} Cultural Gallery`, `Central Traditional Souvenir Bazaar`];
      } else {
        dayTheme = `Day ${d}: ${categoryMeta.themePrefix} Discovery`;
        morning = `${categoryMeta.morningFocus} across prime sightseeing points in ${destination}. Capture pristine photographs in the morning light.`;
        afternoon = `${categoryMeta.afternoonFocus}. Experience local culinary hospitality and discover hidden neighborhood gems.`;
        evening = `${categoryMeta.eveningFocus}. Enjoy a leisurely social dinner and prepare for the next day's explorations.`;
        places = [`${destination} Iconic Nature Sanctuary / Fort`, `${destination} Heritage Street`];
      }
    }

    itineraryDays.push({
      dayNumber: d,
      date: travelDate && travelDate !== 'Upcoming' ? `Day ${d} (${travelDate})` : `Day ${d}`,
      theme: dayTheme,
      morning,
      afternoon,
      evening,
      placesToVisit: places,
      recommendedFood: food,
      transportSuggestion: transport,
      estimatedDayExpense: Math.round(dailyTotalBudget),
      accommodationArea: accommodation,
      insiderTip
    });
  }

  // Highlights and summary customized to inputs
  const title = destMatch 
    ? `${numDays}-Day ${destMatch.title.split('—')[0].trim()} ${tripType}`
    : `${numDays}-Day Curated ${destination} ${tripType}`;

  const summary = `A tailor-made ${numDays}-day ${tripType.toLowerCase()} from ${startingLocation} to ${destination} designed for ${numTravellers} traveller(s). Optimized for a budget of ₹${totalBudgetVal.toLocaleString()}, balancing cultural depth, practical transit, and authentic local experiences.`;

  const tags = [
    tripType,
    `${numDays} Days`,
    `${numTravellers} ${numTravellers === 1 ? 'Solo Traveller' : 'Travellers'}`,
    budget && Number(budget) < 15000 ? 'Budget Friendly' : 'Value Assured'
  ];

  const packingList = [
    categoryMeta.packingItem,
    'Valid government photo ID & emergency contact printout',
    'High-capacity power bank & charging cables',
    'Personal prescription medicines and basic first-aid'
  ];

  if (destMatch?.packing) {
    packingList.unshift(...destMatch.packing);
  }

  const culturalEtiquette = [
    'Always ask respectfully before photographing local residents or spiritual monks.',
    'Remove shoes and leather belts where requested at religious and sacred shrines.',
    'Support local small family dhabas and artisans rather than mass tourist gift chains.'
  ];

  const transitAdvice = `Best connectivity between ${startingLocation} and ${destination}: Check train options (Sleeper/3AC for budget, Rajdhani/Vande Bharat for comfort) or state roadways buses for dependable mountain and valley journeys. Locally, rely on ${categoryMeta.transportTip.toLowerCase()}.`;

  return {
    tripTitle: title,
    summary,
    highlightTags: tags,
    days: itineraryDays,
    packingEssentials: Array.from(new Set(packingList)),
    culturalEtiquette,
    transitAdvice,
    estimatedTotalCost: totalBudgetVal
  };
}
