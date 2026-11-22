import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  Star, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  Check, 
  Lock, 
  Clock,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JournalEntry } from '../types';

interface JournalPageProps {
  openAuthModal: (mode: 'signin' | 'signup') => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ openAuthModal }) => {
  const { user, journalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [tripTitle, setTripTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [memories, setMemories] = useState('');
  const [highlights, setHighlights] = useState('');
  const [rating, setRating] = useState(5);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is not authenticated: Show protected state banner
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-light text-brand-primary mx-auto flex items-center justify-center shadow-subtle">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-brand-navy">
          Private Travel Journal
        </h2>
        <p className="text-sm text-brand-muted max-w-md mx-auto">
          Your travel journal is securely associated with your personal account. Sign in to capture reflections, photo memories, and memorable milestones.
        </p>
        <div className="pt-2">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-8 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm shadow-md transition-all"
          >
            Sign In to Access Journal
          </button>
        </div>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingId(null);
    setTripTitle('');
    setDestination('');
    setTravelDate('');
    setMemories('');
    setHighlights('');
    setRating(5);
    setPhotoUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTripTitle(entry.tripTitle);
    setDestination(entry.destination);
    setTravelDate(entry.travelDate || '');
    setMemories(entry.memories);
    setHighlights(entry.highlights || '');
    setRating(entry.rating);
    setPhotoUrl(entry.photoUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle.trim() || !destination.trim() || !memories.trim()) {
      alert('Please fill in trip title, destination, and memories.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateJournalEntry(editingId, {
          tripTitle: tripTitle.trim(),
          destination: destination.trim(),
          travelDate: travelDate || undefined,
          memories: memories.trim(),
          highlights: highlights.trim() || undefined,
          rating,
          photoUrl: photoUrl.trim() || undefined
        });
      } else {
        await createJournalEntry({
          tripTitle: tripTitle.trim(),
          destination: destination.trim(),
          travelDate: travelDate || undefined,
          memories: memories.trim(),
          highlights: highlights.trim() || undefined,
          rating,
          photoUrl: photoUrl.trim() || undefined
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error saving journal: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this memory from your journal?')) {
      try {
        await deleteJournalEntry(id);
      } catch (err: any) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-brand-border gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">
              Personal Travel Journal
            </h1>
          </div>
          <p className="text-xs text-brand-muted mt-1">
            Capture authentic stories, notes, and milestones from your journeys across the world.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Entries List / Grid */}
      {journalEntries.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-brand-border p-8 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy">No Journal Entries Yet</h3>
          <p className="text-xs text-brand-muted mt-1.5 max-w-md mx-auto">
            You haven't added any travel memories yet. Click below to document your first adventure!
          </p>
          <button
            onClick={openCreateModal}
            className="mt-6 px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-sm"
          >
            Create Your First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-3xl border border-brand-border shadow-subtle hover:shadow-card transition-all flex flex-col overflow-hidden"
            >
              {entry.photoUrl && (
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <img
                    src={entry.photoUrl}
                    alt={entry.tripTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-500 flex items-center space-x-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{entry.rating} / 5</span>
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-brand-muted mb-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                      <span className="font-semibold text-brand-navy">{entry.destination}</span>
                    </span>
                    {entry.travelDate && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{entry.travelDate}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy">
                    {entry.tripTitle}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2.5 whitespace-pre-wrap leading-relaxed line-clamp-4">
                    {entry.memories}
                  </p>

                  {entry.highlights && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                      <span className="font-bold">Highlight: </span>
                      {entry.highlights}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-brand-border flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(entry)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-brand-light transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-elevated border border-brand-border p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-brand-navy mb-4">
              {editingId ? 'Edit Journal Entry' : 'New Journal Memory'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Trip / Memory Title *
                </label>
                <input
                  type="text"
                  required
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  placeholder="e.g. Sunrise at Tiger Hill or Kedarnath Trek"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Darjeeling, West Bengal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                    Travel Date
                  </label>
                  <input
                    type="text"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    placeholder="e.g. November 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Memories & Reflections *
                </label>
                <textarea
                  required
                  rows={4}
                  value={memories}
                  onChange={(e) => setMemories(e.target.value)}
                  placeholder="Write what made this journey special, local conversations, culinary delights, or unexpected discoveries..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Key Highlight / Favorite Moment
                </label>
                <input
                  type="text"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  placeholder="e.g. Seeing the Kanchenjunga peak glowing golden at dawn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                    Overall Experience Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value) || 5)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (Exceptional 5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (Great 4/5)</option>
                    <option value={3}>⭐⭐⭐ (Good 3/5)</option>
                    <option value={2}>⭐⭐ (Fair 2/5)</option>
                    <option value={1}>⭐ (Challenging 1/5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary text-sm outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Update Entry' : 'Save Memory to Journal'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
