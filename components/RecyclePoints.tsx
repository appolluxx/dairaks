
import React, { useState, useRef } from 'react';
import { Camera, CheckCircle, Loader2, Info, ArrowLeft } from 'lucide-react';
import { WasteType, Language } from '../types';
import { analyzeRecycleImage } from '../services/geminiService';
import { translations } from '../utils/translations';

interface RecyclePointsProps {
  onPointsAwarded: (points: number, details: string) => void;
  goHome: () => void;
  language: Language;
}

const RecyclePoints: React.FC<RecyclePointsProps> = ({ onPointsAwarded, goHome, language }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [wasteType, setWasteType] = useState<WasteType>(WasteType.PLASTIC);
  const [quantity, setQuantity] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Auto-analyze with Gemini
      setIsAnalyzing(true);
      setStep(2); // Move to form immediately, show loader inside
      
      try {
        const analysis = await analyzeRecycleImage(file);
        setWasteType(analysis.wasteType);
        setQuantity(analysis.quantityEstimate);
        setDescription(analysis.itemDescription);
      } catch (err) {
        console.error("AI Error", err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSubmit = () => {
    // Simulate submission
    setTimeout(() => {
      onPointsAwarded(10, `Recycled ${wasteType}`);
      setStep(3);
    }, 800);
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in bg-white">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">{t.awesome}</h2>
        <p className="text-5xl font-black text-primary mb-4">+10 <span className="text-xl font-medium text-gray-500">XP</span></p>
        <p className="text-gray-500 mb-8 max-w-[200px]">{t.help_reduce}</p>
        <button 
          onClick={goHome}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          {t.return_dash}
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 pb-28 animate-fade-in">
      <header className="flex items-center gap-3">
        <button onClick={goHome} className="p-2 rounded-full bg-white shadow-sm text-gray-500 hover:text-gray-800">
           <ArrowLeft size={20} />
        </button>
        <div>
           <h2 className="text-2xl font-bold text-gray-800">{t.scan_header}</h2>
           <p className="text-xs text-gray-500">{t.ai_powered}</p>
        </div>
      </header>

      {step === 1 && (
        <div className="flex flex-col items-center justify-center space-y-6 mt-4">
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="w-full h-80 border-4 border-dashed border-primary/20 rounded-[2rem] flex flex-col items-center justify-center bg-white shadow-soft cursor-pointer hover:border-primary/50 transition-all active:scale-95 group"
           >
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
                <Camera className="w-10 h-10 text-primary" />
             </div>
             <p className="text-xl font-bold text-gray-700">{t.take_photo}</p>
             <p className="text-sm text-gray-400 mt-2">{t.tap_scan}</p>
           </div>
           <input 
             ref={fileInputRef}
             type="file" 
             accept="image/*" 
             className="hidden" 
             onChange={handleFileChange}
           />
           <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 text-sm text-blue-700 w-full">
             <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <p>{t.ai_info}</p>
           </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-slide-up space-y-6">
          <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-card bg-gray-100 border-4 border-white">
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-md flex flex-col items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin mb-3" />
                <span className="text-lg font-bold tracking-wide">{t.analyzing}</span>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-soft space-y-5">
             <div className="space-y-3">
               <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{t.waste_type}</label>
               <div className="grid grid-cols-3 gap-2">
                 {Object.values(WasteType).map((type) => (
                   <button
                     key={type}
                     onClick={() => setWasteType(type)}
                     className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                       wasteType === type 
                       ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                       : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                     }`}
                   >
                     {type}
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{t.est_qty}</label>
               <input 
                 type="text" 
                 value={quantity}
                 onChange={(e) => setQuantity(e.target.value)}
                 placeholder={t.est_qty_placeholder}
                 className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-gray-50 font-medium"
               />
             </div>

             {description && (
               <div className="bg-green-50 p-3 rounded-xl text-xs text-green-700 flex gap-2">
                 <CheckCircle size={14} className="mt-0.5 shrink-0"/>
                 <span>AI Identified: {description}</span>
               </div>
             )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isAnalyzing || !quantity}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
              isAnalyzing || !quantity ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary active:scale-95 hover:bg-green-600'
            }`}
          >
            {isAnalyzing ? t.processing : t.submit_claim}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecyclePoints;
