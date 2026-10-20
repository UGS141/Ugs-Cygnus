import React from "react";
import { BusinessEntity } from "@/src/types/cygnus";
import {
  X,
  MapPin,
  Clock,
  Phone,
  Navigation,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Share2,
  Utensils,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface UnifiedBusinessProfileProps {
  business: BusinessEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onActionClick: (business: BusinessEntity) => void;
  onToggleSave?: (business: BusinessEntity) => void;
  isSaved?: boolean;
}

export const UnifiedBusinessProfile: React.FC<UnifiedBusinessProfileProps> = ({
  business,
  isOpen,
  onClose,
  onActionClick,
  onToggleSave,
  isSaved = false,
}) => {
  if (!isOpen || !business) return null;

  const isRestaurant = business.category === "restaurant";
  const isProduct = business.category === "product";
  const isService = ["salon", "healthcare", "repair", "academy", "hotel"].includes(business.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0D1022] border border-[#222C4D] rounded-2xl shadow-2xl text-foreground max-h-[92vh] overflow-y-auto">
        {/* Header Photos Hero */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-t-2xl bg-[#090C18]">
          <img
            src={business.photos[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1022] via-[#0D1022]/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(business)}
                className={`p-2 rounded-full border backdrop-blur-md transition-all ${
                  isSaved
                    ? "bg-[#00F5D4] text-[#06070B] border-[#00F5D4]"
                    : "bg-[#0A0D1D]/80 text-white border-white/20 hover:text-[#00F5D4]"
                }`}
                title={isSaved ? "Saved" : "Save place"}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#0A0D1D]/80 text-slate-300 hover:text-white border border-white/20 backdrop-blur-md transition-all"
              aria-label="Close profile"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Category & Availability Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F5D4] bg-[#00F5D4]/20 border border-[#00F5D4]/40 px-2 py-0.5 rounded">
                  {business.subcategory || business.category}
                </span>
                {business.availabilityTier === "verified_live" && (
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Live
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                {business.name}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-end">
                <span>★ {business.rating}</span>
              </div>
              <div className="text-[10px] text-slate-300">
                {business.reviewCount} verified reviews
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#111526] border border-[#212B47] text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-[#00F5D4] shrink-0" />
              <span className="truncate">{business.distanceKm} km from current spot</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>{business.openingHours}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 col-span-2 sm:col-span-1">
              <Phone className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span className="font-mono truncate">{business.phone}</span>
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Overview & Verified Standards
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {business.description}
            </p>
          </div>

          {/* 1. RESTAURANT SPECIFICS */}
          {isRestaurant && business.menuHighlights && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#00F5D4]" />
                  <span>Signature Menu Highlights</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Verified Prices</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {business.menuHighlights.map((dish, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#111628] border border-[#202946] text-xs">
                    <div className="flex justify-between font-bold text-white mb-1">
                      <span>{dish.name}</span>
                      <span className="text-[#00F5D4] font-mono">{dish.price}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{dish.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PRODUCT SPECIFICS */}
          {isProduct && business.specs && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>Technical Specifications & Hardware Audit</span>
              </h4>
              <div className="p-4 rounded-xl bg-[#111628] border border-[#202946] space-y-2 text-xs">
                {business.specs.map((sp, idx) => (
                  <div key={idx} className="flex justify-between border-b border-[#1A2238] pb-1.5 last:border-none">
                    <span className="text-slate-400">{sp.label}:</span>
                    <span className="text-slate-200 font-medium">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SERVICE MENU & STAFF SPECIFICS */}
          {isService && business.services && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Available Services & Diagnostics
              </h4>
              <div className="space-y-2">
                {business.services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-3 rounded-xl bg-[#111628] border border-[#202946] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{svc.name}</div>
                      <div className="text-slate-400 mt-0.5">{svc.description}</div>
                      <div className="text-[10px] text-[#38BDF8] mt-1 font-mono">
                        {svc.durationMinutes} Minutes Session
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#00F5D4] font-mono pl-3">
                      {svc.currency}{svc.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Directions and Real Google Maps Links as mandated by Maps Grounding */}
          <div className="p-3.5 rounded-xl bg-[#090C19] border border-[#1E2744] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Navigation className="w-4 h-4 text-[#00F5D4]" />
              <span>Address: {business.address}, {business.city}</span>
            </div>
            <a
              href={business.googleMapsUri || `https://maps.google.com/?q=${encodeURIComponent(business.name + " " + business.city)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#00F5D4] hover:underline flex items-center gap-1 font-medium shrink-0"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Primary Action Button Bar */}
          <div className="pt-4 border-t border-[#1C243E] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onActionClick(business);
              }}
              className="px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] flex items-center gap-2"
            >
              <span>
                {isRestaurant
                  ? "Reserve a Table"
                  : isProduct
                  ? "Buy or Store Pickup"
                  : "Book Appointment"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedBusinessProfile;
