
import React from 'react';
import { Heart, MessageSquare, Share2, MapPin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface CommunityFeedProps {
    language: Language;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ language }) => {
  const t = translations[language];

  const posts = [
    {
      id: 1,
      user: "Jane Doe",
      action: "reported a clean-up spot",
      time: "2h ago",
      content: "Found a lot of plastic bottles near the gym. Cleaned it up! #SaveRaks",
      image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=600",
      likes: 24,
      location: "School Gym Area"
    },
    {
      id: 2,
      user: "Class 6/2",
      action: "completed a challenge",
      time: "5h ago",
      content: "Our entire class commuted by public transport today! 🚌🚇",
      likes: 56,
      location: "Surasakmontree School"
    }
  ];

  return (
    <div className="p-5 space-y-6 pb-28 animate-fade-in">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">{t.community_feed}</h2>
        <p className="text-sm text-gray-500">{t.community_sub}</p>
      </header>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-3xl shadow-card overflow-hidden border border-gray-100">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {post.user[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{post.user} <span className="font-normal text-gray-500">{post.action}</span></p>
                <p className="text-xs text-gray-400">{post.time} • <MapPin size={10} className="inline"/> {post.location}</p>
              </div>
            </div>
            
            {post.image && (
              <div className="w-full h-48 bg-gray-100 overflow-hidden">
                 {/* Placeholder for actual image */}
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    Image Content
                 </div>
              </div>
            )}
            
            <div className="p-4">
              <p className="text-gray-700 text-sm mb-3">{post.content}</p>
              <div className="flex items-center gap-6 text-gray-400">
                <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                  <Heart size={18} /> <span className="text-xs font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                  <MessageSquare size={18} /> <span className="text-xs font-medium">{t.comment}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
