import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Search, 
  Compass, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Navigation,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Plane,
  Train,
  Car,
  Plus,
  X,
  Clock,
  ShieldCheck,
  Camera,
  Bookmark,
  Home,
  MessageSquare
} from 'lucide-react';
import { HiddenGem, CommunityPost, TripType } from '../types';
import { fetchHiddenGems, fetchHiddenGemDetail, publishCommunityPost, likeCommunityPost } from '../lib/api';

interface HiddenGemsPageProps {
  setActiveTab: (tab: string) => void;
}

export const HiddenGemsPage: React.FC<HiddenGemsPageProps> = ({ setActiveTab }) => {
  const [gems, setGems] = useState<HiddenGem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Destination Detail view state
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);
  const [currentGem, setCurrentGem] = useState<HiddenGem | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Favourites state (stored in localStorage)
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('triptales_favourite_gems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Community post UI state
  const [expandedPlanPostIds, setExpandedPlanPostIds] = useState<Set<string>>(new Set());
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New post form state
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newStartingLocation, setNewStartingLocation] = useState('');
  const [newTripType, setNewTripType] = useState<TripType>('Hiking / Trekking');
  const [newDays, setNewDays] = useState<number>(3);
  const [newBudget, setNewBudget] = useState<number>(5000);
  const [newExperience, setNewExperience] = useState('');
  const [newTips, setNewTips] = useState('');
  const [newDay1, setNewDay1] = useState('');
  const [newDay2, setNewDay2] = useState('');
  const [newDay3, setNewDay3] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  const categories = [
    'All',
    'Spiritual / Bhakti',
    'Adventure',
    'Cultural and historical travel',
    'Nature and wildlife',
    'Hiking / Trekking'
  ];

  const tripTypes: TripType[] = [
    'Spiritual / Bhakti',
    'Char Dham Yatra',
    'Hiking / Trekking',
    'Adventure',
    'Nature and Wildlife',
    'Historical and Cultural',
    'Family Trip',
    'Solo Trip',
    'Friends Trip',
    'Budget Travel'
  ];

  // Load catalog gems
  useEffect(() => {
    async function loadGems() {
      setIsLoading(true);
      try {
        const data = await fetchHiddenGems(selectedCategory, searchQuery);
        setGems(data);
      } catch (err) {
        console.error('Failed to load hidden gems:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!selectedGemId) {
      loadGems();
    }
  }, [selectedCategory, searchQuery, selectedGemId]);

  // Load detail when a gem is selected
  useEffect(() => {
    if (!selectedGemId) {
      setCurrentGem(null);
      return;
    }

    async function loadDetail() {
      setIsLoadingDetail(true);
      setDetailError(null);
      try {
        const detail = await fetchHiddenGemDetail(selectedGemId!);
        setCurrentGem(detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err: any) {
        setDetailError(err.message || 'Failed to load destination profile.');
      } finally {
        setIsLoadingDetail(false);
      }
    }

    loadDetail();
  }, [selectedGemId]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle favourite
  const toggleFavourite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (favouriteIds.includes(id)) {
      updated = favouriteIds.filter(item => item !== id);
      showToast('Removed from favourites');
    } else {
      updated = [...favouriteIds, id];
      showToast('Saved to your favourite destinations');
    }
    setFavouriteIds(updated);
    try {
      localStorage.setItem('triptales_favourite_gems', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  // Toggle plan visibility for a post
  const togglePlanExpansion = (postId: string) => {
    setExpandedPlanPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  // Like a community post
  const handleLikePost = async (postId: string) => {
    if (!currentGem || likedPostIds.has(postId)) return;

    // Optimistic UI update
    setLikedPostIds(prev => new Set(prev).add(postId));
    if (currentGem.communityPosts) {
      setCurrentGem({
        ...currentGem,
        communityPosts: currentGem.communityPosts.map(p => 
          p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
        )
      });
    }

    try {
      await likeCommunityPost(currentGem.id, postId);
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  // Share destination link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Destination link copied to clipboard!');
    } else {
      showToast('Share link ready!');
    }
  };

  // Submit community travel post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGem) return;

    if (!newAuthorName.trim() || !newStartingLocation.trim() || !newExperience.trim()) {
      showToast('Please fill in author name, starting city, and your travel experience.');
      return;
    }

    setIsSubmittingPost(true);
    try {
      const tipsArray = newTips
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const dayPlans = [];
      if (newDay1.trim()) dayPlans.push({ dayNumber: 1, title: 'Arrival & Scenic Discovery', highlights: newDay1.trim() });
      if (newDay2.trim()) dayPlans.push({ dayNumber: 2, title: 'Main Sightseeing & Activities', highlights: newDay2.trim() });
      if (newDay3.trim()) dayPlans.push({ dayNumber: 3, title: 'Local Flavours & Return Journey', highlights: newDay3.trim() });

      const newPost = await publishCommunityPost(currentGem.id, {
        authorName: newAuthorName.trim(),
        days: newDays,
        budget: newBudget,
        startingLocation: newStartingLocation.trim(),
        tripType: newTripType,
        dayWisePlan: dayPlans.length > 0 ? dayPlans : [
          { dayNumber: 1, title: 'Arrival & Exploration', highlights: 'Checked into local homestay and explored the pristine landscape.' }
        ],
        photos: currentGem.images && currentGem.images.length > 0 ? [currentGem.images[0]] : [currentGem.image],
        experience: newExperience.trim(),
        tips: tipsArray.length > 0 ? tipsArray : ['Start early in the morning and carry comfortable walking shoes.']
      });

      // Update current gem's community posts
      setCurrentGem(prev => prev ? {
        ...prev,
        communityPosts: [newPost, ...(prev.communityPosts || [])]
      } : null);

      setShareModalOpen(false);
      // Reset form
      setNewAuthorName('');
      setNewStartingLocation('');
      setNewExperience('');
      setNewTips('');
      setNewDay1('');
      setNewDay2('');
      setNewDay3('');
      showToast('Your travel story has been published to the community!');
    } catch (err: any) {
      showToast(err.message || 'Failed to publish post');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Helper to extract expense string safely
  const getBudgetDisplay = (gem: any) => {
    return gem.estimatedBudget?.budgetPerDay || gem.approximateExpenses?.budgetPerDay || '₹1,500 - ₹2,500/day';
  };

  const getStayDisplay = (gem: any) => {
    return gem.estimatedBudget?.stay || gem.approximateExpenses?.stay || 'Homestays & lodges: ₹800 - ₹1,500/night';
  };

  const getFoodDisplay = (gem: any) => {
    return gem.estimatedBudget?.food || gem.approximateExpenses?.food || 'Local eateries: ₹300 - ₹600/day';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-navy text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: DESTINATION DETAIL VIEW                          */}
      {/* ======================================================== */}
      {selectedGemId ? (
        isLoadingDetail ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-brand-navy">Loading verified destination profile & community stories...</p>
          </div>
        ) : detailError || !currentGem ? (
          <div className="bg-white rounded-3xl border border-red-200 p-8 text-center space-y-4">
            <h3 className="text-lg font-bold text-red-600">Could not load destination</h3>
            <p className="text-xs text-brand-muted">{detailError || 'Destination not found.'}</p>
            <button
              onClick={() => setSelectedGemId(null)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-secondary transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Destinations</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Navigation Bar for Details */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-brand-border">
              <button
                onClick={() => setSelectedGemId(null)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-brand-border text-brand-navy hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-brand-primary" />
                <span>Back to All Destinations</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleFavourite(currentGem.id)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    favouriteIds.includes(currentGem.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-brand-border text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favouriteIds.includes(currentGem.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  <span>{favouriteIds.includes(currentGem.id) ? 'Saved in Favourites' : 'Save Favourite'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-brand-border text-brand-navy hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Destination Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-brand-border bg-brand-navy text-white">
              <div className="relative h-72 sm:h-96 w-full">
                <img
                  src={currentGem.image}
                  alt={currentGem.name}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-primary text-white shadow-xs">
                      {currentGem.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {currentGem.state}
                    </span>
                    {currentGem.recommendedDuration && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md text-slate-200">
                        {currentGem.recommendedDuration}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                    {currentGem.name}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-200 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>{currentGem.location}</span>
                  </p>
                </div>
              </div>

              {/* Photo Strip Gallery */}
              {currentGem.images && currentGem.images.length > 1 && (
                <div className="p-4 bg-slate-900/80 border-t border-white/10 flex items-center space-x-3 overflow-x-auto">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1 uppercase tracking-wider pl-2">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Gallery</span>
                  </span>
                  {currentGem.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${currentGem.name} photo ${idx + 1}`}
                      className="w-20 h-14 sm:w-28 sm:h-18 object-cover rounded-xl border border-white/20 hover:opacity-100 opacity-80 transition-opacity flex-shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <div className="flex items-center space-x-2 text-brand-primary mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Best Season</span>
                </div>
                <p className="text-xs font-semibold text-brand-navy">{currentGem.bestTimeToVisit}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <div className="flex items-center space-x-2 text-emerald-600 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Est. Budget</span>
                </div>
                <p className="text-xs font-semibold text-brand-navy">{getBudgetDisplay(currentGem)}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <div className="flex items-center space-x-2 text-amber-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Ideal Duration</span>
                </div>
                <p className="text-xs font-semibold text-brand-navy">{currentGem.recommendedDuration || '3 to 4 Days'}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <div className="flex items-center space-x-2 text-blue-600 mb-1">
                  <Navigation className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Nearest Transit</span>
                </div>
                <p className="text-xs font-semibold text-brand-navy truncate">{currentGem.nearestTransit}</p>
              </div>
            </div>

            {/* Destination Details & Logistics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Cols: About, Why Visit, How to Reach, Nearby Attractions */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* About & Why Visit */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-5">
                  <div>
                    <h2 className="text-xl font-black text-brand-navy mb-2 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-brand-primary" />
                      <span>About {currentGem.name}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
                      {currentGem.about || currentGem.description}
                    </p>
                  </div>

                  {currentGem.whyVisit && (
                    <div className="pt-4 border-t border-brand-border">
                      <h3 className="text-sm font-bold text-brand-navy mb-1.5 flex items-center space-x-2 text-brand-primary">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Why Visit This Hidden Gem</span>
                      </h3>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        {currentGem.whyVisit}
                      </p>
                    </div>
                  )}

                  {/* Recommended Activities */}
                  {currentGem.recommendedActivities && currentGem.recommendedActivities.length > 0 && (
                    <div className="pt-4 border-t border-brand-border space-y-2.5">
                      <h3 className="text-sm font-bold text-brand-navy">Recommended Activities</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentGem.recommendedActivities.map((act, idx) => (
                          <div key={idx} className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                            <span className="w-5 h-5 rounded-full bg-brand-light text-brand-primary font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="text-slate-700 font-medium">{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* How to Reach Section */}
                {currentGem.howToReach && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
                    <h2 className="text-lg font-black text-brand-navy flex items-center space-x-2">
                      <Navigation className="w-5 h-5 text-brand-primary" />
                      <span>How to Reach {currentGem.name}</span>
                    </h2>

                    <div className="space-y-3 pt-2">
                      {currentGem.howToReach.air && (
                        <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                          <Plane className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-brand-navy block">By Air</span>
                            <span className="text-brand-muted">{currentGem.howToReach.air}</span>
                          </div>
                        </div>
                      )}

                      {currentGem.howToReach.rail && (
                        <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                          <Train className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-brand-navy block">By Rail / Train</span>
                            <span className="text-brand-muted">{currentGem.howToReach.rail}</span>
                          </div>
                        </div>
                      )}

                      {currentGem.howToReach.road && (
                        <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                          <Car className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-brand-navy block">By Road / State Bus</span>
                            <span className="text-brand-muted">{currentGem.howToReach.road}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Nearby Attractions */}
                {currentGem.nearbyAttractions && currentGem.nearbyAttractions.length > 0 && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-4">
                    <h2 className="text-lg font-black text-brand-navy flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-brand-primary" />
                      <span>Nearby Attractions & Excursions</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {currentGem.nearbyAttractions.map((attr, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                          <Compass className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 font-semibold">{attr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right 1 Col: Budget Breakdown, Stay Options, Essential Travel Tips */}
              <div className="space-y-6">
                
                {/* Affordable Budget Breakdown */}
                <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle space-y-4">
                  <h3 className="text-base font-black text-brand-navy flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Realistic Expenses</span>
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">Daily Estimate</span>
                      <span className="text-xs font-bold text-emerald-900">{getBudgetDisplay(currentGem)}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-700 uppercase block">Accommodation</span>
                      <span className="text-slate-600">{getStayDisplay(currentGem)}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-700 uppercase block">Local Food</span>
                      <span className="text-slate-600">{getFoodDisplay(currentGem)}</span>
                    </div>
                  </div>
                </div>

                {/* Accommodation Suggestions */}
                {currentGem.accommodationSuggestions && currentGem.accommodationSuggestions.length > 0 && (
                  <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle space-y-4">
                    <h3 className="text-base font-black text-brand-navy flex items-center space-x-2">
                      <Home className="w-4 h-4 text-brand-primary" />
                      <span>Stay Options</span>
                    </h3>

                    <div className="space-y-3">
                      {currentGem.accommodationSuggestions.map((stay, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-brand-navy">{stay.name}</span>
                            {stay.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-light text-brand-primary">
                                {stay.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{stay.type}</p>
                          <p className="text-xs font-semibold text-emerald-600">{stay.priceRange}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Essential Tips */}
                <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle space-y-4">
                  <h3 className="text-base font-black text-brand-navy flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Traveler Tips</span>
                  </h3>

                  <ul className="space-y-2 text-xs">
                    {(currentGem.importantTips || currentGem.travelTips).map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-slate-600">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

            {/* ======================================================== */}
            {/* COMMUNITY TRAVEL POSTS SECTION                           */}
            {/* ======================================================== */}
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-card space-y-8">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-light text-brand-primary">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Traveler Community</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                    Real Trips Planned to {currentGem.name}
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Authentic travel stories, routes, and day-wise itineraries shared by travelers who explored this destination.
                  </p>
                </div>

                <button
                  onClick={() => setShareModalOpen(true)}
                  className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-secondary transition-all shadow-sm flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Share Your Trip Experience</span>
                </button>
              </div>

              {/* Community Posts List */}
              {(!currentGem.communityPosts || currentGem.communityPosts.length === 0) ? (
                <div className="py-12 text-center space-y-3">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-brand-muted">No community posts yet. Be the first to share your journey to {currentGem.name}!</p>
                  <button
                    onClick={() => setShareModalOpen(true)}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    + Share your experience now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentGem.communityPosts.map((post) => {
                    const isPlanExpanded = expandedPlanPostIds.has(post.id);
                    const isLiked = likedPostIds.has(post.id);

                    return (
                      <div
                        key={post.id}
                        className="bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 hover:border-slate-300 transition-all shadow-xs"
                      >
                        {/* Author Profile & Trip Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                              alt={post.authorName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <h4 className="text-sm font-bold text-brand-navy">{post.authorName}</h4>
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                              </div>
                              <span className="text-[11px] text-brand-muted">
                                Traveled from <span className="font-semibold text-slate-700">{post.startingLocation}</span>
                              </span>
                            </div>
                          </div>

                          {/* Quick Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white border border-slate-200 text-brand-navy">
                              {post.days} Days
                            </span>
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                              ₹{post.budget.toLocaleString('en-IN')} Spent
                            </span>
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-brand-light text-brand-primary">
                              {post.tripType}
                            </span>
                          </div>
                        </div>

                        {/* Experience Prose */}
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          "{post.experience}"
                        </p>

                        {/* Photos Gallery in post */}
                        {post.photos && post.photos.length > 0 && (
                          <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                            {post.photos.map((photo, pIdx) => (
                              <img
                                key={pIdx}
                                src={photo}
                                alt={`Trip highlight ${pIdx + 1}`}
                                className="w-32 h-20 sm:w-44 sm:h-28 object-cover rounded-2xl border border-slate-200 flex-shrink-0"
                              />
                            ))}
                          </div>
                        )}

                        {/* Traveler Tips Tags */}
                        {post.tips && post.tips.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Tips from {post.authorName}</span>
                            <div className="flex flex-wrap gap-2">
                              {post.tips.map((tip, tIdx) => (
                                <span key={tIdx} className="px-2.5 py-1 rounded-xl text-[11px] bg-white border border-slate-200 text-slate-700">
                                  💡 {tip}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Day-Wise Travel Plan Accordion */}
                        {post.dayWisePlan && post.dayWisePlan.length > 0 && (
                          <div className="pt-2 border-t border-slate-200">
                            <button
                              onClick={() => togglePlanExpansion(post.id)}
                              className="w-full flex items-center justify-between text-xs font-bold text-brand-primary hover:text-brand-navy py-1.5 transition-colors"
                            >
                              <span className="flex items-center space-x-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{isPlanExpanded ? 'Hide Travel Plan' : 'View Travel Plan (Day-by-Day Schedule)'}</span>
                              </span>
                              {isPlanExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {isPlanExpanded && (
                              <div className="mt-3 space-y-2.5 pl-2 border-l-2 border-brand-light animate-in fade-in duration-200">
                                {post.dayWisePlan.map((day) => (
                                  <div key={day.dayNumber} className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="w-5 h-5 rounded-full bg-brand-navy text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                        D{day.dayNumber}
                                      </span>
                                      <h5 className="font-bold text-brand-navy">{day.title}</h5>
                                    </div>
                                    <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
                                      {day.highlights}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Post Actions: Like & Share */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                              isLiked
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                            <span>{post.likes || 0} Likes</span>
                          </button>

                          <span className="text-[11px] text-slate-400">
                            Posted {post.createdAt}
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        )
      ) : (

        /* ======================================================== */
        /* VIEW 2: ALL HIDDEN GEMS CATALOG                          */
        /* ======================================================== */
        <div className="space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Off-Beat Escapes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Discover Hidden Gems
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted">
              Explore pristine valleys, high Himalayan sanctuaries, and ancient canyons. Click any destination to view verified travel details, realistic budgets, and community trip stories.
            </p>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white rounded-3xl border border-brand-border shadow-card p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search gems by name or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-xs outline-none"
              />
            </div>

          </div>

          {/* Gems Grid */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-brand-muted">Loading verified destinations...</p>
            </div>
          ) : gems.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-brand-border p-8">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-brand-navy">No destinations found</h3>
              <p className="text-xs text-brand-muted mt-1">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gems.map((gem) => {
                const isFav = favouriteIds.includes(gem.id);

                return (
                  <div
                    key={gem.id}
                    onClick={() => setSelectedGemId(gem.id)}
                    className="bg-white rounded-3xl border border-brand-border shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                  >
                    {/* Photo with overlay */}
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={gem.image}
                        alt={gem.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-sm text-brand-navy shadow-sm">
                          {gem.category}
                        </span>
                      </div>

                      {/* Favourite toggle icon */}
                      <button
                        onClick={(e) => toggleFavourite(gem.id, e)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors shadow-xs"
                        title={isFav ? 'Remove favourite' : 'Save to favourites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
                      </button>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-black">{gem.name}</h3>
                        <p className="text-xs text-slate-200 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
                          <span className="truncate">{gem.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      
                      <p className="text-xs text-brand-text leading-relaxed line-clamp-3">
                        {gem.description}
                      </p>

                      {/* Best time & expenses */}
                      <div className="space-y-2 pt-2 border-t border-brand-border text-xs">
                        <div className="flex items-start space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-brand-navy">Best Season: </span>
                            <span className="text-brand-muted">{gem.bestTimeToVisit}</span>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-brand-navy">Est. Expenses: </span>
                            <span className="text-brand-muted">{getBudgetDisplay(gem)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Travel Tips Snippet */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center space-x-1.5 text-brand-navy font-bold text-[10px] uppercase tracking-wide">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>Insider Insight</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                          {gem.travelTips && gem.travelTips[0]}
                        </p>
                      </div>

                      {/* Action Button: Opens Destination Detail */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-brand-muted">
                          {gem.state}
                        </span>
                        <span className="text-xs font-bold text-brand-primary group-hover:text-brand-navy flex items-center space-x-1 transition-colors">
                          <span>Explore Stories</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SHARE YOUR TRIP EXPERIENCE                        */}
      {/* ======================================================== */}
      {shareModalOpen && currentGem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-brand-border shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div>
                <h3 className="text-lg font-black text-brand-navy">Share Your Trip Experience</h3>
                <p className="text-xs text-brand-muted">Publish your journey to {currentGem.name} for the community.</p>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-brand-navy block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-navy block mb-1">Starting Location (Origin) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi or Mumbai"
                    value={newStartingLocation}
                    onChange={(e) => setNewStartingLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-brand-navy block mb-1">Trip Type</label>
                  <select
                    value={newTripType}
                    onChange={(e) => setNewTripType(e.target.value as TripType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary outline-none bg-white"
                  >
                    {tripTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-brand-navy block mb-1">Days Spent</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newDays}
                    onChange={(e) => setNewDays(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-navy block mb-1">Total Spent (₹)</label>
                  <input
                    type="number"
                    min={500}
                    step={100}
                    value={newBudget}
                    onChange={(e) => setNewBudget(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-brand-navy block mb-1">Travel Experience & Story *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share how you traveled, what you felt, key memories, and scenic highlights..."
                  value={newExperience}
                  onChange={(e) => setNewExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-brand-navy block mb-1">Helpful Tips (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Start early before 7 AM&#10;Carry cash as ATMs are sparse"
                  value={newTips}
                  onChange={(e) => setNewTips(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary outline-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-brand-border">
                <label className="font-bold text-brand-navy block">Day-by-Day Highlights (Optional)</label>
                <input
                  type="text"
                  placeholder="Day 1: Arrival & evening walk..."
                  value={newDay1}
                  onChange={(e) => setNewDay1(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-primary outline-none text-xs"
                />
                <input
                  type="text"
                  placeholder="Day 2: Main exploration & viewpoints..."
                  value={newDay2}
                  onChange={(e) => setNewDay2(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-primary outline-none text-xs"
                />
                <input
                  type="text"
                  placeholder="Day 3: Sunrise hike & return..."
                  value={newDay3}
                  onChange={(e) => setNewDay3(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-primary outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-secondary transition-all disabled:opacity-50"
                >
                  {isSubmittingPost ? 'Publishing...' : 'Publish Experience'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
