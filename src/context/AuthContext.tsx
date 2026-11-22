import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  AUTH_EVENTS, AuthError, getUser, handleAuthCallback, login, logout,
  onAuthChange, requestPasswordRecovery, signup, updateUser,
  type User,
} from '@netlify/identity';
import { accountRequest, importBrowserRecords } from '../lib/account';
import type { JournalEntry, SavedTrip, UserProfile } from '../types';

type TripDraft = Omit<SavedTrip, 'id' | 'userId' | 'createdAt'>;
type JournalDraft = Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
type AuthResult = { error?: string; confirmationRequired?: boolean };

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  needsPasswordReset: boolean;
  authLinkError: string | null;
  dataError: string | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  requestReset: (email: string) => Promise<AuthResult>;
  resetPassword: (password: string) => Promise<AuthResult>;
  savedTrips: SavedTrip[];
  saveTrip: (trip: TripDraft) => Promise<SavedTrip>;
  deleteTrip: (id: string) => Promise<void>;
  journalEntries: JournalEntry[];
  createJournalEntry: (entry: JournalDraft) => Promise<JournalEntry>;
  updateJournalEntry: (id: string, entry: JournalDraft) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const confirmationMessage = 'Confirm your email using the link in your inbox before signing in.';

function toProfile(account: User): UserProfile {
  return {
    id: account.id,
    email: account.email ?? '',
    fullName: account.name || account.email?.split('@')[0] || 'Traveler',
    createdAt: account.createdAt ?? '',
  };
}

