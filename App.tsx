
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import RecyclePoints from './components/RecyclePoints';
import ReportTrash from './components/ReportTrash';
import CommutePoints from './components/CommutePoints';
import CommunityFeed from './components/CommunityFeed';
import Rewards from './components/Rewards';
import Profile from './components/Profile';
import LoadingScreen from './components/LoadingScreen';
import { ViewState, UserStats, SchoolStats, ActivityLog, Language } from './types';
import { translations } from './utils/translations';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('TH'); // Default to Thai for target audience

  // App State (Simulating Backend)
  const [stats, setStats] = useState<UserStats>({
    ecoPoints: 340,
    level: 5,
    nextLevelPoints: 500,
    recycleCount: 12,
    reportsFiled: 3,
    commuteTrips: 15
  });

  const [schoolStats] = useState<SchoolStats>({
    wasteRecycledKg: 1250,
    co2SavedKg: 450,
    activeStudents: 850
  });

  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: '1', type: 'Recycle', points: 10, timestamp: new Date(), details: 'Recycled Plastic' },
    { id: '2', type: 'Commute', points: 5, timestamp: new Date(Date.now() - 86400000), details: 'Bus Trip' }
  ]);

  const handlePointsAwarded = (points: number, details: string) => {
    setStats(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + points,
      recycleCount: details.includes('Recycl') ? prev.recycleCount + 1 : prev.recycleCount,
      commuteTrips: details.includes('Commute') ? prev.commuteTrips + 1 : prev.commuteTrips,
      reportsFiled: details.includes('Report') ? prev.reportsFiled + 1 : prev.reportsFiled
    }));

    setLogs(prev => [{
      id: Date.now().toString(),
      type: details.includes('Recycl') ? 'Recycle' : details.includes('Commute') ? 'Commute' : 'Report',
      points,
      timestamp: new Date(),
      details
    }, ...prev]);
  };

  const t = translations[language];

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard stats={stats} schoolStats={schoolStats} setView={setCurrentView} language={language} setLanguage={setLanguage} />;
      case ViewState.RECYCLE:
        return <RecyclePoints onPointsAwarded={handlePointsAwarded} goHome={() => setCurrentView(ViewState.DASHBOARD)} language={language} />;
      case ViewState.REPORT:
        return <ReportTrash onReportSubmitted={(details) => handlePointsAwarded(20, details)} goHome={() => setCurrentView(ViewState.DASHBOARD)} language={language} />;
      case ViewState.COMMUTE:
        return <CommutePoints onPointsAwarded={handlePointsAwarded} goHome={() => setCurrentView(ViewState.DASHBOARD)} language={language} />;
      case ViewState.COMMUNITY:
        return <CommunityFeed language={language} />;
      case ViewState.REWARDS:
        return <Rewards language={language} />;
      case ViewState.PROFILE:
        return <Profile stats={stats} language={language} />;
      case ViewState.LEADERBOARD:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-card text-center w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.leaderboard_label}</h2>
              <div className="space-y-4 mt-6">
                {[1, 2, 3].map(rank => (
                  <div key={rank} className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-lg w-8">#{rank}</span>
                    <span className="flex-1 text-left ml-2">{t.student_rank} {rank}</span>
                    <span className="font-bold text-primary">{1000 - (rank * 50)} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard stats={stats} schoolStats={schoolStats} setView={setCurrentView} language={language} setLanguage={setLanguage} />;
    }
  };

  /* App.tsx replacement */
  useEffect(() => {
    // Simulate initial loading (e.g. fetching user data)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto h-screen bg-gray-50 relative shadow-2xl overflow-hidden flex flex-col">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            {renderView()}
          </main>
          <Navigation currentView={currentView} setView={setCurrentView} language={language} />
        </>
      )}
    </div>
  );
};

export default App;
