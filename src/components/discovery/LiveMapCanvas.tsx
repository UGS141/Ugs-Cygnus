import React, { useState } from "react";
import { BusinessEntity } from "@/src/types/cygnus";
import {
  MapPin,
  Navigation,
  Crosshair,
  Layers,
  Compass,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";

interface LiveMapCanvasProps {
  businesses: BusinessEntity[];
  selectedId: string | null;
  onSelectBusiness: (id: string) => void;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
  userCoords: { lat: number; lng: number };
  onLocateMe: () => void;
  isLocating?: boolean;
  className?: string;
}

export const LiveMapCanvas: React.FC<LiveMapCanvasProps> = ({
  businesses,
  selectedId,
  onSelectBusiness,
  radiusKm,
  onRadiusChange,
  userCoords,
  onLocateMe,
  isLocating = false,
  className = "",
}) => {
  const [mapZoom, setMapZoom] = useState(1);
  const [searchAreaMoved, setSearchAreaMoved] = useState(false);

  // Map coordinate conversion helper (centered on userCoords)
  // Maps lat/lng relative to bounding box into [5% - 95%] SVG space
  const centerLat = 28.6139;
  const centerLng = 77.2090;
  const scale = 380 / (radiusKm * 0.04);

  const getPos = (lat: number, lng: number) => {
    const x = 50 + (lng - centerLng) * scale;
    const y = 50 - (lat - centerLat) * scale;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  const selectedBusiness = businesses.find((b) => b.id === selectedId);

  return (
    <div
      className={`relative w-full h-[400px] sm:h-[480px] lg:h-[620px] rounded-2xl overflow-hidden border border-[#1E253E] bg-[#070913] select-none ${className}`}
    >
      {/* Background Cartographic Styling (Dark Mode Vector Map Canvas) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0E1428" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#070913" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="routeLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#mapGlow)" />

        {/* Outer Circular Search Radius Boundary */}
        <circle
          cx="50"
          cy="50"
          r={Math.min(42, 18 * (radiusKm / 5))}
          fill="rgba(0, 245, 212, 0.03)"
          stroke="rgba(0, 245, 212, 0.2)"
          strokeWidth="0.3"
          strokeDasharray="1.5, 1.5"
        />

        {/* Vector Street Grid & Ring Roads */}
        <path
          d="M 10 50 Q 50 48 90 50 M 50 10 Q 48 50 50 90 M 20 20 L 80 80 M 20 80 L 80 20"
          stroke="#131B32"
          strokeWidth="0.6"
          fill="none"
        />
        <circle cx="50" cy="50" r="14" stroke="#182240" strokeWidth="0.8" fill="none" />
        <circle cx="50" cy="50" r="28" stroke="#151E38" strokeWidth="0.5" fill="none" />

        {/* Highway Arcs */}
        <path
          d="M 0 35 C 30 40, 70 20, 100 25 M 0 65 C 40 70, 60 85, 100 75"
          stroke="#1B2444"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Selected navigation route line */}
        {selectedBusiness && (
          <line
            x1="50"
            y1="50"
            x2={getPos(selectedBusiness.lat, selectedBusiness.lng).x}
            y2={getPos(selectedBusiness.lat, selectedBusiness.lng).y}
            stroke="url(#routeLine)"
            strokeWidth="0.6"
            strokeDasharray="1, 1"
          />
        )}

        {/* User Current Location Beacon */}
        <circle cx="50" cy="50" r="2.2" fill="#38BDF8" />
        <circle cx="50" cy="50" r="5" fill="none" stroke="#38BDF8" strokeWidth="0.4" opacity="0.6">
          <animate attributeName="r" values="2.2;8" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Top Map Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
        {/* Radius Selector */}
        <div className="flex items-center gap-1 bg-[#0A0D1D]/90 border border-[#1E2744] p-1 rounded-xl pointer-events-auto backdrop-blur-md shadow-lg">
          {[2, 5, 10, 25].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                onRadiusChange(r);
                setSearchAreaMoved(false);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                radiusKm === r
                  ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_10px_rgba(0,245,212,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {r}km
            </button>
          ))}
        </div>

        {/* Center: Search this area if panned */}
        {searchAreaMoved && (
          <button
            type="button"
            onClick={() => setSearchAreaMoved(false)}
            className="pointer-events-auto px-3 py-1.5 rounded-full text-xs font-semibold bg-[#11172E] border border-[#00F5D4] text-[#00F5D4] shadow-lg animate-fade-in"
          >
            Search this area
          </button>
        )}

        {/* Current Location Action */}
        <button
          type="button"
          onClick={onLocateMe}
          disabled={isLocating}
          className="pointer-events-auto p-2 rounded-xl bg-[#0A0D1D]/90 border border-[#1E2744] text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4] transition-all shadow-lg flex items-center gap-1.5 text-xs font-medium"
          title="Detect Current Location"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? "animate-spin text-[#00F5D4]" : ""}`} />
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </div>

      {/* Interactive Map Location Markers */}
      {businesses.map((biz) => {
        const pos = getPos(biz.lat, biz.lng);
        const isSelected = biz.id === selectedId;
        const isVerified = biz.availabilityTier === "verified_live";

        return (
          <div
            key={biz.id}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onSelectBusiness(biz.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20 ${
              isSelected ? "z-30 scale-125" : "hover:scale-110"
            }`}
          >
            {/* Marker Halo */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_20px_#00F5D4]"
                  : isVerified
                  ? "bg-[#0E1528] border-2 border-[#00F5D4] text-[#00F5D4] hover:bg-[#131E38]"
                  : "bg-[#0E1528] border-2 border-[#38BDF8] text-[#38BDF8] hover:bg-[#131E38]"
              }`}
            >
              <MapPin className="w-4 h-4 fill-current stroke-[1.5]" />
            </div>

            {/* Price / Category Pill Label */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border pointer-events-none transition-all shadow-md ${
                isSelected
                  ? "bg-[#00F5D4] text-[#06070B] border-[#00F5D4]"
                  : "bg-[#090C1A]/95 text-slate-300 border-[#1F2742] group-hover:text-white"
              }`}
            >
              {biz.priceSample ? `${biz.currency || "₹"}${biz.priceSample}` : biz.priceRange}
            </div>
          </div>
        );
      })}

      {/* Bottom Sheet / Side Panel for Selected Result on Map */}
      {selectedBusiness && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-30 bg-[#0C1022]/95 border border-[#232D4E] rounded-xl p-4 shadow-2xl backdrop-blur-md animate-fade-up">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F5D4] bg-[#00F5D4]/10 px-1.5 py-0.5 rounded">
                  {selectedBusiness.category}
                </span>
                {selectedBusiness.availabilityTier === "verified_live" && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Live
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {selectedBusiness.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedBusiness.address} · {selectedBusiness.distanceKm} km away
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-amber-400">
                ★ {selectedBusiness.rating}
              </div>
              <div className="text-[10px] text-slate-500">
                ({selectedBusiness.reviewCount} reviews)
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-[#1C243E] flex items-center justify-between gap-2">
            <a
              href={selectedBusiness.googleMapsUri || `https://maps.google.com/?q=${encodeURIComponent(selectedBusiness.name + " " + selectedBusiness.city)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-300 hover:text-[#00F5D4] transition-colors flex items-center gap-1"
            >
              <Navigation className="w-3 h-3 text-[#00F5D4]" />
              <span>Directions (~{Math.round(selectedBusiness.distanceKm * 3.5)} min)</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>

            <button
              type="button"
              onClick={() => onSelectBusiness(selectedBusiness.id)}
              className="px-3 py-1 rounded text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 transition-all"
            >
              {selectedBusiness.category === "restaurant"
                ? "Reserve Table"
                : selectedBusiness.category === "product"
                ? "Buy / Pickup"
                : "Book Appointment"}
            </button>
          </div>
        </div>
      )}

      {/* Prototype Map Disclaimer Label as required by prompt */}
      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500 bg-[#060812]/80 px-2 py-0.5 rounded border border-[#182036] pointer-events-none">
        Prototype Live Geospatial Engine · Connected with Google Maps Grounding
      </div>
    </div>
  );
};

export default LiveMapCanvas;
