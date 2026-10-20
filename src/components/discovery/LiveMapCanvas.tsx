import React, { useState } from "react";
import { BusinessEntity } from "@/src/types/cygnus";
import {
  MapPin,
  Navigation,
  Crosshair,
  Compass,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
  Plus,
  Minus,
  RotateCcw,
  ShieldCheck,
  Star,
  Car,
  Footprints,
  Train,
  Sprout,
  Wrench,
  Laptop,
  Utensils,
  Stethoscope,
  GraduationCap,
  Building2,
  Tractor,
  Layers,
  Search,
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
  onOpenBookingModal?: (biz: BusinessEntity) => void;
  onManualLocationChange?: (locationName: string, coords: { lat: number; lng: number }) => void;
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
  onOpenBookingModal,
  onManualLocationChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeMapCategory, setActiveMapCategory] = useState<string>("all");
  const [hoveredBusinessId, setHoveredBusinessId] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<"driving" | "walking" | "transit">("driving");
  const [isAreaPanned, setIsAreaPanned] = useState(false);

  // Center coordinates (fallback to userCoords or Nellore/Delhi depending on active region)
  const centerLat = userCoords?.lat || 28.6139;
  const centerLng = userCoords?.lng || 77.2090;

  // Scale based on radius and user-controlled zoom
  const scale = (380 / (radiusKm * 0.04)) * zoomLevel;

  const getPos = (lat: number, lng: number) => {
    const x = 50 + (lng - centerLng) * scale;
    const y = 50 - (lat - centerLat) * scale;
    return {
      x: Math.max(6, Math.min(94, x)),
      y: Math.max(6, Math.min(94, y)),
    };
  };

  const filteredByMapCategory = businesses.filter((b) => {
    if (activeMapCategory === "all") return true;
    return b.category === activeMapCategory;
  });

  const activeId = hoveredBusinessId || selectedId;
  const selectedBusiness = businesses.find((b) => b.id === activeId) || businesses.find((b) => b.id === selectedId);

  const handleZoomIn = () => {
    setZoomLevel((z) => Math.min(2.5, z + 0.25));
    setIsAreaPanned(true);
  };

  const handleZoomOut = () => {
    setZoomLevel((z) => Math.max(0.5, z - 0.25));
    setIsAreaPanned(true);
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setIsAreaPanned(false);
  };

  // Travel calculation based on mode
  const getTravelETA = (distKm: number) => {
    if (travelMode === "driving") {
      const mins = Math.max(2, Math.round((distKm / 35) * 60));
      return { time: `${mins} min`, label: "Drive via arterial roads", icon: <Car className="w-3 h-3" /> };
    } else if (travelMode === "walking") {
      const mins = Math.max(3, Math.round((distKm / 4.5) * 60));
      return { time: `${mins} min`, label: "Walk via sidewalks", icon: <Footprints className="w-3 h-3" /> };
    } else {
      const mins = Math.max(5, Math.round((distKm / 28) * 60 + 8));
      return { time: `${mins} min`, label: "Metro / Transit", icon: <Train className="w-3 h-3" /> };
    }
  };

  // Helper for category badge icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "agriculture":
        return <Sprout className="w-3.5 h-3.5 text-emerald-400" />;
      case "home_services":
        return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      case "product":
        return <Laptop className="w-3.5 h-3.5 text-cyan-400" />;
      case "restaurant":
        return <Utensils className="w-3.5 h-3.5 text-teal-400" />;
      case "healthcare":
        return <Stethoscope className="w-3.5 h-3.5 text-rose-400" />;
      case "academy":
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />;
      case "construction":
        return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-[#00F5D4]" />;
    }
  };

  return (
    <div
      className={`relative w-full h-[460px] sm:h-[540px] lg:h-[660px] rounded-3xl overflow-hidden border border-[#1E2540] bg-[#060814] select-none shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Background Cartographic Styling (Dark Mode Vector Map Canvas) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B1024" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#070A18" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#04060E" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="routeLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#mapGlow)" />
        <rect width="100" height="100" fill="url(#gridPattern)" />

        {/* Outer Circular Search Radius Boundary */}
        <circle
          cx="50"
          cy="50"
          r={Math.min(46, (18 * (radiusKm / 5)) * zoomLevel)}
          fill="rgba(0, 245, 212, 0.025)"
          stroke="rgba(0, 245, 212, 0.25)"
          strokeWidth="0.4"
          strokeDasharray="1.5, 1.5"
        />

        {/* Secondary ring for aesthetic depth */}
        <circle
          cx="50"
          cy="50"
          r={Math.min(30, (10 * (radiusKm / 5)) * zoomLevel)}
          fill="none"
          stroke="rgba(56, 189, 248, 0.15)"
          strokeWidth="0.3"
        />

        {/* Vector Street Grid & Concentric Ring Roads */}
        <path
          d="M 5 50 Q 50 48 95 50 M 50 5 Q 48 50 50 95 M 15 15 L 85 85 M 15 85 L 85 15"
          stroke="#101830"
          strokeWidth="0.5"
          fill="none"
        />
        <circle cx="50" cy="50" r="15" stroke="#162244" strokeWidth="0.7" fill="none" />
        <circle cx="50" cy="50" r="28" stroke="#121C36" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="42" stroke="#0E162C" strokeWidth="0.4" fill="none" />

        {/* Highway Arcs */}
        <path
          d="M 0 35 C 30 40, 70 20, 100 25 M 0 65 C 40 70, 60 85, 100 75"
          stroke="#192446"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 25 0 C 35 40, 25 70, 35 100 M 75 0 C 65 30, 80 70, 70 100"
          stroke="#131B34"
          strokeWidth="0.9"
          fill="none"
        />

        {/* Selected navigation route line with animated dash */}
        {selectedBusiness && (
          <g>
            <line
              x1="50"
              y1="50"
              x2={getPos(selectedBusiness.lat, selectedBusiness.lng).x}
              y2={getPos(selectedBusiness.lat, selectedBusiness.lng).y}
              stroke="url(#routeLine)"
              strokeWidth="0.8"
              strokeDasharray="2, 1"
            />
            {/* Animated signal dot traveling along route */}
            <circle
              r="1"
              fill="#00F5D4"
            >
              <animateMotion
                path={`M 50 50 L ${getPos(selectedBusiness.lat, selectedBusiness.lng).x} ${getPos(selectedBusiness.lat, selectedBusiness.lng).y}`}
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* User Current Location Beacon with pulsating sonar ripple */}
        <circle cx="50" cy="50" r="2.2" fill="#38BDF8" />
        <circle cx="50" cy="50" r="3.2" fill="none" stroke="#00F5D4" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="2.2" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.8">
          <animate attributeName="r" values="2.2;14" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Top Map Controls Header */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-30">
        {/* Radius Selector Pills */}
        <div className="flex items-center gap-1 bg-[#0A0D1D]/90 border border-[#1E2744] p-1 rounded-2xl pointer-events-auto backdrop-blur-xl shadow-lg">
          <span className="text-[10px] text-slate-400 font-mono px-2 hidden sm:inline">Radius:</span>
          {[2, 5, 10, 25, 50].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRadiusChange(r)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all ${
                radiusKm === r
                  ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_12px_rgba(0,245,212,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {r}km
            </button>
          ))}
        </div>

        {/* Travel Mode Dock: Driving / Walking / Transit */}
        <div className="flex items-center bg-[#0A0D1D]/90 border border-[#1E2744] rounded-2xl p-1 pointer-events-auto backdrop-blur-xl shadow-lg">
          {(
            [
              { id: "driving", icon: <Car className="w-3.5 h-3.5" />, label: "Drive" },
              { id: "walking", icon: <Footprints className="w-3.5 h-3.5" />, label: "Walk" },
              { id: "transit", icon: <Train className="w-3.5 h-3.5" />, label: "Transit" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setTravelMode(m.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                travelMode === m.id
                  ? "bg-[#00F5D4] text-[#06070B] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              title={`Switch to ${m.label} ETA mode`}
            >
              {m.icon}
              <span className="hidden sm:inline text-[11px]">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Right side controls: Location trigger & Zoom controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Zoom In/Out Dock */}
          <div className="flex items-center bg-[#0A0D1D]/90 border border-[#1E2744] rounded-2xl p-0.5 backdrop-blur-xl shadow-lg">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-[#1E2744]" />
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <>
                <div className="w-[1px] h-3.5 bg-[#1E2744]" />
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 text-[#00F5D4] hover:bg-white/10 rounded-xl transition-all text-[10px] font-mono"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </>
            )}
          </div>

          {/* Current Location Action */}
          <button
            type="button"
            onClick={onLocateMe}
            disabled={isLocating}
            className="p-2 rounded-2xl bg-[#0A0D1D]/90 border border-[#1E2744] text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4] transition-all shadow-lg flex items-center gap-1.5 text-xs font-medium backdrop-blur-xl"
            title="Locate Current Position"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? "animate-spin text-[#00F5D4]" : "text-[#00F5D4]"}`} />
            <span className="hidden sm:inline text-xs">Locate</span>
          </button>
        </div>
      </div>

      {/* Floating Search this area button if panned */}
      {isAreaPanned && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-auto z-30 animate-fade-in">
          <button
            type="button"
            onClick={() => setIsAreaPanned(false)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0D1328] border border-[#00F5D4] text-[#00F5D4] shadow-xl flex items-center gap-1.5 hover:bg-[#00F5D4] hover:text-[#06070B] transition-all"
          >
            <Search className="w-3 h-3" />
            <span>Search This Area</span>
          </button>
        </div>
      )}

      {/* Category filter pills bar floating on top left under controls */}
      <div className="absolute top-16 left-3.5 pointer-events-none z-20 hidden md:flex items-center gap-1">
        {[
          { id: "all", label: "All Pins" },
          { id: "agriculture", label: "🌾 Agri & Farm" },
          { id: "home_services", label: "🔧 Plumber & Electrician" },
          { id: "product", label: "💻 Hardware" },
          { id: "restaurant", label: "🍽️ Dining" },
          { id: "healthcare", label: "🏥 Clinics" },
          { id: "construction", label: "🏗️ Construction" },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveMapCategory(c.id)}
            className={`pointer-events-auto px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all backdrop-blur-md ${
              activeMapCategory === c.id
                ? "bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4]"
                : "bg-[#090D1C]/80 border-[#1B233C] text-slate-400 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Interactive Map Location Markers */}
      {filteredByMapCategory.map((biz) => {
        const pos = getPos(biz.lat, biz.lng);
        const isSelected = biz.id === selectedId;
        const isHovered = biz.id === hoveredBusinessId;
        const isVerified = biz.availabilityTier === "verified_live";

        return (
          <div
            key={biz.id}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onSelectBusiness(biz.id)}
            onMouseEnter={() => setHoveredBusinessId(biz.id)}
            onMouseLeave={() => setHoveredBusinessId(null)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20 ${
              isSelected || isHovered ? "z-30 scale-125" : "hover:scale-110"
            }`}
          >
            {/* Marker Ring with Category Icon */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_22px_#00F5D4]"
                  : isHovered
                  ? "bg-[#38BDF8] text-[#06070B] shadow-[0_0_15px_#38BDF8]"
                  : isVerified
                  ? "bg-[#0E1528] border-2 border-[#00F5D4] text-[#00F5D4] hover:bg-[#131E38]"
                  : "bg-[#0E1528] border-2 border-[#38BDF8] text-[#38BDF8] hover:bg-[#131E38]"
              }`}
            >
              {getCategoryIcon(biz.category)}
            </div>

            {/* Price / Category Pill Label */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold whitespace-nowrap border pointer-events-none transition-all shadow-md ${
                isSelected
                  ? "bg-[#00F5D4] text-[#06070B] border-[#00F5D4]"
                  : "bg-[#090C1A]/95 text-slate-300 border-[#1F2742] group-hover:text-white"
              }`}
            >
              {biz.priceSample ? `${biz.currency || "₹"}${biz.priceSample.toLocaleString()}` : biz.priceRange}
            </div>
          </div>
        );
      })}

      {/* Floating Bottom Card for Selected Result */}
      {selectedBusiness && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-30 bg-[#0C1022]/95 border border-[#232D4E] rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-up">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F5D4] bg-[#00F5D4]/15 px-1.5 py-0.5 rounded border border-[#00F5D4]/30">
                  {selectedBusiness.category.replace("_", " ")}
                </span>
                {selectedBusiness.availabilityTier === "verified_live" && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Live
                  </span>
                )}
                {/* Data freshness badge */}
                {selectedBusiness.dataFreshness && (
                  <span className="text-[9px] text-slate-400 font-mono bg-white/5 px-1.5 py-0.5 rounded">
                    {selectedBusiness.dataFreshness.lastVerifiedAt}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {selectedBusiness.name}
              </h4>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#00F5D4] shrink-0" />
                <span className="truncate">{selectedBusiness.address}, {selectedBusiness.city}</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-0.5 justify-end">
                <Star className="w-3 h-3 fill-current text-amber-400" />
                <span>{selectedBusiness.rating}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {selectedBusiness.distanceKm} km away
              </div>
            </div>
          </div>

          {/* Travel ETA info bar */}
          <div className="mt-2.5 p-2 rounded-xl bg-[#090C19] border border-[#18213A] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              {getTravelETA(selectedBusiness.distanceKm).icon}
              <span className="text-white font-bold">{getTravelETA(selectedBusiness.distanceKm).time}</span>
              <span className="text-[10px] text-slate-400">({getTravelETA(selectedBusiness.distanceKm).label})</span>
            </div>
            <span className="text-[10px] text-[#00F5D4]">
              {selectedBusiness.distanceKm} km
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-[#1C243E] flex items-center justify-between gap-2">
            <a
              href={
                selectedBusiness.googleMapsUri ||
                `https://maps.google.com/?q=${encodeURIComponent(
                  selectedBusiness.name + " " + selectedBusiness.city
                )}`
              }
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-300 hover:text-[#00F5D4] transition-colors flex items-center gap-1 font-mono"
            >
              <Navigation className="w-3 h-3 text-[#00F5D4]" />
              <span>Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                if (onOpenBookingModal) {
                  onOpenBookingModal(selectedBusiness);
                } else {
                  onSelectBusiness(selectedBusiness.id);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 transition-all shadow-[0_0_12px_rgba(0,245,212,0.3)] cursor-pointer"
            >
              {selectedBusiness.actionType === "reserve_table"
                ? "Reserve Table"
                : selectedBusiness.actionType === "buy_product"
                ? "Buy / Pickup"
                : selectedBusiness.actionType === "request_service"
                ? "Request Plumber/Tech"
                : selectedBusiness.actionType === "rent_equipment"
                ? "Rent Machinery"
                : selectedBusiness.actionType === "request_quotation"
                ? "Request Quote"
                : selectedBusiness.actionType === "enroll_course"
                ? "Enroll in Class"
                : selectedBusiness.actionType === "schedule_site_visit"
                ? "Schedule Tour"
                : "Book Slot"}
            </button>
          </div>
        </div>
      )}

      {/* Geospatial Radar Coordinates Indicator Badge */}
      <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-slate-400 bg-[#060812]/90 px-2.5 py-1 rounded-xl border border-[#182036] pointer-events-none backdrop-blur-md flex items-center gap-1.5">
        <Compass className="w-3 h-3 text-[#00F5D4]" />
        <span>CYGNUS Real-Time Cartography · Dynamic Grounding Active</span>
      </div>
    </div>
  );
};

export default LiveMapCanvas;
