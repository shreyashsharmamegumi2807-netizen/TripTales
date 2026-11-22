import React, { useState } from 'react';
import { 
  Compass, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  setActiveTab: (tab: string) => void;
  initialMode?: 'signin' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({ setActiveTab, initialMode = 'signin' }) => {
  const { user, signIn, signUp, signOut, isSupabaseActive } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // If already logged in, show account info and quick shortcuts
  if (user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-brand-border shadow-card p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-brand-light text-brand-primary mx-auto flex items-center justify-center text-2xl font-bold border-2 border-blue-200">
            {user.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed In</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">
              Welcome back, {user.fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              {user.email} • {isSupabaseActive ? 'Supabase Cloud Sync' : 'Local Storage Mode'}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            You are already logged into your TripTales account. You can view your saved itineraries, plan new trips, or manage your personal travel journal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-secondary transition-all shadow-sm flex items-center space-x-2"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className="px-6 py-3 rounded-xl bg-brand-light text-brand-primary text-xs font-bold hover:bg-blue-100 transition-all border border-blue-200"
            >
              <span>Plan New Trip</span>
            </button>

            <button
              onClick={async () => {
                await signOut();
                setSuccessMsg('You have been signed out.');
              }}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email.trim(), password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Welcome back! Redirecting to your dashboard...');
          setTimeout(() => {
            setActiveTab('dashboard');
          }, 1000);
        }
      } else {
        const res = await signUp(email.trim(), password, fullName.trim());
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Account created successfully! Welcome to TripTales.');
          setTimeout(() => {
            setActiveTab('dashboard');
          }, 1000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Instant demo login helper
  const handleDemoLogin = async () => {
    setEmail('traveler@triptales.com');
    setPassword('travel123');
    setErrorMsg(null);
    setIsLoading(true);
    try {
      // First try to sign in; if not found, auto-create demo user
      let res = await signIn('traveler@triptales.com', 'travel123');
      if (res.error) {
        await signUp('traveler@triptales.com', 'travel123', 'Demo Traveler');
      }
      setSuccessMsg('Signed in as Demo Traveler! Redirecting...');
      setTimeout(() => {
        setActiveTab('dashboard');
      }, 800);
    } catch (err: any) {
      setErrorMsg('Demo login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-slate-50/60">
      
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-brand-border shadow-elevated overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Visual Showcase & Brand Highlights (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-navy via-slate-900 to-brand-primary p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background overlay circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>

          {/* Top Brand Tag */}
          <div className="space-y-4 relative z-10">
            <div 
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-blue-300" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Trip<span className="text-blue-400">Tales</span>
              </span>
            </div>

            <div className="pt-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-300">
                AI-Powered Travel Platform
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">
                Your journey starts here.
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Unlock specialized day-by-day itineraries, deterministic budget calculations, verified off-beat hidden gems, and your private travel journal.
              </p>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-3.5 my-8 relative z-10">
            <div className="flex items-start space-x-3 text-xs text-slate-200">
              <div className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 flex-shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </div>
              <span>10 Specialized Categories (Spiritual, Treks, Char Dham & Family)</span>
            </div>

            <div className="flex items-start space-x-3 text-xs text-slate-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                <DollarSign className="w-3 h-3" />
              </div>
              <span>MakeMyTrip-inspired Affordable & Realistic Budget Math</span>
            </div>

            <div className="flex items-start space-x-3 text-xs text-slate-200">
              <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                <MapPin className="w-3 h-3" />
              </div>
              <span>Verified Destination Guides & Authentic Community Stories</span>
            </div>

            <div className="flex items-start space-x-3 text-xs text-slate-200">
              <div className="w-5 h-5 rounded-full bg-rose-500/30 flex items-center justify-center text-rose-300 flex-shrink-0 mt-0.5">
                <Heart className="w-3 h-3" />
              </div>
              <span>Save Private Trips & Offline Export to PDF</span>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="pt-4 border-t border-white/10 relative z-10 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isSupabaseActive ? 'Supabase Cloud Sync' : 'Local Secure Storage'}</span>
            </div>
            <span>v1.2 Active</span>
          </div>

        </div>

        {/* Right Column: Authentication Form (7 Cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          
          {/* Top Return Link */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            {/* Quick Demo Login Pill */}
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="text-[11px] font-bold text-brand-primary bg-brand-light hover:bg-blue-100 px-3 py-1 rounded-full border border-blue-200 transition-all flex items-center space-x-1"
              title="One-click test login without filling forms"
            >
              <Sparkles className="w-3 h-3" />
              <span>Demo Login</span>
            </button>
          </div>

          {/* Segmented Mode Selector */}
          <div className="space-y-4">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-brand-navy shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-brand-navy shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Heading & Subtitle */}
            <div>
              <h2 className="text-2xl font-black text-brand-navy">
                {mode === 'signin' ? 'Welcome back! 👋' : 'Create your account 🚀'}
              </h2>
              <p className="text-xs text-brand-muted mt-1">
                {mode === 'signin'
                  ? 'Enter your credentials to access your saved trips and travel journal.'
                  : 'Join TripTales to save personalized itineraries and share community travel posts.'}
              </p>
            </div>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="font-bold text-brand-navy block">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-xs outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-xs outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-brand-navy block">Password *</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(!showForgotNotice)}
                    className="text-[11px] font-bold text-brand-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-xs outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="font-bold text-brand-navy block">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-light text-xs outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Forgot password notice */}
            {showForgotNotice && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
                💡 <strong>Password Reset:</strong> In Local Storage mode, accounts are stored privately in your browser session. You can click <strong>Demo Login</strong> at top right to instantly test full user features, or create a new account with your preferred password.
              </div>
            )}

            {/* Remember me & Terms */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-primary focus:ring-brand-light w-3.5 h-3.5"
                />
                <span className="text-[11px] text-slate-600">Keep me signed in</span>
              </label>

              {mode === 'signup' && (
                <span className="text-[11px] text-slate-400">
                  By signing up, you agree to our Terms
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs shadow-md hover:shadow-hover transition-all flex items-center justify-center space-x-2 disabled:opacity-60 pt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to TripTales' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Switch Mode Prompt */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs">
            {mode === 'signin' ? (
              <p className="text-slate-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-bold text-brand-primary hover:underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-bold text-brand-primary hover:underline ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
