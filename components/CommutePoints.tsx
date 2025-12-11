
import React, { useState } from 'react';
import { Bus, Bike, Footprints, Car, Check } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface CommutePointsProps {
  onPointsAwarded: (points: number, details: string) => void;
  goHome: () => void;
  language: Language;
}

const CommutePoints: React.FC<CommutePointsProps> = ({ onPointsAwarded, goHome, language }) => {
  const [method, setMethod] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const t = translations[language];

  const methods = [
    { id: 'bus', label: t.bus, icon: Bus, points: 5, color: 'bg-blue-100 text-blue-600' },
    { id: 'bike', label: t.bike, icon: Bike, points: 8, color: 'bg-green-100 text-green-600' },
    { id: 'walk', label: t.walk, icon: Footprints, points: 8, color: 'bg-orange-100 text-orange-600' },
    { id: 'carpool', label: t.carpool, icon: Car, points: 3, color: 'bg-purple-100 text-purple-600' },
  ];

  const handleSubmit = () => {
    if (!method) return;
    const selected = methods.find(m => m.id === method);
    if (selected) {
        onPointsAwarded(selected.points, `Commute via ${selected.label}`);
        setSubmitted(true);
    }
  };

  if (submitted) {
     return (
        <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center animate-fade-in">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-primary" />
           </div>
           <h3 className="text-2xl font-bold text-gray-800">{t.green_commute}</h3>
           <p className="text-gray-500 mt-2 mb-8">{t.saved_carbon}</p>
           <button onClick={goHome} className="btn-primary w-full py-3 rounded-xl bg-primary text-white font-bold">{t.return_dash}</button>
        </div>
     );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">{t.commute_header}</h2>
        <p className="text-sm text-gray-500">{t.commute_sub}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {methods.map((m) => {
           const Icon = m.icon;
           const isSelected = method === m.id;
           return (
             <button
               key={m.id}
               onClick={() => setMethod(m.id)}
               className={`relative p-4 rounded-2xl flex flex-col items-center justify-center gap-3 border-2 transition-all ${
                 isSelected ? 'border-primary bg-green-50' : 'border-transparent bg-white shadow-sm hover:shadow-md'
               }`}
             >
                <div className={`p-3 rounded-full ${m.color}`}>
                   <Icon size={24} />
                </div>
                <div className="text-center">
                    <div className="font-bold text-gray-700">{m.label}</div>
                    <div className="text-xs text-gray-400">+{m.points} pts</div>
                </div>
                {isSelected && (
                    <div className="absolute top-2 right-2 text-primary">
                        <Check size={16} />
                    </div>
                )}
             </button>
           );
        })}
      </div>

      <div className="bg-yellow-50 p-4 rounded-xl text-yellow-800 text-sm">
         <p className="font-semibold mb-1">{t.upload_ticket}</p>
         <p className="opacity-80">{t.upload_bonus}</p>
         <button className="mt-2 text-xs bg-yellow-200 px-3 py-1 rounded-md font-bold uppercase">{t.upload_btn}</button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!method}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-auto ${!method ? 'bg-gray-300' : 'bg-primary active:scale-95'}`}
      >
        {t.log_commute}
      </button>
    </div>
  );
};

export default CommutePoints;
