import React from "react";
import { BusinessEntity } from "@/src/types/cygnus";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  ArrowRight,
  ExternalLink,
  Scale,
} from "lucide-react";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BusinessEntity[];
  onRemoveItem: (id: string) => void;
  onBookItem: (item: BusinessEntity) => void;
  onClearAll: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onBookItem,
  onClearAll,
}) => {
  if (!isOpen || items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0B0F21] border border-[#212C4E] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1C2542] flex items-center justify-between bg-[#080C1B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1px]">
              <div className="w-full h-full bg-[#080C1B] rounded-[11px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#00F5D4]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Side-by-Side Value & Availability Comparison
                </h3>
                <span className="text-[10px] font-mono bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30 px-2 py-0.5 rounded-full">
                  {items.length} items
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI decision matrix comparing price, distance, verified slots, and service terms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg border border-[#1E2640] hover:border-rose-500/40"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#101428] border border-[#1F2744] transition-all"
              aria-label="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="p-5 sm:p-6 overflow-x-auto overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 min-w-[320px]">
            {items.map((biz) => {
              const isVerified = biz.availabilityTier === "verified_live";
              const nextSlot =
                biz.category === "restaurant"
                  ? biz.availableSlots?.[0]
                  : biz.appointmentSlots?.[0] || "Available Today";

              return (
                <div
                  key={biz.id}
                  className="p-5 rounded-2xl bg-[#0E1328] border border-[#1E2849] hover:border-[#00F5D4]/40 transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  {/* Remove pill */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(biz.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-slate-400 hover:text-rose-400 hover:bg-black/90 transition-all z-10"
                    title="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="h-36 rounded-xl overflow-hidden relative bg-[#070914]">
                      <img
                        src={biz.photos[0]}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#070914]/85 text-[#00F5D4] border border-[#00F5D4]/30 backdrop-blur-md">
                        {biz.subcategory || biz.category}
                      </div>
                    </div>

                    {/* Title & Location */}
                    <div>
                      <h4 className="text-base font-bold text-white leading-snug">
                        {biz.name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                        <span className="truncate">{biz.address}</span>
                      </p>
                    </div>

                    {/* Comparison Metrics Table */}
                    <div className="divide-y divide-[#1B2442] text-xs font-mono">
                      {/* Price / Estimated Cost */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-400 font-sans">Price Range:</span>
                        <span className="text-white font-bold">
                          {biz.priceSample ? `${biz.currency || "₹"}${biz.priceSample.toLocaleString()}` : biz.priceRange}
                        </span>
                      </div>

                      {/* Distance */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-400 font-sans">Distance:</span>
                        <span className="text-[#38BDF8] font-bold">
                          {biz.distanceKm} km away
                        </span>
                      </div>

                      {/* Ratings */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-400 font-sans">User Rating:</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                          {biz.rating} ({biz.reviewCount})
                        </span>
                      </div>

                      {/* Verification Status */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-400 font-sans">Availability:</span>
                        {isVerified ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Live Slots
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium text-[11px]">
                            On Request
                          </span>
                        )}
                      </div>

                      {/* Earliest Slot */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-400 font-sans">Earliest Slot:</span>
                        <span className="text-[#00F5D4] font-bold text-[11px]">
                          {nextSlot}
                        </span>
                      </div>

                      {/* Domain-Specific Metric 1: Product Hardware Specs */}
                      {biz.specs && biz.specs.length > 0 && (
                        <div className="py-2 space-y-1">
                          <span className="text-slate-400 font-sans block text-[11px]">Hardware Specifications:</span>
                          <div className="space-y-0.5 text-[10px] text-slate-200">
                            {biz.specs.slice(0, 3).map((spec, i) => (
                              <div key={i} className="flex justify-between gap-1">
                                <span className="text-slate-400">{spec.label}:</span>
                                <span className="font-semibold text-right truncate max-w-[170px]">{spec.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Domain-Specific Metric 2: Agriculture Crop Suitability & MOQ */}
                      {biz.cropSuitability && biz.cropSuitability.length > 0 && (
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-slate-400 font-sans">Crop Focus:</span>
                          <span className="text-emerald-400 text-[11px] truncate max-w-[160px]">
                            {biz.cropSuitability.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Domain-Specific Metric 3: Machinery & Equipment Fleet */}
                      {biz.equipmentList && biz.equipmentList.length > 0 && (
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-slate-400 font-sans">Equipment Rate:</span>
                          <span className="text-cyan-400 font-bold text-[11px]">
                            ₹{biz.equipmentList[0].ratePerHour}/hr (Operator Inc.)
                          </span>
                        </div>
                      )}

                      {/* Domain-Specific Metric 4: Wholesale B2B MOQ */}
                      {biz.wholesaleMOQ && (
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-slate-400 font-sans">Wholesale MOQ:</span>
                          <span className="text-amber-300 text-[11px] font-semibold truncate max-w-[160px]">
                            {biz.wholesaleMOQ}
                          </span>
                        </div>
                      )}

                      {/* Domain-Specific Metric 5: Warehouse Specs */}
                      {biz.warehouseSpecs && (
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-slate-400 font-sans">Clear Height / Area:</span>
                          <span className="text-white text-[11px]">
                            {biz.warehouseSpecs.clearHeightMeters}m · {biz.warehouseSpecs.totalAreaSqFt.toLocaleString()} sq ft
                          </span>
                        </div>
                      )}

                      {/* Operating Hours */}
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-400 font-sans">Hours:</span>
                        <span className="text-slate-300 text-[11px] truncate max-w-[150px]">
                          {biz.openingHours}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA with Domain Intelligence */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onBookItem(biz);
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(0,245,212,0.25)] flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {biz.actionType === "reserve_table"
                          ? "Reserve Table"
                          : biz.actionType === "buy_product"
                          ? "Buy / In-Store Pickup"
                          : biz.actionType === "rent_equipment"
                          ? "Rent Machinery"
                          : biz.actionType === "request_quotation"
                          ? "Request Quote"
                          : biz.actionType === "request_service"
                          ? "Request Service"
                          : biz.actionType === "enroll_course"
                          ? "Enroll in Class"
                          : biz.actionType === "schedule_site_visit"
                          ? "Schedule Tour"
                          : "Book Appointment"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-[#080C1B] border-t border-[#1C2542] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified availability confirmed via live provider protocols and real-world inventory gateways.</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            CYGNUS Universal Comparator v2.5
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
