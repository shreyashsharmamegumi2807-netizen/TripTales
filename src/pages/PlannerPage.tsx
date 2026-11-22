import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Users, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  Loader2, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  Sun, 
  Utensils, 
  Hotel, 
  Lightbulb, 
  RotateCw, 
  Layers, 
  Heart,
  Download,
  Edit3,
  Bus,
  X,
  Check,
  Compass
} from 'lucide-react';
import { TripType, PlannerInputs, TripItinerary, BudgetBreakdown } from '../types';
import { generateItinerary } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface PlannerPageProps {
  openAuthModal: (mode: 'signin' | 'signup') => void;
  setActiveTab: (tab: string) => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ openAuthModal, setActiveTab }) => {
  const { user, saveTrip } = useAuth();

  // Form State
  const [startingLocation, setStartingLocation] = useState('New Delhi');
  const [destination, setDestination] = useState('Jaipur');
  const [travellers, setTravellers] = useState<number>(2);
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState<string>('8000');
  const [travelDate, setTravelDate] = useState<string>('Upcoming Weekend');
  const [tripType, setTripType] = useState<TripType>('Budget Travel');
  const [preferences, setPreferences] = useState('');

  // Execution State
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Result State
  const [generatedItinerary, setGeneratedItinerary] = useState<TripItinerary | null>(null);
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modify Itinerary Modal State
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editPreferences, setEditPreferences] = useState('');

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

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);
    setApiError(null);
    setSavedSuccess(false);

    if (!startingLocation.trim()) {
      setValidationError('Please enter your starting location.');
      return;
    }
    if (!destination.trim()) {
      setValidationError('Please enter your destination.');
      return;
    }
    if (travellers < 1) {
      setValidationError('Traveller count must be at least 1.');
      return;
    }
    if (days < 1 || days > 30) {
      setValidationError('Trip duration must be between 1 and 30 days.');
      return;
    }

    setIsLoading(true);

    try {
      const inputs: PlannerInputs = {
        startingLocation: startingLocation.trim(),
        destination: destination.trim(),
        travellers,
        days,
        budget: budget ? Number(budget) : null,
        travelDate: travelDate || undefined,
        tripType,
        preferences: preferences.trim() || undefined
      };

      const result = await generateItinerary(inputs);
      setGeneratedItinerary(result.itinerary);
      setBudgetBreakdown(result.budgetBreakdown);
    } catch (err: any) {
      console.error('Planner error:', err);
      setApiError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    if (!generatedItinerary) return;

    setIsSaving(true);
    try {
      await saveTrip({
        title: generatedItinerary.tripTitle || `${days}-Day ${destination} Journey`,
        destination: destination.trim(),
        startingLocation: startingLocation.trim(),
        travellers,
        days,
        budget: budgetBreakdown?.summary.totalBudget || (budget ? Number(budget) : 0),
        travelDate,
        tripType,
        preferences,
        itinerary: generatedItinerary,
        budgetBreakdown: budgetBreakdown || undefined
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert('Failed to save trip: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Open Modify Itinerary Modal
  const openModifyModal = () => {
    if (!generatedItinerary) return;
    setEditTitle(generatedItinerary.tripTitle);
    setEditSummary(generatedItinerary.summary);
    setEditPreferences(preferences);
    setIsModifyModalOpen(true);
  };

  // Save Modifications
  const applyModifications = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedItinerary) return;

    setGeneratedItinerary({
      ...generatedItinerary,
      tripTitle: editTitle,
      summary: editSummary
    });
    setPreferences(editPreferences);
    setIsModifyModalOpen(false);
  };

  // Download Itinerary as Clean PDF / Print View
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 no-print">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Itinerary Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
          AI Trip Planner
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Generate realistic, customized day-wise itineraries tailored for budget travel, spiritual pilgrimages, treks, adventures, and family holidays.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-8 no-print">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Error Message Banners */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {apiError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Starting Location */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Starting Location *
              </label>
              <div className="relative">
                <Navigation className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={startingLocation}
                  onChange={(e) => setStartingLocation(e.target.value)}
                  placeholder="e.g. Delhi, Mumbai, Bengaluru"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Destination *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-brand-primary" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Varanasi, Chopta, Jaipur, Kedarnath"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Travellers */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Travellers *
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={travellers}
                  onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Days */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Duration (Days) *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Total Budget Target */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Approx Total Budget (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 5000, 12000"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Travel Date / Month
              </label>
              <input
                type="text"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                placeholder="e.g. Next Weekend, October 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
              />
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Trip Category *
              </label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as TripType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all bg-white font-medium"
              >
                {tripTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Preferences */}
          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
              Specific Preferences / Dietary / Must-See Spots
            </label>
            <input
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. Vegetarian thalis only, student budget, avoid high-cost taxis, early morning temple darshan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-brand-muted">
              Select any category above to generate a specialized itinerary with verified places, local food, and economical transport.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm shadow-md hover:shadow-hover transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Itinerary Results Section (Rendered ONLY after user submission) */}
      {generatedItinerary && (
        <div id="printable-itinerary" className="space-y-8 animate-fade-in">
          
          {/* Header Action Bar */}
          <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {generatedItinerary.highlightTags?.map((tag, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-light text-brand-primary">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">
                {generatedItinerary.tripTitle}
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-2 max-w-3xl leading-relaxed">
                {generatedItinerary.summary}
              </p>
            </div>

            {/* Action Buttons: Regenerate, Modify, Save, Download PDF */}
            <div className="flex flex-wrap items-center gap-2.5 no-print">
              <button
                onClick={() => handleGenerate()}
                disabled={isLoading}
                className="px-3.5 py-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-brand-navy text-xs font-bold transition-all flex items-center space-x-1.5"
                title="Regenerate fresh alternative itinerary"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Regenerate</span>
              </button>

              <button
                onClick={openModifyModal}
                className="px-3.5 py-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-brand-navy text-xs font-bold transition-all flex items-center space-x-1.5"
                title="Modify itinerary details or preferences"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                <span>Modify</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="px-3.5 py-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-brand-navy text-xs font-bold transition-all flex items-center space-x-1.5"
                title="Print or save as PDF"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleSaveToDashboard}
                disabled={isSaving}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
                  savedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-primary hover:bg-brand-secondary text-white'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Integrated Affordable Budget Summary */}
          {budgetBreakdown && (
            <div className="bg-gradient-to-br from-brand-navy to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-700/80 gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-secondary">
                    Affordable Cost Estimate
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Estimated Trip Budget Breakdown
                  </h3>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-slate-300">Total Group Estimate</p>
                  <p className="text-2xl font-black text-white">
                    ₹{budgetBreakdown.summary.totalBudget.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ≈ ₹{budgetBreakdown.summary.perPersonTotal.toLocaleString()} / person ({budgetBreakdown.summary.travellers} travellers, {budgetBreakdown.summary.days} days)
                  </p>
                </div>
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgetBreakdown.categories.map((cat) => (
                  <div key={cat.id} className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">{cat.name}</span>
                      <span className="text-sm font-bold text-white">₹{cat.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {cat.assumption}
                    </p>
                    {cat.economicalAlternative && (
                      <p className="text-[10px] text-emerald-400 pt-1 font-medium">
                        💡 {cat.economicalAlternative}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Note: {budgetBreakdown.assumptionsNote}
              </p>
            </div>
          )}

          {/* Day-by-Day Detailed Itinerary */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-brand-navy flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-brand-primary" />
              <span>Day-by-Day Travel Schedule</span>
            </h3>

            <div className="space-y-6">
              {generatedItinerary.days?.map((day) => (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-8 space-y-5 page-break-inside-avoid"
                >
                  {/* Day Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-brand-border gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-10 h-10 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                        D{day.dayNumber}
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-brand-navy">
                          Day {day.dayNumber}: {day.theme}
                        </h4>
                        <p className="text-xs text-brand-muted">
                          Base: <span className="font-semibold text-brand-navy">{day.accommodationArea}</span>
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right text-xs">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Est. Day Cost: ₹{day.estimatedDayExpense.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Timeline Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Morning */}
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/70 space-y-2">
                      <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs">
                        <Sun className="w-4 h-4 text-amber-600" />
                        <span>Morning Activities</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {day.morning}
                      </p>
                    </div>

                    {/* Afternoon */}
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/70 space-y-2">
                      <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Afternoon Sightseeing</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {day.afternoon}
                      </p>
                    </div>

                    {/* Evening */}
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/70 space-y-2">
                      <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
                        <Utensils className="w-4 h-4 text-indigo-600" />
                        <span>Evening Experience</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {day.evening}
                      </p>
                    </div>
                  </div>

                  {/* Places to Visit Badges */}
                  {day.placesToVisit && day.placesToVisit.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-brand-navy uppercase tracking-wider block mb-2">
                        Key Places to Visit Today:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {day.placesToVisit.map((place, pIdx) => (
                          <span key={pIdx} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-brand-primary" />
                            <span>{place}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights, Food, Transport, and Tips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex items-start space-x-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <Utensils className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-brand-navy">Suggested Local Food: </span>
                        {day.recommendedFood}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <Bus className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-brand-navy">Transport Suggestion: </span>
                        {day.transportSuggestion}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5 text-xs text-slate-700 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
                      <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-900">Useful Travel Tip: </span>
                        {day.insiderTip}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Practical Logistics & Packing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 page-break-inside-avoid">
            
            {/* Packing Essentials */}
            <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 space-y-3">
              <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-primary" />
                <span>Packing Essentials</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {generatedItinerary.packingEssentials?.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cultural & Etiquette */}
            <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 space-y-3">
              <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Cultural Etiquette</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {generatedItinerary.culturalEtiquette?.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transit Advice */}
            <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 space-y-3">
              <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-amber-500" />
                <span>Transit Advice</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {generatedItinerary.transitAdvice}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Empty State before submission */}
      {!generatedItinerary && !isLoading && (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-brand-border bg-brand-bg/40 max-w-2xl mx-auto no-print">
          <div className="w-14 h-14 rounded-2xl bg-white border border-brand-border text-brand-primary mx-auto flex items-center justify-center shadow-subtle mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy">
            Your Custom Itinerary Will Appear Here
          </h3>
          <p className="text-xs text-brand-muted mt-1.5 max-w-md mx-auto">
            Choose any of the 10 categories above (Spiritual, Char Dham, Hiking, Adventure, Budget, Family) and click Generate Itinerary.
          </p>
        </div>
      )}

      {/* Modify Itinerary Modal */}
      {isModifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-elevated border border-brand-border p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setIsModifyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-brand-navy">
              Modify Itinerary Details
            </h3>

            <form onSubmit={applyModifications} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Trip Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Trip Summary
                </label>
                <textarea
                  rows={3}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Custom Preferences
                </label>
                <input
                  type="text"
                  value={editPreferences}
                  onChange={(e) => setEditPreferences(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModifyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-border hover:bg-slate-50 text-brand-navy font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
