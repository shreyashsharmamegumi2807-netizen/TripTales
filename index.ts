export type TravelStyle = 'budget' | 'moderate' | 'luxury';

export type TripType =
  | 'Spiritual / Bhakti'
  | 'Char Dham Yatra'
  | 'Hiking / Trekking'
  | 'Adventure'
  | 'Nature and Wildlife'
  | 'Historical and Cultural'
  | 'Family Trip'
  | 'Solo Trip'
  | 'Friends Trip'
  | 'Budget Travel';

export interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  perPerson: number;
  isShared: boolean;
  assumption: string;
  economicalAlternative?: string;
  potentialSavings?: number;
}

export interface BudgetSummary {
  travellers: number;
  days: number;
  nights: number;
  rooms: number;
  travelStyle: string;
  totalBudget: number;
  perPersonTotal: number;
  currency: string;
  userBudget?: number | null;
  remainingBudget?: number | null;
  budgetStatus?: 'surplus' | 'deficit' | 'balanced';
}

export interface CheaperAlternative {
  category: string;
  currentOption: string;
  suggestedAlternative: string;
  estimatedSavings: number;
  tip: string;
}

export interface BudgetBreakdown {
  summary: BudgetSummary;
  categories: BudgetCategory[];
  cheaperAlternatives?: CheaperAlternative[];
  assumptionsNote: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
  placesToVisit: string[];
  recommendedFood: string;
  transportSuggestion: string;
  estimatedDayExpense: number;
  accommodationArea: string;
  insiderTip: string;
}

export interface TripItinerary {
  tripTitle: string;
  summary: string;
  highlightTags: string[];
  days: ItineraryDay[];
  packingEssentials: string[];
  culturalEtiquette: string[];
  transitAdvice: string;
  estimatedTotalCost?: number;
}

export interface PlannerInputs {
  startingLocation: string;
  destination: string;
  travellers: number;
  days: number;
  budget?: number | null;
  travelDate?: string;
  tripType: TripType;
  preferences?: string;
}

export interface SavedTrip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startingLocation: string;
  travellers: number;
  days: number;
  budget: number;
  travelDate?: string;
  tripType: TripType;
  preferences?: string;
  itinerary: TripItinerary;
  budgetBreakdown?: BudgetBreakdown;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  tripTitle: string;
  destination: string;
  travelDate?: string;
  memories: string;
  highlights?: string;
  rating: number;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    condition: string;
    icon: string;
    updatedAt: string;
  };
  forecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    rainProbability: number;
    condition: string;
    icon: string;
  }>;
  provider: string;
}

export interface CommunityPost {
  id: string;
  destinationId: string;
  authorName: string;
  authorAvatar?: string;
  days: number;
  budget: number;
  startingLocation: string;
  tripType: TripType;
  dayWisePlan: Array<{
    dayNumber: number;
    title: string;
    highlights: string;
  }>;
  photos: string[];
  experience: string;
  tips: string[];
  likes: number;
  createdAt: string;
  isSample?: boolean;
}

export interface AccommodationOption {
  name: string;
  type: string;
  priceRange: string;
  badge?: string;
}

export interface HiddenGem {
  id: string;
  name: string;
  location: string;
  state: string;
  region: string;
  category: string;
  tags: string[];
  image: string;
  images?: string[];
  description: string;
  about?: string;
  whyVisit?: string;
  bestTimeToVisit: string;
  approximateExpenses: {
    budgetPerDay: string;
    stay: string;
    food: string;
  };
  howToReach?: {
    air: string;
    rail: string;
    road: string;
  };
  nearbyAttractions?: string[];
  recommendedDuration?: string;
  recommendedActivities?: string[];
  importantTips?: string[];
  travelTips: string[];
  nearestTransit: string;
  accommodationSuggestions?: AccommodationOption[];
  communityPosts?: CommunityPost[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}
