import React, { useState } from "react";
import { BusinessEntity, BookingRecord } from "@/src/types/cygnus";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  MapPin,
  Truck,
  Building,
  Copy,
  Check,
  ChevronRight,
  AlertTriangle,
  Scale,
} from "lucide-react";

interface QuotationRequestModalProps {
  business: BusinessEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const QuotationRequestModal: React.FC<QuotationRequestModalProps> = ({
  business,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !business) return null;

  const [quantity, setQuantity] = useState("50 Bags (50kg)");
  const [deliveryLocation, setDeliveryLocation] = useState(
    business.city === "Nellore" ? "Field #14, Kovur Mandal, Nellore Rural" : "Site Plot 28, Industrial Area"
  );
  const [targetDate, setTargetDate] = useState("Within 48 Hours");
  const [customSpecs, setCustomSpecs] = useState("");
  const [contactName, setContactName] = useState(auth.currentUser?.displayName || "");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState(auth.currentUser?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedQuote, setConfirmedQuote] = useState<BookingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const isAgri = business.category === "agriculture";
  const isConstruction = business.category === "construction";

  const handleConfirmQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || confirmedQuote) return;
    setIsSubmitting(true);

    const quoteRef = `CYG-RFQ-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const estimatedAmount = business.priceSample || 15000;

    const newBooking: BookingRecord = {
      id: quoteRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: business.id,
      businessName: business.name,
      category: business.category,
      actionType: "request_quotation",
      serviceOrTable: `B2B Quotation Request: ${quantity} for ${business.subcategory}`,
      date: targetDate,
      time: "Turnaround: Under 2 Hours",
      status: "confirmed",
      price: estimatedAmount,
      currency: business.currency || "₹",
      reference: quoteRef,
      notes: `Delivery: ${deliveryLocation} · Specs: ${customSpecs || "Standard commercial grade"}`,
      createdAt: new Date().toISOString(),
      cancellationPolicy: "Binding wholesale price lock valid for 72 hours from issuance.",
      fulfillmentDetails: {
        type: "Wholesale Delivery / Freight",
        address: deliveryLocation,
        urgency: targetDate,
      },
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "bookings", quoteRef), newBooking);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `bookings/${quoteRef}`);
      }
    }

    setIsSubmitting(false);
    setConfirmedQuote(newBooking);
    onBookingSuccess(newBooking);
  };

  const copyRef = () => {
    if (confirmedQuote) {
      navigator.clipboard?.writeText(confirmedQuote.reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0B0F21] border border-[#212C4D] rounded-3xl shadow-2xl p-6 sm:p-8 text-foreground max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedQuote ? (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1.5px] mx-auto">
              <div className="w-full h-full bg-[#080B1A] rounded-[14px] flex items-center justify-center text-[#00F5D4]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono font-semibold">
                Quotation Request Dispatched & Locked
              </span>
              <h3 className="text-2xl font-bold text-white">{business.name}</h3>
              <p className="text-xs text-slate-400">
                {business.address} · {business.city}
              </p>
            </div>

            {/* Quotation Voucher Pass */}
            <div className="p-5 rounded-2xl bg-[#101528] border border-[#1F2948] text-left text-xs space-y-2.5 font-mono shadow-inner">
              <div className="flex justify-between items-center border-b border-[#1A233E] pb-2.5 text-slate-300">
                <span>Quotation Ref:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00F5D4] font-bold">{confirmedQuote.reference}</span>
                  <button
                    type="button"
                    onClick={copyRef}
                    className="p-1 hover:text-white text-slate-400 transition-colors"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Requested Quantity:</span>
                <span className="text-white font-bold">{quantity}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery Destination:</span>
                <span className="text-slate-200 truncate max-w-[200px]">{deliveryLocation}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Dispatch Schedule:</span>
                <span className="text-white font-bold">{targetDate}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Distributor SLA:</span>
                <span className="text-emerald-400">Direct Dealer Confirmation Under 2 Hours</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-[#1A233E]">
                <span>Price Lock Terms:</span>
                <span>{confirmedQuote.cancellationPolicy}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              A supplier dispatch notification has been generated and logged into your CYGNUS Activity Ledger.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)]"
            >
              Done & View Activity Ledger
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono">
                  {isAgri ? "Agricultural Supply RFQ" : isConstruction ? "Building Materials Quotation" : "B2B Commercial Quotation"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{business.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                <span>{business.address}, {business.city}</span>
              </p>
            </div>

            {/* Safety & Regulated Product Notice */}
            {business.productSafetyLabel && (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/40 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-amber-300 font-mono text-[11px]">Product Label & Regulatory Notice:</div>
                  <div className="text-[11px] leading-relaxed text-amber-200/90">{business.productSafetyLabel}</div>
                </div>
              </div>
            )}

            {/* Wholesale Price Tiers if available */}
            {business.bulkPriceTiers && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Verified Volume Pricing Tiers
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {business.bulkPriceTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#101528] border border-[#1F2948] text-xs font-mono"
                    >
                      <div className="text-slate-400 text-[10px]">{tier.minQty}</div>
                      <div className="text-[#00F5D4] font-bold mt-0.5">{tier.pricePerUnit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleConfirmQuote} className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  1. Required Quantity / Volume
                </label>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50 Bags (50kg), 10 Metric Tons, or 500 Liters"
                  className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Delivery Site / Farm Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  2. Delivery Site or Farm Destination
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-[#00F5D4] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="Enter village, survey number, or commercial site address"
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Urgency */}
              <div className="grid grid-cols-3 gap-2">
                {["Within 24 Hours", "Within 48 Hours", "Next Week"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setTargetDate(u)}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      targetDate === u
                        ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-bold"
                        : "bg-[#101528] border-[#1F2948] text-slate-400 hover:text-white"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-2 border-t border-[#192238]">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. V. Ramanjaneyulu"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Phone Number (WhatsApp Quotation)</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 94400 12345"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Specific Grade, Variety or Brand Requirements</label>
                  <input
                    type="text"
                    value={customSpecs}
                    onChange={(e) => setCustomSpecs(e.target.value)}
                    placeholder="e.g. Sona Masoori BPT 5204 aged 1 yr, moisture < 12%, branded bags"
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? "Requesting Dealer Quote..." : "Submit Formal Quotation Request"}</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationRequestModal;
