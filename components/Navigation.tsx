
import React from 'react';
import { Home, Trophy, Gift, User, Scan } from 'lucide-react';
import { ViewState, Language } from '../types';
import { translations } from '../utils/translations';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, language }) => {
  const t = translations[language];

  const navItems = [
    { id: ViewState.DASHBOARD, icon: Home, label: t.nav_home },
    { id: ViewState.LEADERBOARD, icon: Trophy, label: t.nav_ranking },
    { id: ViewState.RECYCLE, icon: Scan, label: t.nav_scan, highlight: true }, // Quick action center
    { id: ViewState.REWARDS, icon: Gift, label: t.nav_rewards },
    { id: ViewState.PROFILE, icon: User, label: t.nav_profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe pt-1 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50 h-[88px]">
      <div className="flex justify-between items-center h-full pb-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          if (item.highlight) {
            return (
               <button
                 key={item.id}
                 onClick={() => setView(item.id)}
                 className="relative -top-5 flex flex-col items-center justify-center group"
               >
                 <div className="w-14 h-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center transform transition-transform group-active:scale-95 border-4 border-white">
                   <Icon size={24} strokeWidth={2.5} />
                 </div>
                 <span className="text-[10px] font-bold text-gray-500 mt-1">{item.label}</span>
               </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center w-14 space-y-1 transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-green-50' : 'bg-transparent'}`}>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
