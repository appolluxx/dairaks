
import React from 'react';
import { UserStats, Language } from '../types';
import { User, Settings, Award, BookOpen } from 'lucide-react';
import { translations } from '../utils/translations';

interface ProfileProps {
  stats: UserStats;
  language: Language;
}

const Profile: React.FC<ProfileProps> = ({ stats, language }) => {
  const t = translations[language];

  return (
    <div className="p-5 space-y-6 pb-28 animate-fade-in">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t.my_profile}</h2>
        <button className="p-2 bg-white rounded-full text-gray-400 shadow-sm"><Settings size={20}/></button>
      </header>

      {/* User Card */}
      <div className="bg-white rounded-3xl p-6 shadow-soft flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-4 border-green-50">
          <User size={40} className="text-gray-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Eco-Hero Student</h3>
          <p className="text-gray-500 text-sm">{t.school_name}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-primary text-xs font-bold rounded-full">
            <Award size={12} />
            {t.level} {stats.level}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-card text-center">
           <p className="text-3xl font-black text-primary">{stats.ecoPoints}</p>
           <p className="text-xs text-gray-500 font-medium">{t.lifetime_points}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-card text-center">
           <p className="text-3xl font-black text-secondary">{stats.recycleCount + stats.reportsFiled}</p>
           <p className="text-xs text-gray-500 font-medium">{t.actions_taken}</p>
        </div>
      </div>

      {/* Training Application Section (Requested Highlight) */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="text-secondary w-5 h-5" />
          <h4 className="font-bold text-gray-800">{t.project_origin}</h4>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          {t.training_desc}
        </p>
        <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
          <li><strong>Problem:</strong> Addressing urban density & PM2.5 in schools.</li>
          <li><strong>Solution:</strong> Digital gamification to drive real-world action.</li>
          <li><strong>Impact:</strong> Measuring CO2 reduction per student.</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-blue-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{t.project_phase}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
