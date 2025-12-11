
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Camera, Navigation, AlertTriangle, Minus, Plus } from 'lucide-react';
import { GeoLocation, Language } from '../types';
import { translations } from '../utils/translations';

interface ReportTrashProps {
  onReportSubmitted: (details: string) => void;
  goHome: () => void;
  language: Language;
}

// Fallback URL in case the user-provided file isn't found locally
const FALLBACK_MAP_URL = "/images/map.jpg";

const ReportTrash: React.FC<ReportTrashProps> = ({ onReportSubmitted, goHome, language }) => {
  const [view, setView] = useState<'MAP' | 'FORM'>('MAP');
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // Map Interaction State
  const [mapUrl, setMapUrl] = useState("/images/map.jpg");
  const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isDragRef = useRef(false); // Ref to track if actual movement occurred to distinguish click vs drag

  const t = translations[language];

  // Fixed positions for demo pins on the map
  const mockReports = [
    { id: 1, top: 40, left: 65, type: 'Overflow' }, // Top Right area
    { id: 2, top: 70, left: 30, type: 'Litter' },   // Bottom Left area
    { id: 3, top: 30, left: 25, type: 'Hazard' },   // Top Left area
  ];

  const handleLocateMe = () => {
    setIsLocating(true);
    // Simulate finding the user ON CAMPUS for the demo
    setTimeout(() => {
      setUserLocation({
        lat: 13.77,
        lng: 100.55
      });
      // Center view on user (approximate center for demo)
      setViewState({ x: 0, y: 0, scale: 1.5 });
      setIsLocating(false);
    }, 1500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onReportSubmitted("Campus Issue Reported");
    goHome();
  };

  // --- Map Interaction Handlers ---

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    isDragRef.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setStartPoint({ x: clientX - viewState.x, y: clientY - viewState.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const newX = clientX - startPoint.x;
    const newY = clientY - startPoint.y;

    // Check if moved enough to consider it a drag
    if (Math.abs(newX - viewState.x) > 5 || Math.abs(newY - viewState.y) > 5) {
      isDragRef.current = true;
    }

    setViewState(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (isDragRef.current) return; // Ignore click if it was a drag
    if (!mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();

    // Calculate click position relative to the container, considering the transform
    // We want the point on the UNTRANSFORMED map (0-100%)

    // Current click relative to viewport
    const clickX = e.clientX;
    const clickY = e.clientY;

    // Center of the container
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate offset from center, taking scale into account
    // (clickX - centerX) / scale = offset from unscaled center
    // But we are translating the map so:
    // P_screen = P_map * scale + translation + center_screen
    // P_map = (P_screen - translation - center_screen) / scale

    // Wait, simplier: relative to top-left of the image container div?
    // The image logic uses top/left percentages.

    // Let's use simple relative coordinates computed from the visual click
    // We need to inverse the transform to find where we clicked on the "original" image

    // rect is the container window. The map div is inside.
    const container = mapContainerRef.current;

    // Click relative to the container element
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Adjust for translation
    const xWithTrans = relX - viewState.x;
    const yWithTrans = relY - viewState.y;

    // Adjust for scale - Zoom is centered?
    // Currently CSS transform-origin is center.
    // If we assume origin is top-left for simplicity in calculation:
    // With transform-origin center:
    // The visual X is: (realX - width/2) * scale + width/2 + translateX
    // Inverse: realX = ((visualX - translateX - width/2) / scale) + width/2

    const width = rect.width;
    const height = rect.height;

    const x = ((relX - viewState.x - width / 2) / viewState.scale) + width / 2;
    const y = ((relY - viewState.y - height / 2) / viewState.scale) + height / 2;

    const percentX = (x / width) * 100;
    const percentY = (y / height) * 100;

    setSelectedPoint({ x: percentX, y: percentY });
  };

  const handleZoom = (delta: number) => {
    setViewState(prev => ({
      ...prev,
      scale: Math.min(Math.max(0.5, prev.scale + delta), 4)
    }));
  };

  if (view === 'MAP') {
    return (
      <div className="relative w-full h-full min-h-[80vh] bg-gray-200 overflow-hidden select-none">

        {/* Interactive Map Container */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 cursor-move touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onClick={handleMapClick}
        >
          <div
            className="w-full h-full relative transition-transform duration-75 ease-out origin-center"
            style={{
              transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`
            }}
          >
            {/* Map Image */}
            <img
              src={mapUrl}
              onError={() => setMapUrl(FALLBACK_MAP_URL)}
              alt="Surasakmontree School Map"
              className="w-full h-full object-contain pointer-events-none opacity-90"
              draggable={false}
            />

            {/* Gradient overlays */}
            {/* Note: Overlays moving with map might look weird, maybe better fixed? 
                    For now, keep inside to scale with map, or move outside for HUD feel.
                    Let's move huge gradients OUTSIDE to be HUD-like if they are effectively UI.
                */}


            {/* Mock Pins */}
            {mockReports.map(report => (
              <div
                key={report.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: `${report.top}%`, left: `${report.left}%` }}
              >
                <div className="relative group cursor-pointer">
                  <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce-slow hover:scale-110 transition-transform">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap shadow-sm font-bold z-20">
                    {report.type}
                  </div>
                </div>
              </div>
            ))}

            {/* User Pin Simulation */}
            {userLocation && (
              <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center relative z-10">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  {/* Pulse */}
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
            )}

            {/* Selected Point Pin */}
            {selectedPoint && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-[100%] z-30"
                style={{ top: `${selectedPoint.y}%`, left: `${selectedPoint.x}%` }}
              >
                <div className="relative animate-bounce">
                  <MapPin className="w-10 h-10 text-red-600 drop-shadow-lg filter" fill="currentColor" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap mt-1 text-red-600">
                    {t.report_issue_btn}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* HUD Overlays (Fixed UI) */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>


        {/* Zoom Controls */}
        <div className="absolute top-24 right-4 flex flex-col gap-2 z-30">
          <button onClick={() => handleZoom(0.5)} className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 active:scale-95 border border-gray-100 text-gray-700">
            <Plus size={24} />
          </button>
          <button onClick={() => handleZoom(-0.5)} className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 active:scale-95 border border-gray-100 text-gray-700">
            <Minus size={24} />
          </button>
        </div>

        {/* Action Controls */}
        <div className="absolute bottom-24 left-4 right-4 flex flex-col gap-3 z-30">
          <div className="flex justify-between items-end">
            {/* Reset View Button? Maybe later */}
            <div></div>

            <button
              onClick={handleLocateMe}
              className="bg-white p-3 rounded-full shadow-lg text-gray-700 hover:bg-gray-50 active:scale-95 border border-gray-100 flex items-center justify-center w-12 h-12"
            >
              {isLocating ? <span className="animate-spin block text-lg">⏳</span> : <Navigation size={24} className="text-blue-500" />}
            </button>
          </div>

          <button
            onClick={() => {
              if (selectedPoint) {
                setView('FORM');
              } else {
                // Maybe show a toast: "Tap on map to select location"
                // For now, default behavior works
                setView('FORM');
              }
            }}
            className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform border border-red-600"
          >
            <AlertTriangle size={20} />
            {selectedPoint ? t.report_issue_btn : "Select Location first"}
          </button>
        </div>

        {/* Report Count Badge */}
        <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-soft border border-gray-100 z-30 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800 leading-tight">{t.campus_issues}</h2>
            <p className="text-[10px] text-gray-500">{selectedPoint ? "Point Selected" : t.report_sub}</p>
          </div>
          <div className="bg-red-50 text-red-500 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {mockReports.length} Active
          </div>
        </div>
      </div>
    );
  }

  // FORM VIEW
  return (
    <div className="p-6 space-y-6 pb-24 animate-slide-up bg-white min-h-full">
      <header className="flex items-center gap-3">
        <button onClick={() => setView('MAP')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <span className="text-lg font-bold">← {t.report_back}</span>
        </button>
      </header>

      <div>
        <h2 className="text-2xl font-black text-gray-800">{t.report_header}</h2>
        <p className="text-sm text-gray-500 mt-1">Surasakmontree School</p>
      </div>

      <div className="space-y-5">
        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{t.evidence_photo}</label>
          <div className="relative w-full h-56 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer group">
            {photoPreview ? (
              <img src={photoPreview} className="w-full h-full object-cover" alt="Evidence" />
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600">{t.tap_upload}</span>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoUpload} />
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{t.issue_desc}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-2xl h-32 resize-none focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-gray-50"
            placeholder={t.issue_desc_placeholder}
          ></textarea>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-700 text-sm">
          <MapPin size={18} className="shrink-0" />
          <span className="font-medium">
            {selectedPoint
              ? `Selected Location: ${selectedPoint.x.toFixed(0)}%, ${selectedPoint.y.toFixed(0)}%`
              : t.loc_captured}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!description || !photo}
        className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${!description || !photo
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-red-500 active:scale-95 hover:bg-red-600 shadow-red-500/30'
          }`}
      >
        {t.submit_report}
      </button>
    </div>
  );
};

export default ReportTrash;
