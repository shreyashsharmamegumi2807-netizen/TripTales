import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const { signIn, signUp, isSupabaseActive } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        const res = await signUp(email, password, fullName);
        if (res.error) {
          setError(res.error);
        } else {
          onClose();
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-elevated border border-brand-border p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-primary mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-brand-navy">
            {mode === 'signin' ? 'Welcome Back' : 'Join TripTales'}
          </h3>
          <p className="text-xs text-brand-muted mt-1">
            {mode === 'signin'
              ? 'Access your saved itineraries, personalized journal, and dashboard.'
              : 'Start your journey to smarter, AI-assisted travel planning.'}
          </p>
        </div>

        {/* Database Status indicator */}
        <div className="mb-4 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center space-x-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Private User Storage</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {isSupabaseActive ? 'Supabase Auth' : 'Local Auth'}
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-sm outline-none transition-all"
              />
            </div>
            {mode === 'signup' && (
              <p className="text-[11px] text-slate-400 mt-1">Must be at least 6 characters.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm shadow-md hover:shadow-hover transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'Sign In to TripTales' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 text-center text-xs text-brand-muted">
          {mode === 'signin' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="font-bold text-brand-primary hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className="font-bold text-brand-primary hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
