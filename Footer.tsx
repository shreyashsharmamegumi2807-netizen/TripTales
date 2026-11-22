import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, MapPin, Globe, User } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-brand-navy text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Trip<span className="text-brand-secondary">Tales</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your AI-Powered Travel Companion. Discover authentic destinations, plan smarter day-by-day itineraries, calculate realistic budgets, and build lifelong memories.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-secondary font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Affordable Planning & Verified Logistics</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore Features
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => setActiveTab('planner')} 
                  className="hover:text-white transition-colors flex items-center space-x-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                  <span>AI Trip Planner</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('budget')} 
                  className="hover:text-white transition-colors flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Budget Planner</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('gems')} 
                  className="hover:text-white transition-colors"
                >
                  Verified Hidden Gems & Community
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('weather')} 
                  className="hover:text-white transition-colors"
                >
                  Real Weather Radar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('login')} 
                  className="hover:text-white transition-colors flex items-center space-x-1.5"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Account Login / Sign In</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Travel Themes */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Featured Travel Themes
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-slate-200">Spiritual & Bhakti Journeys</li>
              <li className="hover:text-slate-200">Char Dham Yatra Itineraries</li>
              <li className="hover:text-slate-200">Himalayan Treks & Valley Trails</li>
              <li className="hover:text-slate-200">Cultural & Heritage Forts</li>
              <li className="hover:text-slate-200">Offbeat Serene Escapes</li>
              <li className="hover:text-slate-200">Family & Budget Holidays</li>
            </ul>
          </div>

          {/* Reliability Promise */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Globe className="w-4 h-4 text-brand-secondary" />
              <span>Built With Precision</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              TripTales eliminates boilerplate travel advice. Every route, budget category, and weather update is computed dynamically for your exact inputs with zero hardcoded sample answers.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Zapier Travel Assistant</span>
              <span>Open-Meteo High-Res</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TripTales. All rights reserved. Crafted for passionate travellers.</p>
          <div className="flex items-center space-x-1 mt-4 sm:mt-0">
            <span>Travel responsibly, protect pristine environments</span>
            <Heart className="w-3.5 h-3.5 text-red-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
