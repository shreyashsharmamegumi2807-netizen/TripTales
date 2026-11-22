import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PlannerPage } from './pages/PlannerPage';
import { BudgetPage } from './pages/BudgetPage';
import { HiddenGemsPage } from './pages/HiddenGemsPage';
import { WeatherPage } from './pages/WeatherPage';
import { JournalPage } from './pages/JournalPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

export function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}

function AppContent() {
  const { needsPasswordReset } = useAuth();
  const [selectedTab, setActiveTab] = useState(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    return hash.has('confirmation_token') || hash.has('recovery_token') ? 'login' : 'home';
  });
  const activeTab = needsPasswordReset ? 'login' : selectedTab;
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setActiveTab('login');
  };

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} openAuthModal={openAuthModal} />
      <main className="flex-1">
        {activeTab === 'home' && <HomePage setActiveTab={setActiveTab} openAuthModal={openAuthModal} />}
        {activeTab === 'planner' && <PlannerPage openAuthModal={openAuthModal} setActiveTab={setActiveTab} />}
        {activeTab === 'budget' && <BudgetPage />}
        {activeTab === 'gems' && <HiddenGemsPage setActiveTab={setActiveTab} />}
        {activeTab === 'weather' && <WeatherPage />}
        {activeTab === 'journal' && <JournalPage openAuthModal={openAuthModal} />}
        {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} openAuthModal={openAuthModal} />}
        {activeTab === 'login' && <LoginPage key={authMode} setActiveTab={setActiveTab} initialMode={authMode} />}
      </main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