function loginError(error: unknown) {
  if (error instanceof AuthError) {
    if (/not confirmed|not verified/i.test(error.message)) return confirmationMessage;
    if (error.status === 400 || error.status === 401 || /invalid.*(credentials|password|grant)/i.test(error.message)) {
      return 'That email and password didn’t match. Try resetting your password. If you signed up on the older site, create an account with the same email.';
    }
  }
  return 'Sign-in is temporarily unavailable. Please try again.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);
  const [authLinkError, setAuthLinkError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const currentUserId = useRef<string | null>(null);
  const recoveryInProgress = useRef(false);
  const callback = useRef<ReturnType<typeof handleAuthCallback> | null>(null);

  function applyAccount(account: User | null) {
    const profile = account?.confirmedAt ? toProfile(account) : null;
    if (currentUserId.current !== (profile?.id ?? null)) {
      setSavedTrips([]);
      setJournalEntries([]);
      setDataError(null);
    }
    currentUserId.current = profile?.id ?? null;
    setUser(profile);
  }

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    async function restoreAccount() {
      try {
        const result = await (callback.current ??= handleAuthCallback());
        if (!active) return;
        if (result?.type === 'recovery') {
          recoveryInProgress.current = true;
          setNeedsPasswordReset(true);
        } else {
          const account = result?.user ?? await getUser();
          if (!active) return;
          applyAccount(account);
        }
      } catch {
        if (!active) return;
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        setAuthLinkError('This account link is invalid or has expired. Try signing in, creating an account, or requesting a new password reset link.');
      } finally {
        if (active) {
          unsubscribe = onAuthChange((event, account) => {
            if (event === AUTH_EVENTS.LOGOUT) {
              recoveryInProgress.current = false;
              setNeedsPasswordReset(false);
              applyAccount(null);
            } else if (!recoveryInProgress.current && event !== AUTH_EVENTS.RECOVERY) {
              applyAccount(account);
            }
          });
          setLoading(false);
        }
      }
    }

    void restoreAccount();
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const owner = user;
    let active = true;
    const isCurrent = () => active && currentUserId.current === owner.id;

    async function loadData() {
      const imported = await importBrowserRecords(owner, isCurrent);
      if (!isCurrent()) return;
      try {
        const [trips, journal] = await Promise.all([
          accountRequest<SavedTrip[]>(owner.id, 'trips'),
          accountRequest<JournalEntry[]>(owner.id, 'journal'),
        ]);
        if (isCurrent()) {
          setSavedTrips(trips);
          setJournalEntries(journal);
          setDataError(imported ? null : 'Some older records could not be imported. They remain in this browser; sign in again to retry.');
        }
      } catch {
        if (isCurrent()) setDataError('Your saved trips and journal could not load. Refresh to try again.');
      }
    }

    void loadData();
    return () => { active = false; };
  }, [user?.id, user?.email]);

  async function signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const account = await login(normalizeEmail(email), password);
      if (!account.confirmedAt) return { error: confirmationMessage };
      setAuthLinkError(null);
      applyAccount(account);
      return {};
    } catch (error) {
      return { error: loginError(error) };
    }
  }

  async function signUp(email: string, password: string, name: string): Promise<AuthResult> {
    try {
      const account = await signup(normalizeEmail(email), password, { full_name: name.trim() });
      setAuthLinkError(null);
      if (!account.confirmedAt) return { confirmationRequired: true };
      return signIn(email, password);
    } catch (error) {
      if (error instanceof AuthError && /already (registered|exists)|duplicate/i.test(error.message)) {
        return { error: 'This email may already have an account. Try signing in or resetting your password.' };
      }
      return { error: 'We couldn’t create your account. Check your email address and password and try again.' };
    }
  }

  async function signOut(): Promise<AuthResult> {
    try {
      await logout();
      applyAccount(null);
      return {};
    } catch {
      return { error: 'We couldn’t sign you out. Please try again.' };
    }
  }

  async function requestReset(email: string): Promise<AuthResult> {
    try {
      await requestPasswordRecovery(normalizeEmail(email));
      setAuthLinkError(null);
      return {};
    } catch (error) {
      if (error instanceof AuthError && (error.status === 404 || /user not found/i.test(error.message))) {
        setAuthLinkError(null);
        return {};
      }
      return { error: 'We couldn’t request a password reset. Please try again.' };
    }
  }

  async function resetPassword(password: string): Promise<AuthResult> {
    if (!recoveryInProgress.current) return { error: 'Request a new password reset link and try again.' };
    try {
      const account = await updateUser({ password });
      recoveryInProgress.current = false;
      setNeedsPasswordReset(false);
      applyAccount(account);
      return {};
    } catch {
      return { error: 'We couldn’t change your password. Try again or request a new reset link.' };
    }
  }

  function ownerId() {
    if (!user) throw new Error('Please sign in first.');
    return user.id;
  }

  async function saveTrip(content: TripDraft) {
    const owner = ownerId();
    const saved = await accountRequest<SavedTrip>(owner, 'trips', 'POST', { content });
    if (currentUserId.current === owner) setSavedTrips(previous => [saved, ...previous]);
    return saved;
  }

  async function deleteTrip(id: string) {
    const owner = ownerId();
    await accountRequest(owner, `trips/${encodeURIComponent(id)}`, 'DELETE');
    if (currentUserId.current === owner) setSavedTrips(previous => previous.filter(trip => trip.id !== id));
  }

  async function createJournalEntry(content: JournalDraft) {
    const owner = ownerId();
    const saved = await accountRequest<JournalEntry>(owner, 'journal', 'POST', { content });
    if (currentUserId.current === owner) setJournalEntries(previous => [saved, ...previous]);
    return saved;
  }

  async function updateJournalEntry(id: string, content: JournalDraft) {
    const owner = ownerId();
    const saved = await accountRequest<JournalEntry>(owner, `journal/${encodeURIComponent(id)}`, 'PUT', { content });
    if (currentUserId.current === owner) {
      setJournalEntries(previous => previous.map(entry => entry.id === id ? saved : entry));
    }
  }

  async function deleteJournalEntry(id: string) {
    const owner = ownerId();
    await accountRequest(owner, `journal/${encodeURIComponent(id)}`, 'DELETE');
    if (currentUserId.current === owner) setJournalEntries(previous => previous.filter(entry => entry.id !== id));
  }

  return (
    <AuthContext.Provider value={{
      user, loading, needsPasswordReset, authLinkError, dataError, signIn, signUp, signOut, requestReset, resetPassword,
      savedTrips, saveTrip, deleteTrip, journalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
