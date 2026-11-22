import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Users, 
  Calendar, 
  Hotel, 
  Utensils, 
  Car, 
  RotateCcw,
  Info,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Sparkles,
  Train,
  Bus,
  Plane,
  AlertTriangle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { TravelStyle, BudgetBreakdown } from '../types';
import { calculateBudget } from '../lib/api';

export const BudgetPage: React.FC = () => {
  // Input State
  const [travellers, setTravellers] = useState<number>(2);
  const [days, setDays] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('budget');
  const [userBudget, setUserBudget] = useState<string>('6000');

  // Custom Overrides (optional fine-tuning)
  const [customTransport, setCustomTransport] = useState<string>('');
  const [customHotel, setCustomHotel] = useState<string>('');
  const [customFood, setCustomFood] = useState<string>('');
  const [customActivities, setCustomActivities] = useState<string>('');
  const [customLocalTransit, setCustomLocalTransit] = useState<string>('');
  const [customOther, setCustomOther] = useState<string>('');
  const [customRooms, setCustomRooms] = useState<string>('');

  // Result state
  const [calculation, setCalculation] = useState<BudgetBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger recalculation deterministically whenever inputs change
  useEffect(() => {
    async function updateCalculations() {
      setIsLoading(true);
      try {
        const result = await calculateBudget({
          travellers: Math.max(1, travellers),
          days: Math.max(1, days),
          travelStyle,
          userBudget: userBudget ? Number(userBudget) : null,
          transportationTotal: customTransport ? Number(customTransport) : null,
          accommodationPerNight: customHotel ? Number(customHotel) : null,
          foodPerDayPerPerson: customFood ? Number(customFood) : null,
          activitiesPerDayPerPerson: customActivities ? Number(customActivities) : null,
          localTransportPerDayTotal: customLocalTransit ? Number(customLocalTransit) : null,
          otherExpensesTotal: customOther ? Number(customOther) : null,
          rooms: customRooms ? Number(customRooms) : null,
        });
        setCalculation(result);
      } catch (err) {
        console.error('Calculation error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    updateCalculations();
  }, [
    travellers, 
    days, 
    travelStyle, 
    userBudget,
    customTransport, 
    customHotel, 
    customFood, 
    customActivities, 
    customLocalTransit, 
    customOther, 
    customRooms
  ]);

  const resetOverrides = () => {
    setCustomTransport('');
    setCustomHotel('');
    setCustomFood('');
    setCustomActivities('');
    setCustomLocalTransit('');
    setCustomOther('');
    setCustomRooms('');
  };

  const transportComparisons = [
    { mode: 'IRCTC Sleeper Class (SL)', costPerPerson: '₹450 - ₹750', duration: 'Overnight', badge: 'Best for Students', icon: Train },
    { mode: 'State Transport Ordinary / Express Bus', costPerPerson: '₹550 - ₹900', duration: 'Flexible Schedules', badge: 'No Advance Booking', icon: Bus },
    { mode: 'IRCTC AC 3-Tier (3A)', costPerPerson: '₹1,200 - ₹1,800', duration: 'Overnight AC', badge: 'Balanced Comfort', icon: Train },
    { mode: 'Domestic Flight (Economy)', costPerPerson: '₹3,500 - ₹7,000', duration: '1.5 - 2.5 hrs', badge: 'Fastest Travel', icon: Plane }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-primary">
          <Calculator className="w-3.5 h-3.5" />
          <span>Affordable & Realistic Planning</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
          Smart Travel Budget Planner
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Plan economical, realistic trips inspired by MakeMyTrip's budget travel options. Compare sleeper trains, verified hostels, local thalis, and calculate your remaining savings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <h3 className="text-base font-bold text-brand-navy">
              Trip Parameters
            </h3>
            <button
              onClick={resetOverrides}
              className="text-xs font-semibold text-brand-primary hover:text-brand-navy flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Custom Rates</span>
            </button>
          </div>

          {/* User Target Budget Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider">
              Your Target Total Budget (₹)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600" />
              <input
                type="number"
                step="500"
                placeholder="e.g. 5000, 8000, 15000"
                value={userBudget}
                onChange={(e) => setUserBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none font-semibold text-brand-navy"
              />
            </div>
            <p className="text-[11px] text-brand-muted">
              Enter what you wish to spend; TripTales adapts categories to fit within your budget.
            </p>
          </div>

          {/* Travellers Slider / Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
              <span className="flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-brand-primary" />
                <span>Number of Travellers</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-brand-light text-brand-primary">
                {travellers} {travellers === 1 ? 'person' : 'people'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={travellers}
              onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
              className="w-full accent-brand-primary cursor-pointer"
            />
          </div>

          {/* Days Slider / Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-brand-primary" />
                <span>Trip Duration</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-brand-light text-brand-primary">
                {days} days ({days > 1 ? days - 1 : 1} nights)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              className="w-full accent-brand-primary cursor-pointer"
            />
          </div>

          {/* Travel Style Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider">
              Travel Tier / Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['budget', 'moderate', 'luxury'] as TravelStyle[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                    travelStyle === style
                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Granular Adjustments */}
          <div className="pt-4 border-t border-brand-border space-y-4">
            <p className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Fine-Tune Custom Estimates (Optional)
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Total Intercity Travel (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={customTransport}
                  onChange={(e) => setCustomTransport(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-border focus:border-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Stay / Night / Room (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 900"
                  value={customHotel}
                  onChange={(e) => setCustomHotel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-border focus:border-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Rooms Needed</label>
                <input
                  type="number"
                  min="1"
                  placeholder={`Auto: ${Math.ceil(travellers / 2)}`}
                  value={customRooms}
                  onChange={(e) => setCustomRooms(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-border focus:border-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Food / Person / Day (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 350"
                  value={customFood}
                  onChange={(e) => setCustomFood(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-border focus:border-brand-primary outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Calculation Results Display */}
        <div className="lg:col-span-7 space-y-6">
          
          {calculation && (
            <>
              {/* Grand Total & Remaining Budget Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Total Estimated Cost */}
                <div className="bg-brand-navy text-white rounded-3xl p-5 shadow-card space-y-2">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    Estimated Trip Cost
                  </span>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    ₹{calculation.summary.totalBudget.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    For {calculation.summary.travellers} traveller(s) • {calculation.summary.days} days
                  </p>
                </div>

                {/* Cost Per Person */}
                <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-card space-y-2">
                  <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block">
                    Cost Per Person
                  </span>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-brand-primary">
                    ₹{calculation.summary.perPersonTotal.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-brand-muted">
                    {calculation.summary.rooms} room(s) @ 2 per room
                  </p>
                </div>

                {/* Remaining Budget / Savings */}
                <div className={`border rounded-3xl p-5 shadow-card space-y-2 ${
                  calculation.summary.budgetStatus === 'surplus'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : calculation.summary.budgetStatus === 'deficit'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <span className="text-[11px] font-bold uppercase tracking-wider block">
                    {calculation.summary.budgetStatus === 'surplus' ? 'Savings / Surplus' : 'Remaining Budget'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight">
                    {calculation.summary.remainingBudget !== null
                      ? `${calculation.summary.remainingBudget >= 0 ? '+' : ''}₹${calculation.summary.remainingBudget.toLocaleString()}`
                      : '—'}
                  </div>
                  <p className="text-[11px] font-medium">
                    {calculation.summary.budgetStatus === 'surplus'
                      ? 'Within your target budget!'
                      : calculation.summary.budgetStatus === 'deficit'
                      ? 'Check cheaper alternatives below'
                      : 'Exact match with target'}
                  </p>
                </div>

              </div>

              {/* Category Breakdown Table */}
              <div className="bg-white rounded-3xl border border-brand-border shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-border bg-slate-50/70 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-brand-navy">
                    Affordable Cost Breakdown & Category Logic
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    MakeMyTrip Inspired
                  </span>
                </div>

                <div className="divide-y divide-brand-border">
                  {calculation.categories.map((cat) => (
                    <div key={cat.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-brand-navy">{cat.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            cat.isShared ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {cat.isShared ? 'Shared Group' : 'Per Person'}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted">
                          {cat.assumption}
                        </p>
                        {cat.economicalAlternative && (
                          <p className="text-[11px] text-emerald-600 font-medium">
                            💡 {cat.economicalAlternative}
                          </p>
                        )}
                      </div>

                      <div className="sm:text-right flex-shrink-0">
                        <div className="text-base font-black text-brand-navy">
                          ₹{cat.amount.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          ≈ ₹{cat.perPerson.toLocaleString()} / person
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Formula Footer */}
                <div className="p-4 bg-brand-light/50 border-t border-brand-border text-xs text-brand-navy space-y-1">
                  <p className="font-bold flex items-center space-x-1.5">
                    <Info className="w-4 h-4 text-brand-primary" />
                    <span>Exact Arithmetic Formula:</span>
                  </p>
                  <p className="font-mono text-[11px] text-slate-700">
                    Total = Transport (₹{calculation.categories[0].amount.toLocaleString()}) + Stay (₹{calculation.categories[1].amount.toLocaleString()}) + Food (₹{calculation.categories[2].amount.toLocaleString()}) + Local Transit (₹{calculation.categories[3].amount.toLocaleString()}) + Activities (₹{calculation.categories[4].amount.toLocaleString()}) + Other (₹{calculation.categories[5].amount.toLocaleString()}) = ₹{calculation.summary.totalBudget.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Cheaper Alternatives & Money-Saving Swaps */}
              {calculation.cheaperAlternatives && calculation.cheaperAlternatives.length > 0 && (
                <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 space-y-4">
                  <div className="flex items-center space-x-2 text-brand-navy">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">
                      Cheaper Alternatives & Cost-Saving Swaps
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {calculation.cheaperAlternatives.map((alt, aIdx) => (
                      <div key={aIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-navy">{alt.category}</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            Save up to ₹{alt.estimatedSavings.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700">
                          {alt.suggestedAlternative}
                        </p>
                        <p className="text-[10px] text-slate-500 italic">
                          Tip: {alt.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Economical Transport Options Comparison */}
              <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 space-y-4">
                <div className="flex items-center space-x-2 text-brand-navy">
                  <Train className="w-5 h-5 text-brand-primary" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">
                    Economical Transport Options Comparison
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {transportComparisons.map((item, tIdx) => {
                    const Icon = item.icon;
                    return (
                      <div key={tIdx} className="p-3 rounded-2xl border border-brand-border bg-slate-50/60 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-brand-navy">{item.mode}</p>
                            <p className="text-[10px] text-brand-muted">{item.duration}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-brand-navy text-xs block">{item.costPerPerson}</span>
                          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};
