import React, { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  Wifi,
  Car,
  CreditCard,
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

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const isRestaurant = business.category === "restaurant";
  const isProduct = business.category === "product";
  const isService = ["salon", "healthcare", "repair", "academy", "hotel"].includes(business.category);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const nextPhoto = () => {
    if (business.photos.length > 1) {
      setActivePhotoIndex((prev) => (prev + 1) % business.photos.length);
    }
  };

  const prevPhoto = () => {
    if (business.photos.length > 1) {
      setActivePhotoIndex((prev) => (prev - 1 + business.photos.length) % business.photos.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B0F21] border border-[#212C4D] rounded-3xl shadow-2xl text-foreground max-h-[92vh] overflow-y-auto">
        {/* Header Photos Hero with Gallery Navigation */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden rounded-t-3xl bg-[#090C18] group">
          <img
            src={business.photos[activePhotoIndex] || business.photos[0]}
            alt={business.name}
            className="w-full h-full object-cover transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F21] via-[#0B0F21]/40 to-transparent" />

          {/* Photo Navigation Arrows if multiple photos */}
          {business.photos.length > 1 && (
            <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={prevPhoto}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white pointer-events-auto backdrop-blur-md transition-all"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextPhoto}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white pointer-events-auto backdrop-blur-md transition-all"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-[#0A0D1D]/80 text-white hover:text-[#00F5D4] border border-white/20 backdrop-blur-md transition-all"
              title={copiedLink ? "Link Copied!" : "Share Place"}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(business)}
                className={`p-2.5 rounded-full border backdrop-blur-md transition-all ${
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
              className="p-2.5 rounded-full bg-[#0A0D1D]/80 text-slate-300 hover:text-white border border-white/20 backdrop-blur-md transition-all"
              aria-label="Close profile"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Category & Availability Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F5D4] bg-[#00F5D4]/20 border border-[#00F5D4]/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                  {business.subcategory || business.category}
                </span>
                {business.availabilityTier === "verified_live" && (
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium backdrop-blur-md">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Live Slots
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                {business.name}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-end font-mono">
                <Star className="w-4 h-4 fill-current text-amber-400" />
                <span>{business.rating}</span>
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                {business.reviewCount} verified reviews
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#101528] border border-[#1F2948] text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-[#00F5D4] shrink-0" />
              <span className="truncate">{business.distanceKm} km away</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span className="truncate">{business.openingHours}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 col-span-2 sm:col-span-1">
              <Phone className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span className="font-mono truncate">{business.phone}</span>
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 font-mono">
              Overview & Verification Standards
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {business.description}
            </p>
          </div>

          {/* Amenities & Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#101528] border border-[#1E2744] text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Confirmation</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#101528] border border-[#1E2744] text-slate-300">
              <CreditCard className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Digital & Card Payments</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#101528] border border-[#1E2744] text-slate-300">
              <Car className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Valet / Parking Available</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#101528] border border-[#1E2744] text-slate-300">
              <Wifi className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>High-Speed WiFi</span>
            </span>
          </div>

          {/* 1. RESTAURANT SPECIFICS */}
          {isRestaurant && business.menuHighlights && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5 font-mono">
                  <Utensils className="w-3.5 h-3.5 text-[#00F5D4]" />
                  <span>Signature Menu Highlights</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Direct Kitchen Pricing</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {business.menuHighlights.map((dish, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#101528] border border-[#1F2948] text-xs">
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
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5 font-mono">
                <ShoppingBag className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>Technical Specifications & Hardware Audit</span>
              </h4>
              <div className="p-4 rounded-2xl bg-[#101528] border border-[#1F2948] space-y-2 text-xs">
                {business.specs.map((sp, idx) => (
                  <div key={idx} className="flex justify-between border-b border-[#1A2238] pb-1.5 last:border-none">
                    <span className="text-slate-400">{sp.label}:</span>
                    <span className="text-slate-200 font-medium">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SERVICE MENU SPECIFICS */}
          {business.services && business.services.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                Available Services & Delivery Slots
              </h4>
              <div className="space-y-2">
                {business.services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-3.5 rounded-2xl bg-[#101528] border border-[#1F2948] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{svc.name}</div>
                      <div className="text-slate-400 mt-0.5">{svc.description}</div>
                      <div className="text-[10px] text-[#38BDF8] mt-1 font-mono">
                        {svc.durationMinutes} Minutes Session
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#00F5D4] font-mono pl-3">
                      {svc.currency}{svc.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. HEALTHCARE STAFF & SPECIALISTS */}
          {business.staff && business.staff.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                Attending Physicians & Specialists
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {business.staff.map((st) => (
                  <div key={st.id} className="p-3.5 rounded-xl bg-[#101528] border border-[#1F2948] text-xs">
                    <div className="font-bold text-white text-sm">{st.name}</div>
                    <div className="text-[#38BDF8] text-[11px] mt-0.5">{st.role}</div>
                    <div className="text-amber-400 font-mono text-[11px] mt-1 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{st.rating} rating</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. MACHINERY & FARM IMPLEMENT FLEET */}
          {business.equipmentList && business.equipmentList.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                Available Machinery & Implement Fleet
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {business.equipmentList.map((eq) => (
                  <div key={eq.id} className="p-3.5 rounded-xl bg-[#101528] border border-[#1F2948] text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white text-sm">{eq.name}</div>
                      <div className="text-slate-400 text-[11px]">{eq.model} · {eq.operatorIncluded ? "Operator Included" : "Self-Drive"}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Min: {eq.minHours} hrs</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#00F5D4] font-mono">₹{eq.ratePerHour}/hr</div>
                      <div className="text-[10px] text-slate-400 font-mono">₹{eq.ratePerDay}/day</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. WAREHOUSE & COMMERCIAL FACILITY SPECS */}
          {business.warehouseSpecs && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                Warehouse Facility Specifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#101528] border border-[#1F2948]">
                  <div className="text-slate-400 text-[10px]">Total Space</div>
                  <div className="text-white font-bold">{business.warehouseSpecs.totalAreaSqFt.toLocaleString()} sq ft</div>
                </div>
                <div className="p-3 rounded-xl bg-[#101528] border border-[#1F2948]">
                  <div className="text-slate-400 text-[10px]">Clear Height</div>
                  <div className="text-[#00F5D4] font-bold">{business.warehouseSpecs.clearHeightMeters} Meters</div>
                </div>
                <div className="p-3 rounded-xl bg-[#101528] border border-[#1F2948]">
                  <div className="text-slate-400 text-[10px]">Hydraulic Docks</div>
                  <div className="text-white font-bold">{business.warehouseSpecs.dockDoors} Bay Doors</div>
                </div>
                <div className="p-3 rounded-xl bg-[#101528] border border-[#1F2948]">
                  <div className="text-slate-400 text-[10px]">Cold Storage</div>
                  <div className="text-cyan-400 font-bold">{business.warehouseSpecs.coldStorageAvailable ? "2°C - 8°C Ready" : "Ambient"}</div>
                </div>
              </div>
            </div>
          )}

          {/* 7. BULK VOLUME PRICING TIERS */}
          {business.bulkPriceTiers && business.bulkPriceTiers.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                Wholesale Volume Pricing Tiers
              </h4>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {business.bulkPriceTiers.map((tier, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#101528] border border-[#1F2948] text-xs">
                    <div className="text-slate-400 text-[10px] font-mono">{tier.minQty}</div>
                    <div className="text-emerald-400 font-bold font-mono text-sm mt-0.5">{tier.pricePerUnit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Directions and Real Google Maps Grounding Links */}
          <div className="p-3.5 rounded-2xl bg-[#090C19] border border-[#1E2744] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Navigation className="w-4 h-4 text-[#00F5D4]" />
              <span className="truncate">Address: {business.address}, {business.city}</span>
            </div>
            <a
              href={business.googleMapsUri || `https://maps.google.com/?q=${encodeURIComponent(business.name + " " + business.city)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#00F5D4] hover:underline flex items-center gap-1 font-medium shrink-0 font-mono"
            >
              <span>Directions via Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Primary Action Button Bar */}
          <div className="pt-4 border-t border-[#1C243E] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onActionClick(business);
              }}
              className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <span>
                {business.actionType === "reserve_table"
                  ? "Reserve a Table"
                  : business.actionType === "buy_product"
                  ? "Buy or Store Pickup"
                  : business.actionType === "rent_equipment"
                  ? "Rent Machinery & Implements"
                  : business.actionType === "request_quotation"
                  ? "Request Wholesale Quotation"
                  : business.actionType === "request_service"
                  ? "Request Emergency Plumber / Tech"
                  : business.actionType === "enroll_course"
                  ? "Enroll in Academy Class"
                  : business.actionType === "schedule_site_visit"
                  ? "Schedule Site Tour"
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
