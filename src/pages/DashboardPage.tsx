import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Trash2, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Eye, 
  X,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SavedTrip } from '../types';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode: 'signin' | 'signup') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab, openAuthModal }) => {
  const { user, savedTrips, deleteTrip, journalEntries, isSupabaseActive } = useAuth();
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-light text-brand-primary mx-auto flex items-center justify-center shadow-subtle">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-brand-navy">
          Protected User Dashboard
        </h2>
        <p className="text-sm text-brand-muted max-w-md mx-auto">
          Sign in to access your saved itineraries, budget summaries, travel journal, and personal account configurations.
        </p>
        <div className="pt-2">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-8 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm shadow-md transition-all"
          >
            Sign In to TripTales
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this saved itinerary?')) {
      try {
        await deleteTrip(id);
      } catch (err: any) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Account • {isSupabaseActive ? 'Supabase Sync' : 'Isolated User Store'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            You have {savedTrips.length} saved {savedTrips.length === 1 ? 'itinerary' : 'itineraries'} and {journalEntries.length} journal {journalEntries.length === 1 ? 'entry' : 'entries'}.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('planner')}
          className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Plan a New Journey</span>
        </button>
      </div>

      {/* Main Content: Saved Itineraries */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <h2 className="text-xl font-black text-brand-navy flex items-center space-x-2">
            <Compass className="w-5 h-5 text-brand-primary" />
            <span>My Saved Itineraries</span>
          </h2>
          <span className="text-xs font-semibold text-brand-muted">
            {savedTrips.length} {savedTrips.length === 1 ? 'Trip' : 'Trips'}
          </span>
        </div>

        {savedTrips.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-brand-border p-8 max-w-xl mx-auto shadow-subtle">
            <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center mx-auto mb-4">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">
              No Saved Itineraries Yet
            </h3>
            <p className="text-xs text-brand-muted mt-1.5 max-w-md mx-auto">
              You haven't saved any trips yet. Generate a personalized itinerary with our AI planner and click "Save Itinerary".
            </p>
            <button
              onClick={() => setActiveTab('planner')}
              className="mt-6 px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-sm hover:bg-brand-secondary transition-all"
            >
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className="bg-white rounded-3xl border border-brand-border shadow-subtle hover:shadow-hover transition-all duration-200 cursor-pointer flex flex-col justify-between p-6 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-light text-brand-primary">
                      {trip.tripType}
                    </span>
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-primary transition-colors">
                    {trip.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-brand-muted">
                    <p className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{trip.startingLocation} → {trip.destination}</span>
                    </p>
                    <p className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.days} Days • {trip.travellers} {trip.travellers === 1 ? 'Traveller' : 'Travellers'}</span>
                    </p>
                    <p className="flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-slate-700">₹{trip.budget.toLocaleString()} Total Budget</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-brand-border flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    Saved on {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-brand-primary flex items-center space-x-1">
                    <span>View Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Settings & Environment Configuration Section */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-brand-border">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-navy">
              Account & System Status
            </h3>
            <p className="text-xs text-brand-muted">
              Secure environment configuration and active integrations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-bold text-slate-800">User Identity</p>
            <p className="text-slate-600">{user.email}</p>
            <p className="text-[10px] text-slate-400">ID: {user.id}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-bold text-slate-800">Database Engine</p>
            <p className="text-slate-600">{isSupabaseActive ? 'Supabase Connected' : 'Local Storage Mode'}</p>
            <p className="text-[10px] text-slate-400">Row Level Security configured</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-bold text-slate-800">Meteorology Service</p>
            <p className="text-emerald-700 font-semibold">Open-Meteo High Resolution</p>
            <p className="text-[10px] text-slate-400">Live worldwide forecasts active</p>
          </div>
        </div>
      </div>

      {/* Detailed Itinerary Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-elevated border border-brand-border p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedTrip(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-primary">
                {selectedTrip.tripType}
              </span>
              <h2 className="text-2xl font-black text-brand-navy mt-2">
                {selectedTrip.title}
              </h2>
              <p className="text-xs text-brand-muted mt-1">
                {selectedTrip.startingLocation} → {selectedTrip.destination} • {selectedTrip.days} Days • {selectedTrip.travellers} Travellers
              </p>
            </div>

            {selectedTrip.itinerary?.summary && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {selectedTrip.itinerary.summary}
              </p>
            )}

            {/* Day by Day */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                Daily Itinerary
              </h4>
              <div className="space-y-3">
                {selectedTrip.itinerary?.days?.map((d) => (
                  <div key={d.dayNumber} className="p-4 rounded-2xl border border-brand-border bg-slate-50/50 space-y-2 text-xs">
                    <p className="font-bold text-brand-navy text-sm">
                      Day {d.dayNumber}: {d.theme}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                      <div><span className="font-semibold text-brand-navy">Morning:</span> {d.morning}</div>
                      <div><span className="font-semibold text-brand-navy">Afternoon:</span> {d.afternoon}</div>
                      <div><span className="font-semibold text-brand-navy">Evening:</span> {d.evening}</div>
                    </div>
                    {d.insiderTip && (
                      <p className="text-emerald-800 text-[11px] pt-1 border-t border-slate-200">
                        <span className="font-bold">Insider Tip: </span>{d.insiderTip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTrip(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-bold transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
