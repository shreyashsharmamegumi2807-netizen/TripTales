import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Calculator, 
  ShieldCheck, 
  CloudSun, 
  ArrowRight, 
  CheckCircle2, 
  Navigation, 
  Calendar, 
  Users, 
  DollarSign,
  Mountain,
  HeartHandshake,
  Landmark,
  Sunrise
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode: 'signin' | 'signup') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, openAuthModal }) => {
  const popularDestinations = [
    {
      name: 'Jaipur, Rajasthan',
      subtitle: 'The Royal Pink City',
      tag: 'Heritage & Forts',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      description: 'Amber Fort, Hawa Mahal, authentic Dal Baati Churma, and centuries of vibrant Rajasthani culture.'
    },
    {
      name: 'Varanasi, Uttar Pradesh',
      subtitle: 'Spiritual Capital of India',
      tag: 'Spiritual / Bhakti',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient river ghats, mesmerizing evening Ganga Aarti, narrow labyrinthine alleys, and sacred temples.'
    },
    {
      name: 'Himachal Pradesh',
      subtitle: 'Pine Valleys & High Passes',
      tag: 'Himalayan Adventure',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      description: 'From serene Tirthan and Spiti valleys to snow-crowned peaks and ancient cedar monasteries.'
    },
    {
      name: 'Kerala Backwaters',
      subtitle: 'God’s Own Country',
      tag: 'Nature & Serenity',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      description: 'Tranquil houseboat cruising in Alleppey, aromatic spice plantations in Munnar, and Ayurvedic wellness.'
    },
    {
      name: 'Char Dham Yatra',
      subtitle: 'Uttarakhand Holy Shrines',
      tag: 'Pilgrimage Circuit',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      description: 'Yamunotri, Gangotri, Kedarnath, and Badrinath nestled amidst dramatic Garhwal Himalayan peaks.'
    },
    {
      name: 'Goa Coastal Coast',
      subtitle: 'Sun, Sand & Portuguese Charm',
      tag: 'Coastal Relaxation',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      description: 'Golden beaches, historic churches of Old Goa, serene South Goan coves, and fresh coastal seafood.'
    }
  ];

  const travelStyles = [
    { title: 'Spiritual / Bhakti', icon: Sunrise, desc: 'Temple circuits, rituals, tranquil ghats, and spiritual heritage.' },
    { title: 'Char Dham', icon: Mountain, desc: 'Comprehensive logistical planning for high-altitude Himalayan pilgrimages.' },
    { title: 'Hiking & Trekking', icon: Navigation, desc: 'Mountain passes, alpine lakes, equipment guidance, and trail safety.' },
    { title: 'Family Vacation', icon: Users, desc: 'Comfort-oriented stays, kid-friendly paces, and shared group logistics.' },
    { title: 'Cultural & History', icon: Landmark, desc: 'UNESCO monuments, regional architecture, local artisan craft, and history.' },
    { title: 'Couple & Solo', icon: HeartHandshake, desc: 'Boutique homestays, scenic viewpoints, safety tips, and peaceful pacing.' }
  ];

  const steps = [
    {
      number: '01',
      title: 'Specify Your Journey',
      description: 'Enter your origin, destination, traveller count, days, travel style, and approximate budget.'
    },
    {
      number: '02',
      title: 'AI Synthesis & Deterministic Math',
      description: 'TripTales AI synthesizes a personalized day-by-day plan, while our arithmetic engine calculates room counts and realistic expenses.'
    },
    {
      number: '03',
      title: 'Travel, Save & Journal',
      description: 'Save your customized itinerary to your private dashboard, check live weather, and preserve memories in your personal journal.'
    }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/60 to-transparent blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-light border border-blue-200 text-brand-primary text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Travel Technology</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-[1.15]">
                Your Journey. Your Story.{' '}
                <span className="text-brand-primary block sm:inline">Your TripTales.</span>
              </h1>

              <p className="text-lg sm:text-xl text-brand-muted max-w-2xl font-normal leading-relaxed">
                Discover destinations, plan smarter journeys, manage your travel budget, and create unforgettable memories with your AI-powered travel companion.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('planner')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-base shadow-hover flex items-center justify-center space-x-3 transition-all duration-200 group"
                >
                  <MapPin className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
                  <span>Plan My Trip</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setActiveTab('gems')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-brand-light text-brand-navy font-bold text-base border border-brand-border shadow-subtle flex items-center justify-center space-x-3 transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5 text-brand-primary" />
                  <span>Discover Hidden Gems</span>
                </button>
              </div>

              {/* Value Props */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-brand-border/60 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xs font-bold text-brand-navy">Fresh Responses</p>
                  <p className="text-[11px] text-brand-muted">Tailored to exact inputs</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-navy">Exact Budget Math</p>
                  <p className="text-[11px] text-brand-muted">Deterministic calculations</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-navy">Private Storage</p>
                  <p className="text-[11px] text-brand-muted">Secure user database</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Featured Photo */}
                <div className="rounded-3xl overflow-hidden shadow-elevated border-4 border-white aspect-[4/5] relative">
                  <img
                    src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80"
                    alt="Travel destination architecture"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/90 text-white mb-2">
                      Featured Destination
                    </span>
                    <h3 className="text-2xl font-black">Spiti & Himalayan Vistas</h3>
                    <p className="text-xs text-slate-200 mt-1">High-altitude Buddhist monasteries and timeless starry nights.</p>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-elevated border border-brand-border flex items-center space-x-3 max-w-[240px]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-navy">Verified Logistics</p>
                    <p className="text-[10px] text-brand-muted">Zero canned answers</p>
                  </div>
                </div>

                {/* Floating weather pill */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-elevated border border-brand-border flex items-center space-x-2.5">
                  <CloudSun className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-[11px] font-bold text-brand-navy">Live Meteorology</p>
                    <p className="text-[9px] text-brand-muted">Worldwide Real Data</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-light px-3 py-1 rounded-full">
            Top Travel Destinations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3 tracking-tight">
            Popular Journeys Curated for You
          </h2>
          <p className="text-sm sm:text-base text-brand-muted mt-2">
            Click any destination to customize a day-by-day plan with your specific dates and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularDestinations.map((dest, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-brand-border shadow-subtle hover:shadow-hover transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-sm text-brand-navy shadow-sm">
                    {dest.tag}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
                    {dest.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-brand-navy mt-1">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>
                <div className="pt-5 mt-4 border-t border-brand-border flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="text-xs font-bold text-brand-primary hover:text-brand-navy flex items-center space-x-1"
                  >
                    <span>Plan for this place</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('gems')}
                    className="text-xs font-medium text-slate-500 hover:text-brand-primary"
                  >
                    Community stories & tips
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore by Travel Style */}
      <section className="bg-white py-16 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal bg-teal-50 px-3 py-1 rounded-full">
              Tailored Themes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3 tracking-tight">
              Explore by Travel Style
            </h2>
            <p className="text-sm sm:text-base text-brand-muted mt-2">
              Whether seeking inner peace at sacred shrines, thrilling mountain passes, or relaxing family journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelStyles.map((style, idx) => {
              const Icon = style.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTab('planner')}
                  className="p-6 rounded-2xl border border-brand-border hover:border-brand-primary/40 bg-brand-bg/50 hover:bg-white hover:shadow-hover transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-primary transition-colors">
                    {style.title}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How TripTales Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-light px-3 py-1 rounded-full">
            Intuitive Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3 tracking-tight">
            How TripTales Works
          </h2>
          <p className="text-sm sm:text-base text-brand-muted mt-2">
            Engineered from the ground up to eliminate boilerplate itineraries and inaccurate budget guesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-white border border-brand-border shadow-subtle hover:shadow-card transition-all"
            >
              <span className="text-5xl font-black text-brand-light select-none">
                {step.number}
              </span>
              <h3 className="text-xl font-bold text-brand-navy mt-4">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Travel Companion Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-navy to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-primary text-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Genuinely Intelligent AI</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              An AI Travel Companion that Actually Listens.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              No canned answers. No repetitive loops. Ask about high-altitude acclimatization, train vs flight economics to Goa, Char Dham yatra timings, or hidden cafes in Himachal — and receive contextual, fresh guidance every time.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('planner')}
                className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <span>Plan Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/10"
              >
                Budget Calculator
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
