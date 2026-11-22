import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, SavedTrip, JournalEntry } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isSupabaseActive: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  savedTrips: SavedTrip[];
  saveTrip: (trip: Omit<SavedTrip, 'id' | 'userId' | 'createdAt'>) => Promise<SavedTrip>;
  deleteTrip: (id: string) => Promise<void>;
  journalEntries: JournalEntry[];
  createJournalEntry: (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<JournalEntry>;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USERS_KEY = 'triptales_users';
const LOCAL_STORAGE_SESSION_KEY = 'triptales_session';
const LOCAL_STORAGE_TRIPS_KEY = 'triptales_saved_trips';
const LOCAL_STORAGE_JOURNAL_KEY = 'triptales_journal_entries';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // 1. Initialize Auth on Mount
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          // Listen to Supabase Auth State
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Traveler',
              createdAt: session.user.created_at,
            });
            await loadSupabaseUserData(session.user.id);
          } else {
            setUser(null);
            setSavedTrips([]);
            setJournalEntries([]);
          }

          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Traveler',
                createdAt: session.user.created_at,
              });
              await loadSupabaseUserData(session.user.id);
            } else {
              setUser(null);
              setSavedTrips([]);
              setJournalEntries([]);
            }
          });
        } else {
          // Local Storage Mode
          const savedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
          if (savedSession) {
            try {
              const parsedUser = JSON.parse(savedSession);
              setUser(parsedUser);
              loadLocalUserData(parsedUser.id);
            } catch (e) {
              localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // 2. Load Data for Supabase
  const loadSupabaseUserData = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data: tripsData } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (tripsData) {
        setSavedTrips(tripsData.map(t => ({
          id: t.id,
          userId: t.user_id,
          title: t.title,
          destination: t.destination,
          startingLocation: t.starting_location,
          travellers: t.travellers,
          days: t.days,
          budget: t.budget,
          travelDate: t.travel_date,
          tripType: t.trip_type,
          preferences: t.preferences,
          itinerary: t.itinerary,
          budgetBreakdown: t.budget_breakdown,
          createdAt: t.created_at
        })));
      }

      const { data: journalData } = await supabase
        .from('travel_journal')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (journalData) {
        setJournalEntries(journalData.map(j => ({
          id: j.id,
          userId: j.user_id,
          tripTitle: j.trip_title,
          destination: j.destination,
          travelDate: j.travel_date,
          memories: j.memories,
          highlights: j.highlights,
          rating: j.rating,
          photoUrl: j.photo_url,
          createdAt: j.created_at,
          updatedAt: j.updated_at
        })));
      }
    } catch (err) {
      console.error('Error fetching Supabase user data:', err);
    }
  };

  // 3. Load Data for Local Storage
  const loadLocalUserData = (userId: string) => {
    try {
      const allTrips: SavedTrip[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY) || '[]');
      setSavedTrips(allTrips.filter(t => t.userId === userId));

      const allJournals: JournalEntry[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_JOURNAL_KEY) || '[]');
      setJournalEntries(allJournals.filter(j => j.userId === userId));
    } catch (e) {
      setSavedTrips([]);
      setJournalEntries([]);
    }
  };

  // 4. Sign Up
  const signUp = async (email: string, pass: string, name: string) => {
    if (!email || !pass || !name) {
      return { error: 'Please provide full name, email, and password.' };
    }
    if (pass.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name }
        }
      });
      if (error) return { error: error.message };
      if (data.user) {
        const newUser: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: name,
          createdAt: data.user.created_at
        };
        setUser(newUser);
        return {};
      }
    } else {
      // Local storage fallback
      const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]');
      if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        return { error: 'An account with this email already exists.' };
      }

      const newUser: UserProfile = {
        id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        email: email.trim().toLowerCase(),
        fullName: name.trim(),
        createdAt: new Date().toISOString()
      };

      users.push({ ...newUser, passwordHash: btoa(pass) });
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(newUser));
      setUser(newUser);
      loadLocalUserData(newUser.id);
      return {};
    }

    return {};
  };

  // 5. Sign In
  const signIn = async (email: string, pass: string) => {
    if (!email || !pass) {
      return { error: 'Email and password are required.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (error) return { error: error.message };
      if (data.user) {
        const u: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          createdAt: data.user.created_at
        };
        setUser(u);
        await loadSupabaseUserData(u.id);
        return {};
      }
    } else {
      const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]');
      const matched = users.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!matched || matched.passwordHash !== btoa(pass)) {
        return { error: 'Invalid email or password.' };
      }

      const activeUser: UserProfile = {
        id: matched.id,
        email: matched.email,
        fullName: matched.fullName,
        createdAt: matched.createdAt
      };
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(activeUser));
      setUser(activeUser);
      loadLocalUserData(activeUser.id);
      return {};
    }

    return {};
  };

  // 6. Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    setUser(null);
    setSavedTrips([]);
    setJournalEntries([]);
  };

  // 7. Save Trip
  const saveTrip = async (tripData: Omit<SavedTrip, 'id' | 'userId' | 'createdAt'>): Promise<SavedTrip> => {
    if (!user) throw new Error('You must be logged in to save trips.');

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('saved_trips').insert({
        user_id: user.id,
        title: tripData.title,
        destination: tripData.destination,
        starting_location: tripData.startingLocation,
        travellers: tripData.travellers,
        days: tripData.days,
        budget: tripData.budget,
        travel_date: tripData.travelDate,
        trip_type: tripData.tripType,
        preferences: tripData.preferences,
        itinerary: tripData.itinerary,
        budget_breakdown: tripData.budgetBreakdown,
      }).select().single();

      if (error) throw new Error(error.message);

      const saved: SavedTrip = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        destination: data.destination,
        startingLocation: data.starting_location,
        travellers: data.travellers,
        days: data.days,
        budget: data.budget,
        travelDate: data.travel_date,
        tripType: data.trip_type,
        preferences: data.preferences,
        itinerary: data.itinerary,
        budgetBreakdown: data.budget_breakdown,
        createdAt: data.created_at
      };
      setSavedTrips(prev => [saved, ...prev]);
      return saved;
    } else {
      const newTrip: SavedTrip = {
        ...tripData,
        id: 'trip_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        userId: user.id,
        createdAt: new Date().toISOString()
      };
      const allTrips: SavedTrip[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY) || '[]');
      allTrips.unshift(newTrip);
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(allTrips));
      setSavedTrips(prev => [newTrip, ...prev]);
      return newTrip;
    }
  };

  // 8. Delete Trip
  const deleteTrip = async (id: string): Promise<void> => {
    if (!user) throw new Error('You must be logged in.');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('saved_trips').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw new Error(error.message);
    } else {
      const allTrips: SavedTrip[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY) || '[]');
      const updated = allTrips.filter(t => !(t.id === id && t.userId === user.id));
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(updated));
    }

    setSavedTrips(prev => prev.filter(t => t.id !== id));
  };

  // 9. Create Journal Entry
  const createJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> => {
    if (!user) throw new Error('You must be logged in to create journal entries.');

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('travel_journal').insert({
        user_id: user.id,
        trip_title: entry.tripTitle,
        destination: entry.destination,
        travel_date: entry.travelDate,
        memories: entry.memories,
        highlights: entry.highlights,
        rating: entry.rating,
        photo_url: entry.photoUrl
      }).select().single();

      if (error) throw new Error(error.message);

      const saved: JournalEntry = {
        id: data.id,
        userId: data.user_id,
        tripTitle: data.trip_title,
        destination: data.destination,
        travelDate: data.travel_date,
        memories: data.memories,
        highlights: data.highlights,
        rating: data.rating,
        photoUrl: data.photo_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      setJournalEntries(prev => [saved, ...prev]);
      return saved;
    } else {
      const newEntry: JournalEntry = {
        ...entry,
        id: 'jnl_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const allJournals: JournalEntry[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_JOURNAL_KEY) || '[]');
      allJournals.unshift(newEntry);
      localStorage.setItem(LOCAL_STORAGE_JOURNAL_KEY, JSON.stringify(allJournals));
      setJournalEntries(prev => [newEntry, ...prev]);
      return newEntry;
    }
  };

  // 10. Update Journal Entry
  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>): Promise<void> => {
    if (!user) throw new Error('You must be logged in.');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('travel_journal').update({
        trip_title: updates.tripTitle,
        destination: updates.destination,
        travel_date: updates.travelDate,
        memories: updates.memories,
        highlights: updates.highlights,
        rating: updates.rating,
        photo_url: updates.photoUrl,
        updated_at: new Date().toISOString()
      }).eq('id', id).eq('user_id', user.id);

      if (error) throw new Error(error.message);
    } else {
      const allJournals: JournalEntry[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_JOURNAL_KEY) || '[]');
      const updated = allJournals.map(j => {
        if (j.id === id && j.userId === user.id) {
          return { ...j, ...updates, updatedAt: new Date().toISOString() };
        }
        return j;
      });
      localStorage.setItem(LOCAL_STORAGE_JOURNAL_KEY, JSON.stringify(updated));
    }

    setJournalEntries(prev => prev.map(j => j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j));
  };

  // 11. Delete Journal Entry
  const deleteJournalEntry = async (id: string): Promise<void> => {
    if (!user) throw new Error('You must be logged in.');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('travel_journal').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw new Error(error.message);
    } else {
      const allJournals: JournalEntry[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_JOURNAL_KEY) || '[]');
      const updated = allJournals.filter(j => !(j.id === id && j.userId === user.id));
      localStorage.setItem(LOCAL_STORAGE_JOURNAL_KEY, JSON.stringify(updated));
    }

    setJournalEntries(prev => prev.filter(j => j.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseActive: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        savedTrips,
        saveTrip,
        deleteTrip,
        journalEntries,
        createJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
