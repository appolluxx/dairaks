
import React from 'react';
import { UserStats, SchoolStats, ViewState, Language } from '../types';
import { TrendingUp, Recycle, MapPin, Car, Users, Leaf, ArrowRight } from 'lucide-react';
import { translations } from '../utils/translations';

interface DashboardProps {
  stats: UserStats;
  schoolStats: SchoolStats;
  setView: (view: ViewState) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, schoolStats, setView, language, setLanguage }) => {
  const progressPercent = (stats.ecoPoints / stats.nextLevelPoints) * 100;
  const t = translations[language];

  return (
    <div className="p-5 space-y-6 pb-28 animate-fade-in">
      {/* Header & Language Toggle */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{t.welcome_back}</p>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Eco-Hero Student</h1>
        </div>

        {/* Language Toggle Pill */}
        <div className="bg-white rounded-full p-1 shadow-sm border border-gray-100 flex items-center gap-1">
          <button
            onClick={() => setLanguage('TH')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${language === 'TH'
                ? 'bg-primary text-white shadow-md'
                : 'bg-transparent text-gray-400 hover:text-gray-600'
              }`}
          >
            {/* Thai Flag Icon Simulation (Red, White, Blue, White, Red) */}
            <span className="w-3 h-3 rounded-full overflow-hidden flex flex-col border border-white/20">
              <span className="h-[16%] bg-[#EF3340] w-full"></span>
              <span className="h-[16%] bg-white w-full"></span>
              <span className="h-[36%] bg-[#00205B] w-full"></span>
              <span className="h-[16%] bg-white w-full"></span>
              <span className="h-[16%] bg-[#EF3340] w-full"></span>
            </span>
            TH
          </button>
          <button
            onClick={() => setLanguage('EN')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${language === 'EN'
                ? 'bg-secondary text-white shadow-md'
                : 'bg-transparent text-gray-400 hover:text-gray-600'
              }`}
          >
            {/* Simple US Flag Icon Simulation */}
            <span className="w-3 h-3 rounded-full overflow-hidden flex flex-col border border-white/20 relative bg-white">
              <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-blue-800 z-10"></span>
              <span className="w-full h-[2px] bg-red-500 mt-[2px]"></span>
              <span className="w-full h-[2px] bg-red-500 mt-[2px]"></span>
            </span>
            EN
          </button>
        </div>
      </div>

      {/* Stats Summary & Level */}
      <div className="flex justify-between items-end -mt-2">
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-primary">{t.level} {stats.level}</span>
            <span className="text-gray-500">{stats.ecoPoints} / {stats.nextLevelPoints} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <Leaf className="text-primary w-5 h-5 fill-current" />
          <h3 className="font-bold text-gray-800">{t.school_impact}</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center relative z-10">
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-gray-800">{schoolStats.wasteRecycledKg}</span>
            <span className="text-[10px] text-gray-500 font-medium leading-tight mt-1">{t.waste_recycled}</span>
          </div>
          <div className="flex flex-col items-center border-l border-r border-gray-100 px-1">
            <span className="text-xl font-black text-primary">{schoolStats.co2SavedKg}</span>
            <span className="text-[10px] text-gray-500 font-medium leading-tight mt-1">{t.co2_saved}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-secondary">{schoolStats.activeStudents}</span>
            <span className="text-[10px] text-gray-500 font-medium leading-tight mt-1">{t.active_students}</span>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">{t.quick_actions}</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setView(ViewState.RECYCLE)}
            className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-start gap-3 border border-transparent hover:border-primary/20 transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Recycle size={20} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-gray-800">{t.scan_trash}</span>
              <span className="text-xs text-gray-500">{t.recycle_earn}</span>
            </div>
          </button>

          <button
            onClick={() => setView(ViewState.COMMUTE)}
            className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-start gap-3 border border-transparent hover:border-secondary/20 transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
              <Car size={20} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-gray-800">{t.commute}</span>
              <span className="text-xs text-gray-500">{t.log_travel}</span>
            </div>
          </button>

          <button
            onClick={() => setView(ViewState.REPORT)}
            className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-start gap-3 border border-transparent hover:border-red-200 transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
              <MapPin size={20} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-gray-800">{t.report_issue}</span>
              <span className="text-xs text-gray-500">{t.fix_campus}</span>
            </div>
          </button>

          <button
            onClick={() => setView(ViewState.COMMUNITY)}
            className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-start gap-3 border border-transparent hover:border-yellow-200 transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-gray-800">{t.community}</span>
              <span className="text-xs text-gray-500">{t.feed_events}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mini Leaderboard Teaser */}
      <div
        onClick={() => setView(ViewState.LEADERBOARD)}
        className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">{t.leaderboard_title}</p>
            <p className="text-xs text-gray-300">{t.leaderboard_desc}</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-gray-300" />
      </div>
    </div>
  );
};

export default Dashboard;
