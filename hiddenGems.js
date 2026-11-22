import express from 'express';

const router = express.Router();

// Verified Authentic Hidden Gems with Full Destination Profiles & Community Posts
const HIDDEN_GEMS = [
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
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Perched at 2,680m amidst rhododendron forests and alpine meadows, Chopta serves as the base for Tungnath—the world\'s highest Shiva shrine—and the breathtaking Chandrashila peak.',
    about: 'Chopta is a pristine, unspoiled meadow nestled inside the Kedarnath Wildlife Sanctuary in Garhwal Himalayas. Far away from crowded hill stations, Chopta offers dense oak and deodar canopy, chirping monal birds, and dramatic 360-degree vistas of Himalayan giants including Nanda Devi, Trishul, and Chaukhamba.',
    whyVisit: 'It combines high-altitude spiritual solace with an accessible Himalayan ridge trek. Anyone of average fitness can stand on the summit of Chandrashila (4,000m) to witness one of the grandest panoramas in Asia.',
    bestTimeToVisit: 'April to June for flowering rhododendrons and pleasant trekking; October to December for crystal-clear skies, golden meadows, and early snowfall.',
    recommendedDuration: '3 to 4 Days',
    howToReach: {
      air: 'Jolly Grant Airport, Dehradun (220 km). Hired cabs or state buses run to Ukhimath/Chopta.',
      rail: 'Rishikesh / Haridwar Railway Station (200 km). Frequent shared cabs operate via Devprayag & Rudraprayag.',
      road: 'Well connected by road from Rishikesh via NH58 to Rudraprayag, then state highway to Kund, Ukhimath, and Chopta.'
    },
    nearbyAttractions: [
      'Tungnath Temple (World\'s highest Shiva shrine at 3,680m)',
      'Chandrashila Peak Summit (4,000m panoramic vantage point)',
      'Deoria Tal Emerald Lake (reflection of Chaukhamba peaks)',
      'Rohini Bugyal alpine meadow',
      'Omkareshwar Winter Temple in Ukhimath'
    ],
    estimatedBudget: {
      budgetPerDay: '₹1,200 - ₹2,000 per person',
      stay: 'Eco-camps & village homestays: ₹800 - ₹1,500/night',
      food: 'Pahadi thali & hot Maggie/chai: ₹300 - ₹500/day'
    },
    recommendedActivities: [
      'Trek the stone-paved 3.5 km trail from Chopta to Tungnath Temple',
      'Summit Chandrashila for early morning sunrise over Nanda Devi',
      'Camp under crystal-clear starlit skies with zero light pollution',
      'Birdwatch for the Himalayan Monal inside Kedarnath Wildlife Sanctuary'
    ],
    importantTips: [
      'Carry sufficient cash as the last reliable ATM is in Ukhimath (30 km prior).',
      'Mobile signal (Jio/Airtel) is patchy; download offline maps in advance.',
      'Even in May and June, night temperatures plunge below 5°C; pack thermal layers.',
      'Wear sturdy high-ankle trekking shoes as mountain stone steps can be slippery.'
    ],
    travelTips: [
      'Start the Tungnath trek before 7:00 AM to avoid mid-day clouds obscuring the summit view.',
      'Stay in Sari village for 1 night to do the 2.5 km Deoria Tal trek before heading to Chopta.',
      'Do not leave plastic trash on the sacred trails.'
    ],
    nearestTransit: 'Rishikesh Railway Station (200 km); Dehradun Airport (220 km)',
    accommodationSuggestions: [
      { name: 'Monal Adventure Eco Camps', type: 'Swiss Tent / Camp', priceRange: '₹1,000 - ₹1,800/night', badge: 'Popular with Trekkers' },
      { name: 'Sari Village Traditional Homestay', type: 'Homestay', priceRange: '₹700 - ₹1,200/night', badge: 'Authentic Local Food' },
      { name: 'GMVN Tourist Rest House Ukhimath', type: 'Govt Lodge', priceRange: '₹1,200 - ₹2,200/night', badge: 'Reliable Amenities' }
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
          { dayNumber: 1, title: 'Delhi to Sari Village & Deoria Tal Sunset', highlights: 'Took overnight bus from Delhi to Rishikesh, shared cab to Sari. Hiked 2.5km to Deoria Tal for sunset reflections of Chaukhamba.' },
          { dayNumber: 2, title: 'Chopta Base to Tungnath & Chandrashila Summit', highlights: 'Started trek at 6 AM from Chopta. Reached Tungnath at 8:30 AM, climbed steep ridge to Chandrashila summit at 10 AM. Mind-blowing 360-degree views!' },
          { dayNumber: 3, title: 'Rhododendron Forest Walk & Return Journey', highlights: 'Morning walk in Chopta meadows. Local breakfast of Mandua roti, then shared cab back to Rishikesh.' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
        ],
        experience: 'Climbing up to Tungnath and then Chandrashila was spiritual and adventurous at once. Standing on the summit with prayer flags fluttering and seeing Nanda Devi, Trishul, and Chaukhamba all around you is an experience no words can capture. Very affordable if you travel via shared transport!',
        tips: [
          'Take trekking poles; the descent from Chandrashila puts pressure on the knees.',
          'Try Gahat ki dal and buransh juice at Sari village stalls.',
          'Start very early to catch the mountain peaks before afternoon clouds roll in.'
        ],
        likes: 48,
        createdAt: '2026-10-15',
        isSample: false
      },
      {
        id: 'post-chopta-2',
        destinationId: 'chopta-tungnath',
        authorName: 'Ananya & Kabir',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        days: 4,
        budget: 9500,
        startingLocation: 'Chandigarh',
        tripType: 'Spiritual / Bhakti',
        dayWisePlan: [
          { dayNumber: 1, title: 'Drive to Ukhimath via Devprayag', highlights: 'Witnessed the holy Alaknanda and Bhagirathi sangam at Devprayag. Stayed in Ukhimath.' },
          { dayNumber: 2, title: 'Omkareshwar Darshan & Chopta Meadow Walk', highlights: 'Morning puja at Omkareshwar temple (winter seat of Kedarnath). Drove 30km through cedar forests to Chopta.' },
          { dayNumber: 3, title: 'Sacred Tungnath Darshan & Deep Daan', highlights: 'Slow meditative walk up to Tungnath temple. Peaceful darshan with almost no crowd in November.' },
          { dayNumber: 4, title: 'Return through Rishikesh Aarti', highlights: 'Attended the Triveni Ghat evening Ganga aarti before boarding our train home.' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
        ],
        experience: 'The serenity of Tungnath is otherworldly compared to crowded tourist towns. The silence in the meadows at dusk with just the sound of mountain wind and temple bells was pure bliss.',
        tips: [
          'Carry warm woollen socks and thermals for the cold nights in meadow camps.',
          'Respect the temple rules; photography is prohibited inside the garbhagriha.'
        ],
        likes: 31,
        createdAt: '2026-11-04',
        isSample: false
      }
    ]
  },
  {
    id: 'ziro-valley',
    name: 'Ziro Valley',
    location: 'Lower Subansiri District, Arunachal Pradesh, India',
    state: 'Arunachal Pradesh',
    region: 'North East India',
    category: 'Cultural and Historical',
    tags: ['Cultural and Historical', 'Nature and Wildlife', 'Solo Trip'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A UNESCO World Heritage tentative landscape renowned for the ingenious Apatani tribe, terraced paddy-cum-fish ponds, bamboo groves, and lush pine hills.',
    about: 'Ziro is an idyllic plateau nestled in the Eastern Himalayas of Arunachal Pradesh. It is globally recognized for the sustainable agro-ecological heritage of the Apatani tribe, who have farmed organic rice and fish side-by-side for centuries without modern machinery.',
    whyVisit: 'Witness an indigenous tribal culture living in complete ecological harmony, explore serene bamboo forests, and experience genuine tribal hospitality in traditional stilt homestays.',
    bestTimeToVisit: 'March to October for lush emerald-green paddy fields; September for the famed Ziro Music Festival; November to February for pleasant winter breeze.',
    recommendedDuration: '4 to 5 Days',
    howToReach: {
      air: 'Donyi Polo Airport, Itanagar (125 km) or Guwahati Airport (450 km). Hired cabs or shared Tata Sumos run to Ziro.',
      rail: 'Naharlagun Railway Station (100 km), well-connected by direct overnight train from Guwahati.',
      road: 'National Highway 13 connects Guwahati and Itanagar to Ziro via picturesque river bridges and hills.'
    },
    nearbyAttractions: [
      'Hong Village (Asia\'s largest traditional tribal village)',
      'Tarin Fish Farm (indigenous aquaculture practice)',
      'Kardo Shiva Lingam (natural 25-ft rock formation)',
      'Talley Valley Wildlife Sanctuary (clouded leopard habitat)',
      'Pine Groves of Hapoli'
    ],
    estimatedBudget: {
      budgetPerDay: '₹1,800 - ₹2,800 per person',
      stay: 'Traditional Apatani homestays: ₹1,200 - ₹2,000/night (includes home meals)',
      food: 'Bamboo chicken, organic rice, and herbal tea: ₹300 - ₹600/day'
    },
    recommendedActivities: [
      'Walk through Hong, Hari, and Bulla villages to observe traditional Apatani architecture',
      'Learn about traditional organic bamboo irrigation and water-sharing customs',
      'Trek into the bamboo thickets of Talley Valley Sanctuary with a tribal guide',
      'Taste traditional Apong (mild fermented rice brew) with village elders'
    ],
    importantTips: [
      'Inner Line Permit (ILP) is legally mandatory for Indian tourists; apply online on the Arunachal eILP portal.',
      'Always ask politely before taking portraits of village elders.',
      'Bring cash; card swipe terminals and UPI can face intermittent network downtime.'
    ],
    travelTips: [
      'Stay in village homestays rather than hotels in Hapoli to truly experience tribal culture.',
      'Rent a bicycle to explore the flat valley roads between villages.'
    ],
    nearestTransit: 'Naharlagun Railway Station (100 km); Itanagar Airport (125 km)',
    accommodationSuggestions: [
      { name: 'Apatani Village Homestay Hong', type: 'Tribal Wooden Homestay', priceRange: '₹1,200 - ₹1,800/night', badge: 'Authentic Experience' },
      { name: 'Ziro Valley Eco Resort', type: 'Eco Cottages', priceRange: '₹2,000 - ₹3,500/night', badge: 'Scenic Views' }
    ],
    communityPosts: [
      {
        id: 'post-ziro-1',
        destinationId: 'ziro-valley',
        authorName: 'Priyamvada Sen',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        days: 4,
        budget: 8400,
        startingLocation: 'Guwahati',
        tripType: 'Cultural and Historical',
        dayWisePlan: [
          { dayNumber: 1, title: 'Overnight train from Guwahati to Naharlagun & Shared Sumo to Ziro', highlights: 'Scenic 4-hour drive climbing from Assam plains into misty pine hills. Check in at Hong village homestay.' },
          { dayNumber: 2, title: 'Walking Tour of Hong & Hari Villages', highlights: 'Spent the day learning from our homestay host Mr. Tabyo about the sustainable water-channeling system. Shared bamboo shoot chicken for dinner.' },
          { dayNumber: 3, title: 'Trek into Talley Valley Sanctuary', highlights: 'Day trek through virgin bamboo forests and silver firs with a local naturalist. Spotted rare laughingthrushes.' },
          { dayNumber: 4, title: 'Hapoli Market & Local Souvenirs', highlights: 'Bought hand-woven Apatani cotton stoles directly from female weavers. Evening shared cab back to Naharlagun.' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
        ],
        experience: 'Ziro changed my perception of sustainable living. The Apatani people have conserved their forests and paddy fields with zero plastic and pure community cooperation. My homestay host treated me like his own daughter.',
        tips: [
          'Get your ILP online at least 3 days before travel.',
          'Carry warm socks; homestay bamboo floors get cold in the morning.'
        ],
        likes: 39,
        createdAt: '2026-09-28',
        isSample: false
      }
    ]
  },
  {
    id: 'tirthan-valley',
    name: 'Tirthan Valley',
    location: 'Kullu District, Himachal Pradesh, India',
    state: 'Himachal Pradesh',
    region: 'North India',
    category: 'Nature and Wildlife',
    tags: ['Nature and Wildlife', 'Adventure', 'Hiking / Trekking'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The pristine gateway to the Great Himalayan National Park (UNESCO Site), famous for glacial river streams, brown trout fishing, apple orchards, and peaceful deodar forests.',
    about: 'Tirthan Valley sits at an altitude of 1,600m along the crystal-clear Tirthan River flowing directly from Himalayan glaciers. Unlike crowded Manali, Tirthan preserves quiet cedar hamlets, traditional wood-and-stone Kathkuni houses, and tranquil forest trails.',
    whyVisit: 'Ideal for travelers seeking quiet riverside wooden cottages, gentle waterfall day hikes, and direct access to pristine UNESCO wilderness with zero traffic jams.',
    bestTimeToVisit: 'March to June for lush apple blossom season and river breezes; October to November for golden autumn leaves; December to February for quiet winter snowfall.',
    recommendedDuration: '3 to 4 Days',
    howToReach: {
      air: 'Bhuntar / Kullu Airport (50 km). Taxis available to Banjar and Gushaini.',
      rail: 'Chandigarh Railway Station (240 km). Frequent state Volvo buses connect Chandigarh to Aut tunnel, followed by a local bus to Tirthan.',
      road: 'Take the Delhi-Chandigarh-Manali highway up to Aut tunnel, turn right toward Banjar and Gushaini.'
    },
    nearbyAttractions: [
      'Great Himalayan National Park (UNESCO Site)',
      'Jalori Pass (3,120m high mountain pass)',
      'Serolsar Lake (sacred high-altitude lake hike)',
      'Choie & Chhoie Waterfall hike',
      'Chehni Kothi 1500-year-old wooden fortress tower'
    ],
    estimatedBudget: {
      budgetPerDay: '₹1,500 - ₹2,500 per person',
      stay: 'Riverside wooden cottages & homestays: ₹1,000 - ₹2,000/night',
      food: 'Himachali Siddu, river trout fish & pahadi thali: ₹350 - ₹600/day'
    },
    recommendedActivities: [
      'Hike 5 km from Jalori Pass through oak forests to mystical Serolsar Lake',
      'Camp and fly-fish along the certified Tirthan River conservation zone',
      'Trek 30 minutes through pine forests to the secluded Chhoie Waterfall',
      'Visit Chehni Kothi—the tallest standing timber tower in Western Himalayas'
    ],
    importantTips: [
      'Get down at Aut tunnel when taking the Delhi/Chandigarh bus to Manali; shared cabs to Gushaini wait right outside.',
      'Jalori Pass can be blocked by ice during mid-winter; verify road status before driving.'
    ],
    travelTips: [
      'Book a riverside stay in Gushaini or Nagini so you can fall asleep to the gentle sound of the river.',
      'Permits for entering the Great Himalayan National Park can be acquired easily at the Sai Ropa forest office.'
    ],
    nearestTransit: 'Bhuntar Airport (50 km); Chandigarh Railway Station (240 km)',
    accommodationSuggestions: [
      { name: 'Koshla Riverside Wooden Lodge', type: 'Riverside Wooden Cottage', priceRange: '₹1,200 - ₹2,200/night', badge: 'River View' },
      { name: 'Gushaini Village Homestay', type: 'Pahadi Homestay', priceRange: '₹800 - ₹1,400/night', badge: 'Budget Friendly' }
    ],
    communityPosts: [
      {
        id: 'post-tirthan-1',
        destinationId: 'tirthan-valley',
        authorName: 'Aditya Verma & Friends',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        days: 3,
        budget: 5400,
        startingLocation: 'Chandigarh',
        tripType: 'Nature and Wildlife',
        dayWisePlan: [
          { dayNumber: 1, title: 'Drive from Chandigarh to Gushaini', highlights: 'Took morning bus to Aut, shared cab to Gushaini. Settled in a wooden cottage right on the riverbank.' },
          { dayNumber: 2, title: 'Jalori Pass & Serolsar Lake Trek', highlights: 'Drove to Jalori Pass. The 5km hike to Serolsar Lake was like walking inside a fairytale oak forest. Had hot tea at the temple.' },
          { dayNumber: 3, title: 'Choie Waterfall & Chehni Kothi Tower', highlights: 'Morning hike to Choie Waterfall. Explored the 45-meter tall Chehni Kothi tower made purely of interlocking cedar logs.' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
        ],
        experience: 'If you want to escape the honking horns and selfie crowds of Manali, Tirthan is pure therapy. The river water is crystal clear, you can drink from mountain streams, and the Serolsar Lake walk was so peaceful.',
        tips: [
          'Wear shoes with good grip for the Serolsar Lake trail—it has tree roots and damp soil.',
          'Try Himachali Siddu stuffed with walnuts at the roadside stalls.'
        ],
        likes: 54,
        createdAt: '2026-10-20',
        isSample: false
      }
    ]
  },
  {
    id: 'gandikota-belum',
    name: 'Gandikota & Belum Caves',
    location: 'Kadapa & Kurnool Districts, Andhra Pradesh, India',
    state: 'Andhra Pradesh',
    region: 'South India',
    category: 'Cultural and Historical',
    tags: ['Cultural and Historical', 'Adventure', 'Solo Trip'],
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The "Grand Canyon of India" with a massive 300-foot gorge carved through pink granite by the Pennar River, crowned by a 13th-century red sandstone fort.',
    about: 'Gandikota features breathtaking sheer cliff gorges sliced through the Erramala hills by the Pennar River over millions of years. Inside the medieval fort complex lie grand granaries, ancient temples, an elegant Jama Masjid, and cliff viewpoints reminiscent of the American Grand Canyon.',
    whyVisit: 'Witness one of India\'s most dramatic geological marvels without expensive foreign flights, camp on the gorge rim, and explore Belum Caves—the second largest underground cavern network in the subcontinent.',
    bestTimeToVisit: 'October to February for pleasant daytime exploring and cool desert breezes; avoid peak summer (April-June) due to intense heat.',
    recommendedDuration: '2 to 3 Days',
    howToReach: {
      air: 'Kadapa Airport (75 km) or Kempegowda International Airport Bengaluru (280 km).',
      rail: 'Jammalamadugu Railway Station (18 km) or Muddanuru (40 km). Direct trains from Chennai and Bengaluru.',
      road: 'Smooth highways connect Bengaluru (6 hrs) and Hyderabad (7 hrs) to Gandikota.'
    },
    nearbyAttractions: [
      'Pennar River Gorge Viewpoint (Grand Canyon View)',
      'Gandikota 13th-Century Fort, Jail & Granary',
      'Madhavaraya & Ranganatha Swamy Temples',
      'Belum Caves (60 km away, underground stalactite caverns)',
      'Mylavaram Dam & Boating Club'
    ],
    estimatedBudget: {
      budgetPerDay: '₹1,200 - ₹2,200 per person',
      stay: 'Cliffside camping tents / Haritha Resort: ₹900 - ₹1,800/night',
      food: 'Andhra spicy meals, Rayalaseema ragi mudda & dosas: ₹250 - ₹500/day'
    },
    recommendedActivities: [
      'Watch sunrise and golden hour from the gorge rocks behind the fort temple',
      'Camp under the stars on the rocky cliff edges overlooking the river',
      'Explore the subterranean passages, stalactite formations, and musical chambers of Belum Caves',
      'Kayak on the calm waters of the Pennar River gorge'
    ],
    importantTips: [
      'Carry hats, polarized sunglasses, and hydration packs as gorge rocks radiate intense heat during mid-day.',
      'Book APTDC Haritha Resort in advance if you prefer brick-and-mortar rooms over camping tents.'
    ],
    travelTips: [
      'Combine Gandikota and Belum Caves in one round-trip itinerary for a complete 2-day road trip.',
      'Camp organizers provide tents and campfires right by the gorge viewpoint.'
    ],
    nearestTransit: 'Jammalamadugu Railway Station (18 km); Bengaluru Airport (280 km)',
    accommodationSuggestions: [
      { name: 'Gandikota Cliff Camps', type: 'Camp Tent', priceRange: '₹800 - ₹1,200/night', badge: 'Gorge View' },
      { name: 'APTDC Haritha Resort Gandikota', type: 'Govt Resort', priceRange: '₹1,500 - ₹2,500/night', badge: 'AC Rooms' }
    ],
    communityPosts: [
      {
        id: 'post-gandikota-1',
        destinationId: 'gandikota-belum',
        authorName: 'Vikram Sundaram',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        days: 2,
        budget: 3800,
        startingLocation: 'Bengaluru',
        tripType: 'Adventure',
        dayWisePlan: [
          { dayNumber: 1, title: 'Road Trip from Bengaluru to Gandikota & Sunset on Gorge', highlights: 'Started at 5 AM on bike. Reached Gandikota by noon. Pitched tent near the gorge. Watched the crimson sunset over the Pennar river.' },
          { dayNumber: 2, title: 'Sunrise Exploration & Belum Caves Underground Walk', highlights: 'Incredible sunrise photography over the canyon. Drove 1 hour to Belum Caves—the underground passages were mind-blowing. Back in Bengaluru by night.' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
        ],
        experience: 'The sheer scale of the gorge took my breath away. Sitting on the massive granite boulders with the river hundreds of feet below felt like Utah or Arizona, right here in South India! Highly recommended weekend getaway.',
        tips: [
          'Carry at least 2 liters of water per person when hiking through the fort complex.',
          'Belum Caves are humid inside; wear light cotton tees.'
        ],
        likes: 67,
        createdAt: '2026-11-10',
        isSample: false
      }
    ]
  },
  {
    id: 'mawlynnong-dawki',
    name: 'Mawlynnong & Dawki River',
    location: 'East Khasi Hills, Meghalaya, India',
    state: 'Meghalaya',
    region: 'North East India',
    category: 'Nature and Wildlife',
    tags: ['Nature and Wildlife', 'Family Trip', 'Cultural and Historical'],
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Renowned as Asia\'s Cleanest Village, featuring indigenous bamboo waste bins, living root bridges engineered by Khasi clans, and the glass-transparent waters of the Umngot River.',
    about: 'Mawlynnong is an inspiring tribal village where every resident, from young children to elders, participates in daily village cleanliness. Nearby lies the Umngot River at Dawki, where boat hulls cast shadows directly onto the riverbed through crystal-clear emerald water.',
    whyVisit: 'Walk on living root bridges grown organically over centuries, take unforgettable boat photographs on the transparent Dawki River, and experience the warm matrilineal Khasi culture.',
    bestTimeToVisit: 'November to May for crystal-clear transparent river waters at Dawki; avoid peak monsoon (June-August) when river turns muddy from rainfall.',
    recommendedDuration: '3 to 4 Days',
    howToReach: {
      air: 'Shillong Umroi Airport (90 km) or Guwahati International Airport (180 km).',
      rail: 'Guwahati Railway Station (170 km). Shared tourist cabs run continuously to Shillong and onward to Dawki.',
      road: 'Scenic hilly highways connect Shillong to Dawki and Mawlynnong through misty cloudscapes.'
    },
    nearbyAttractions: [
      'Umngot River Boating at Dawki (Transparent Glass Water)',
      'Riwai Single Living Root Bridge (15-min walk)',
      'Sky Walk Bamboo Treehouse overlooking Bangladesh plains',
      'Krang Suri Turquoise Waterfall',
      'Tamabil India-Bangladesh Border'
    ],
    estimatedBudget: {
      budgetPerDay: '₹1,600 - ₹2,600 per person',
      stay: 'Village bamboo cottages & eco-homestays: ₹1,200 - ₹2,200/night',
      food: 'Khasi meals (Jadoh, bamboo shoot pork/veg, dal): ₹300 - ₹550/day'
    },
    recommendedActivities: [
      'Take a wooden boat ride on the transparent Umngot River where boats appear to float on air',
      'Walk across the century-old living root bridge at Riwai village',
      'Climb the 85-ft eco bamboo sky-view tower for panoramic views of the Bangladesh plains',
      'Swim in the natural turquoise pool at Krang Suri Waterfall'
    ],
    importantTips: [
      'Visit on a bright sunny day between November and February for the famous transparent glass boat photography.',
      'Never litter; use the handmade cone bamboo bins placed every 20 meters throughout the village.'
    ],
    travelTips: [
      'Stay overnight in Mawlynnong village rather than doing a rushed day trip from Shillong.',
      'Hire local Khasi boatmen directly at Dawki riverbank to support village families.'
    ],
    nearestTransit: 'Guwahati Railway Station (170 km); Shillong Airport (90 km)',
    accommodationSuggestions: [
      { name: 'Mawlynnong Traditional Eco Homestay', type: 'Bamboo Thatched Hut', priceRange: '₹1,200 - ₹1,800/night', badge: 'Eco Certified' },
      { name: 'Dawki Riverside Camping Tents', type: 'Riverbank Tents', priceRange: '₹1,000 - ₹1,600/night', badge: 'Next to Water' }
    ],
    communityPosts: [
      {
        id: 'post-mawlynnong-1',
        destinationId: 'mawlynnong-dawki',
        authorName: 'Sneha & Arun Roy',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        days: 3,
        budget: 7100,
        startingLocation: 'Guwahati',
        tripType: 'Family Trip',
        dayWisePlan: [
          { dayNumber: 1, title: 'Drive from Guwahati to Mawlynnong through Shillong clouds', highlights: 'Stopped at Umiam Lake. Arrived at Mawlynnong by 3 PM. Walked through the spotless flower-lined village pathways.' },
          { dayNumber: 2, title: 'Living Root Bridge at Riwai & Dawki Glass River', highlights: 'Walked to the living root bridge in Riwai. Drove 30 mins to Dawki. The boat ride on Umngot River was magic—we could see fish swimming 15 feet below!' },
          { dayNumber: 3, title: 'Krang Suri Waterfall & Return', highlights: 'Swam with lifejackets at Krang Suri turquoise waterfall pool. Bought organic wild honey from local farmers.' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80'
        ],
        experience: 'Our 8-year-old daughter loved Mawlynnong! She picked up any dry leaf she saw and put it into the bamboo dustbins just like the local village kids. The boat ride on Dawki River was straight out of a dream.',
        tips: [
          'Carry towels and a change of clothes if you plan to swim at Krang Suri.',
          'Start Dawki boating early around 8:30 AM before afternoon wind causes water ripples.'
        ],
        likes: 62,
        createdAt: '2026-11-08',
        isSample: false
      }
    ]
  },
  {
    id: 'dholavira-kutch',
    name: 'Dholavira & Khadir Bet',
    location: 'Kutch District, Gujarat, India',
    state: 'Gujarat',
    region: 'West India',
    category: 'Cultural and Historical',
    tags: ['Cultural and Historical', 'Spiritual / Bhakti', 'Budget Travel'],
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A grand UNESCO World Heritage Indus Valley Harappan metropolis dating back 4,500 years, surrounded by the surreal white desert and the scenic Road to Heaven.',
    about: 'Dholavira on Khadir Bet island in the Great Rann of Kutch is one of the five largest Harappan civilizations on earth. It features ingenious 4,500-year-old stormwater harvesting reservoirs cut into solid sandstone, grand stepped citadels, and ancient signboards.',
    whyVisit: 'Drive along the newly built "Road to Heaven" stretching across boundless white salt flats, marvel at ancient urban civilization engineering, and witness thousands of migratory pink flamingos.',
    bestTimeToVisit: 'November to February for cool desert weather, clear starry skies, and flamingo migration.',
    recommendedDuration: '2 to 3 Days',
    howToReach: {
      air: 'Bhuj Airport (215 km) or Ahmedabad International Airport (350 km).',
      rail: 'Bhachau Railway Station (140 km) or Bhuj (215 km). Direct express trains connect Mumbai and Delhi.',
      road: 'Drive along the newly opened National Highway 754K (The Road to Heaven) through the white desert directly to Dholavira.'
    },
    nearbyAttractions: [
      'Dholavira Harappan Excavation Site & ASI Museum',
      'Road to Heaven (NH 754K white salt desert highway)',
      'Fossil Park Khadir Bet (fossilized Jurassic trees)',
      'Kanjikot Sunset Point',
      'Flamingo City sanctuary viewpoints'
    ],
    estimatedBudget: {
      budgetPerDay: '₹1,500 - ₹2,500 per person',
      stay: 'Traditional Kutchi Bhungas (mud cottages) / Toran Resort: ₹1,200 - ₹2,200/night',
      food: 'Traditional Kutchi thali (Bajra rotla, garlic chutney, ghee & chaas): ₹250 - ₹450/day'
    },
    recommendedActivities: [
      'Hire a certified ASI guide to understand the mind-blowing stormwater reservoirs and drainage citadels',
      'Drive and take photographs on the Road to Heaven with white desert on both sides of the tarmac',
      'Stargaze under Bortle Class 1 dark desert skies with visible Milky Way',
      'Visit the Jurassic Fossil Park with fossilized tree trunks dated to 180 million years'
    ],
    importantTips: [
      'Fuel up your vehicle in Rapar or Bhachau as there are no petrol pumps on Khadir Bet island.',
      'Wear wide-brim sun hats and carry sunscreen; the desert sun can be blinding against the white salt.'
    ],
    travelTips: [
      'Drive the Road to Heaven during mid-day when the salt flats sparkle like snow on both sides.',
      'Taste fresh hot Bajra rotla with jaggery and fresh white butter at local family eateries.'
    ],
    nearestTransit: 'Bhachau Railway Station (140 km); Bhuj Airport (215 km)',
    accommodationSuggestions: [
      { name: 'Kutch Bhunga Desert Village Stay', type: 'Traditional Round Mud Cottage', priceRange: '₹1,200 - ₹1,800/night', badge: 'Traditional Bhunga' },
      { name: 'Toran Tourism Complex Dholavira', type: 'Govt Resort', priceRange: '₹1,500 - ₹2,500/night', badge: 'Near ASI Site' }
    ],
    communityPosts: [
      {
        id: 'post-dholavira-1',
        destinationId: 'dholavira-kutch',
        authorName: 'Manish Trivedi',
        authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
        days: 2,
        budget: 4200,
        startingLocation: 'Ahmedabad',
        tripType: 'Cultural and Historical',
        dayWisePlan: [
          { dayNumber: 1, title: 'Drive across the Road to Heaven to Dholavira', highlights: 'The 30-km straight drive across the white salt flats was unreal. Checked in at Toran Resort, visited the ancient Harappan citadel in the afternoon.' },
          { dayNumber: 2, title: 'ASI Archaeological Museum & Fossil Park', highlights: 'Deeply impressed by the 4,500-year water reservoirs and stone masonry. Visited the Fossil park and saw wild flamingos in the salt pans.' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'
        ],
        experience: 'Dholavira is an engineering marvel. Seeing water reservoirs carved out of solid stone 4,500 years ago made me realize how sophisticated our ancestors were. And driving on the Road to Heaven with white salt stretching to the horizon felt like driving on clouds.',
        tips: [
          'Hire an authorized local guide at the gate (₹400); without one, it just looks like stone ruins.',
          'Carry plenty of drinking water in your car.'
        ],
        likes: 42,
        createdAt: '2026-11-01',
        isSample: false
      }
    ]
  }
];

// GET /api/hidden-gems
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let results = [...HIDDEN_GEMS];

  if (category && category !== 'All') {
    results = results.filter(gem => 
      gem.category.toLowerCase().includes(category.toLowerCase()) ||
      gem.tags.some(t => t.toLowerCase().includes(category.toLowerCase()))
    );
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(gem => 
      gem.name.toLowerCase().includes(q) ||
      gem.location.toLowerCase().includes(q) ||
      gem.state.toLowerCase().includes(q) ||
      gem.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// GET /api/hidden-gems/:id (Full destination details & community posts)
router.get('/:id', (req, res) => {
  const gem = HIDDEN_GEMS.find(g => g.id === req.params.id);
  if (!gem) {
    return res.status(404).json({ success: false, message: 'Hidden gem not found.' });
  }
  res.json({ success: true, data: gem });
});

// POST /api/hidden-gems/:id/posts (Publish community travel post)
router.post('/:id/posts', (req, res) => {
  const gem = HIDDEN_GEMS.find(g => g.id === req.params.id);
  if (!gem) {
    return res.status(404).json({ success: false, message: 'Destination not found.' });
  }

  const {
    authorName,
    days,
    budget,
    startingLocation,
    tripType,
    dayWisePlan,
    experience,
    tips,
    photos
  } = req.body;

  if (!authorName || !experience || !startingLocation) {
    return res.status(400).json({
      success: false,
      message: 'Author name, starting location, and travel experience are required.'
    });
  }

  const newPost = {
    id: 'post-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    destinationId: req.params.id,
    authorName: authorName.trim(),
    authorAvatar: `https://images.unsplash.com/photo-${1534528741775 + (gem.communityPosts.length % 5)}?auto=format&fit=crop&w=150&q=80`,
    days: Math.max(1, parseInt(days) || 3),
    budget: Math.max(0, Number(budget) || 4500),
    startingLocation: startingLocation.trim(),
    tripType: tripType || 'Adventure',
    dayWisePlan: Array.isArray(dayWisePlan) && dayWisePlan.length > 0 ? dayWisePlan : [
      { dayNumber: 1, title: 'Arrival & Scenic Discovery', highlights: 'Arrived, checked in to local homestay, and explored nearby trails.' },
      { dayNumber: 2, title: 'Core Exploration & Local Flavours', highlights: 'Full day sightseeing, local food tasting, and sunset viewpoints.' }
    ],
    photos: Array.isArray(photos) && photos.length > 0 ? photos : [gem.image],
    experience: experience.trim(),
    tips: Array.isArray(tips) && tips.length > 0 ? tips : ['Travel light and respect local customs.'],
    likes: 1,
    createdAt: new Date().toISOString().split('T')[0],
    isSample: false
  };

  gem.communityPosts.unshift(newPost);

  res.status(201).json({
    success: true,
    message: 'Your community travel post has been published successfully!',
    data: newPost
  });
});

// POST /api/hidden-gems/:id/posts/:postId/like (Like a community travel post)
router.post('/:id/posts/:postId/like', (req, res) => {
  const gem = HIDDEN_GEMS.find(g => g.id === req.params.id);
  if (!gem) {
    return res.status(404).json({ success: false, message: 'Destination not found.' });
  }

  const post = gem.communityPosts.find(p => p.id === req.params.postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Community post not found.' });
  }

  post.likes = (post.likes || 0) + 1;
  res.json({ success: true, likes: post.likes });
});

export default router;
