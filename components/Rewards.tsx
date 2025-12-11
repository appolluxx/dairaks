
import React from 'react';
import { Gift, Lock } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface RewardsProps {
    language: Language;
}

const Rewards: React.FC<RewardsProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="p-5 space-y-6 pb-28 animate-fade-in flex flex-col h-full">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">{t.rewards}</h2>
        <p className="text-sm text-gray-500">{t.redeem_points}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-4 rounded-2xl shadow-card opacity-70 relative overflow-hidden group">
             <div className="absolute top-2 right-2 bg-gray-100 p-1.5 rounded-full">
                <Lock size={14} className="text-gray-400" />
             </div>
             <div className="w-12 h-12 bg-gray-50 rounded-xl mb-3 flex items-center justify-center">
                <Gift className="text-gray-300" />
             </div>
             <h3 className="font-bold text-gray-700 text-sm">{t.mystery_reward}</h3>
             <p className="text-xs text-primary font-bold mt-1">500 XP</p>
          </div>
        ))}
      </div>
      
      <div className="mt-auto bg-green-50 rounded-xl p-6 text-center">
         <p className="text-primary font-bold">{t.more_coming}</p>
         <p className="text-xs text-gray-500 mt-1">{t.unlock_tiers}</p>
      </div>
    </div>
  );
};

export default Rewards;
