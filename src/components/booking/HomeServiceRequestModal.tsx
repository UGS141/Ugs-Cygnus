import React, { useState } from "react";
import { BusinessEntity, BookingRecord, ServiceItem } from "@/src/types/cygnus";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  X,
  Wrench,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Zap,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface HomeServiceRequestModalProps {
  business: BusinessEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const HomeServiceRequestModal: React.FC<HomeServiceRequestModalProps> = ({
  business,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !business) return null;

  const defaultService = business.services?.[0] || {
    id: "svc-default",
    name: "Emergency Diagnostic & Inspection Visit",
    durationMinutes: 45,
    price: business.priceSample || 450,
    currency: business.currency || "₹",
    description: "Standard technician dispatch and on-site troubleshooting.",
  };

  const [selectedService, setSelectedService] = useState<ServiceItem>(defaultService);
  const [urgency, setUrgency] = useState<"immediate" | "scheduled">("immediate");
  const [scheduledSlot, setScheduledSlot] = useState(business.appointmentSlots?.[0] || "Today 4:00 PM");
  const [serviceAddress, setServiceAddress] = useState("Flat 402, Block C, Defence Colony");
  const [issueDescription, setIssueDescription] = useState("");
  const [customerName, setCustomerName] = useState(auth.currentUser?.displayName || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedService, setConfirmedService] = useState<BookingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const etaMinutes = business.emergencyTurnaroundMinutes || 35;

  const handleConfirmService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || confirmedService) return;
    setIsSubmitting(true);

    const serviceRef = `CYG-SRV-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingRecord = {
      id: serviceRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: business.id,
      businessName: business.name,
      category: business.category,
      actionType: "request_service",
      serviceOrTable: `${selectedService.name} (${urgency === "immediate" ? "Emergency Dispatch" : "Scheduled"})`,
      date: urgency === "immediate" ? "Immediate Dispatch" : scheduledSlot,
      time: urgency === "immediate" ? `ETA: ~${etaMinutes} mins` : scheduledSlot,
      status: "confirmed",
      price: selectedService.price,
      currency: selectedService.currency || "₹",
      reference: serviceRef,
      notes: `Address: ${serviceAddress} · Issue: ${issueDescription || "Standard issue"}`,
      createdAt: new Date().toISOString(),
      cancellationPolicy: "Free cancellation within 10 minutes of technician dispatch.",
      fulfillmentDetails: {
        type: "On-Site Doorstep Service",
        address: serviceAddress,
        urgency: urgency === "immediate" ? `Immediate (~${etaMinutes} min)` : scheduledSlot,
      },
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "bookings", serviceRef), newBooking);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `bookings/${serviceRef}`);
      }
    }

    setIsSubmitting(false);
    setConfirmedService(newBooking);
    onBookingSuccess(newBooking);
  };

  const copyRef = () => {
    if (confirmedService) {
      navigator.clipboard?.writeText(confirmedService.reference);
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

        {confirmedService ? (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1.5px] mx-auto">
              <div className="w-full h-full bg-[#080B1A] rounded-[14px] flex items-center justify-center text-[#00F5D4]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono font-semibold">
                {urgency === "immediate" ? "Technician Dispatched & En Route" : "Service Visit Scheduled"}
              </span>
              <h3 className="text-2xl font-bold text-white">{selectedService.name}</h3>
              <p className="text-xs text-slate-400">
                {business.name} · {business.city}
              </p>
            </div>

            {/* Service Voucher Pass */}
            <div className="p-5 rounded-2xl bg-[#101528] border border-[#1F2948] text-left text-xs space-y-2.5 font-mono shadow-inner">
              <div className="flex justify-between items-center border-b border-[#1A233E] pb-2.5 text-slate-300">
                <span>Dispatch Ticket:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00F5D4] font-bold">{confirmedService.reference}</span>
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
                <span>Service Type:</span>
                <span className="text-white font-bold">{selectedService.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Arrival ETA / Time:</span>
                <span className="text-emerald-400 font-bold">
                  {urgency === "immediate" ? `On-Duty Tech arriving in ~${etaMinutes} mins` : scheduledSlot}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Doorstep Address:</span>
                <span className="text-slate-200 truncate max-w-[200px]">{serviceAddress}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Visiting Charge:</span>
                <span className="text-[#00F5D4] font-bold">
                  {selectedService.currency}{selectedService.price} (Adjusted against total work)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Technician contact & live tracking updates have been sent to your phone and saved in My Activity.
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
                  {business.subcategory}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{business.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                <span>Coverage: within {business.serviceAreaRadiusKm || 15}km of {business.address}</span>
              </p>
            </div>

            {/* On-Duty Live Status Callout */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold font-mono">Technicians On Duty Today:</span>
                <span className="text-emerald-400">Available for immediate callout</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded">
                ~{etaMinutes} min ETA
              </span>
            </div>

            <form onSubmit={handleConfirmService} className="space-y-4">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  1. Select Service or Repair Type
                </label>
                <div className="space-y-2">
                  {(business.services || [defaultService]).map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        selectedService.id === svc.id
                          ? "bg-[#00F5D4]/15 border-[#00F5D4] shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                          : "bg-[#101528] border-[#1F2948] hover:border-slate-500"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white">{svc.name}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{svc.description}</div>
                      </div>
                      <div className="text-sm font-bold text-[#00F5D4] font-mono pl-3 shrink-0">
                        {svc.currency}{svc.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency Mode (Emergency vs Scheduled) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  2. Dispatch Urgency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setUrgency("immediate")}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      urgency === "immediate"
                        ? "bg-[#00F5D4]/15 border-[#00F5D4] shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                        : "bg-[#101528] border-[#1F2948] hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#00F5D4]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Immediate Emergency</span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      Technician reaches in ~{etaMinutes} mins
                    </div>
                  </div>

                  <div
                    onClick={() => setUrgency("scheduled")}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      urgency === "scheduled"
                        ? "bg-[#00F5D4]/15 border-[#00F5D4] shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                        : "bg-[#101528] border-[#1F2948] hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#38BDF8]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Schedule a Slot</span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      Choose convenient time
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduled slot selector if scheduled */}
              {urgency === "scheduled" && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Select Time Slot</label>
                  <select
                    value={scheduledSlot}
                    onChange={(e) => setScheduledSlot(e.target.value)}
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  >
                    {(business.appointmentSlots || ["Today 4:00 PM", "Today 6:30 PM", "Tomorrow 10:00 AM"]).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Service Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  3. Doorstep Service Address
                </label>
                <input
                  type="text"
                  required
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  placeholder="Apartment/House number, Street, Landmark"
                  className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-2 border-t border-[#192238]">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rohit Mehra"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Phone Number (Technician Call)</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98100 22334"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Describe Issue (e.g. Kitchen tap burst, MCB tripping)</label>
                  <input
                    type="text"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Brief description of the issue to carry correct tools & parts"
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
                <span>
                  {isSubmitting
                    ? "Dispatching..."
                    : urgency === "immediate"
                    ? `Dispatch Technician Now (~${etaMinutes} min)`
                    : `Confirm Service Slot (${scheduledSlot})`}
                </span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeServiceRequestModal;
