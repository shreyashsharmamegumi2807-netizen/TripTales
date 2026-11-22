import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Calculator, 
  Sparkles, 
  CloudSun, 
  BookOpen, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  openAuthModal
}) => {
  const { user, signOut, isSupabaseActive } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'planner', label: 'Plan Trip', icon: MapPin },
    { id: 'budget', label: 'Budget Planner', icon: Calculator },
    { id: 'gems', label: 'Hidden Gems', icon: Sparkles },
    { id: 'weather', label: 'Weather Radar', icon: CloudSun },
    ...(user ? [
      { id: 'journal', label: 'Journal', icon: BookOpen },
      { id: 'dashboard', label: 'My Trips', icon: LayoutDashboard }
    ] : [])
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-navy to-brand-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-brand-navy">
                  Trip<span className="text-brand-primary">Tales</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-light text-brand-primary border border-blue-200">
                  Smart Travel
                </span>
              </div>
              <p className="text-[11px] font-medium text-brand-muted -mt-1 hidden sm:block">
                Your AI-Powered Travel Companion
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-brand-text hover:text-brand-primary hover:bg-brand-light'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action / User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full border border-brand-border hover:border-brand-primary/50 bg-white shadow-subtle hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-brand-navy max-w-[120px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-brand-border py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-brand-border">
                      <p className="text-xs text-brand-muted">Signed in as</p>
                      <p className="text-sm font-bold text-brand-navy truncate">{user.email}</p>
                      <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {isSupabaseActive ? 'Supabase Cloud Sync' : 'Local Storage Mode'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-brand-light flex items-center space-x-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-primary" />
                      <span>My Trips Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('journal');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-brand-light flex items-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4 text-brand-teal" />
                      <span>Travel Journal</span>
                    </button>

                    <div className="border-t border-brand-border my-1"></div>

                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className={`px-3.5 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'login' ? 'text-brand-primary font-bold' : 'text-brand-navy hover:text-brand-primary'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary shadow-sm transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-navy hover:bg-brand-light"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-brand-border px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-text hover:bg-brand-light'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}

          <div className="border-t border-brand-border pt-4 mt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-bold text-brand-navy">{user.fullName}</p>
                  <p className="text-xs text-brand-muted truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    openAuthModal('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-brand-border text-brand-navy hover:bg-slate-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-secondary"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
