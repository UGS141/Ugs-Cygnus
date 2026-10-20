import React, { useState } from "react";
import { BusinessEntity, BookingRecord, ServiceItem } from "@/src/types/cygnus";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  FileText,
  Copy,
  Check,
} from "lucide-react";

interface ServiceAppointmentModalProps {
  business: BusinessEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const ServiceAppointmentModal: React.FC<ServiceAppointmentModalProps> = ({
  business,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !business) return null;

  const defaultService = business.services?.[0] || {
    id: "default",
    name: "General Consultation & Assessment",
    durationMinutes: 45,
    price: business.priceSample || 1200,
    currency: business.currency || "₹",
    description: "Standard diagnostic and service delivery slot.",
  };

  const [selectedService, setSelectedService] = useState<ServiceItem>(defaultService);
  const [selectedStaff, setSelectedStaff] = useState<string>(business.staff?.[0]?.name || "Senior Specialist");
  const [selectedDate, setSelectedDate] = useState("Tomorrow, Oct 21");
  const [selectedSlot, setSelectedSlot] = useState(business.appointmentSlots?.[0] || "11:00 AM");
  const [clientName, setClientName] = useState(auth.currentUser?.displayName || "");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState(auth.currentUser?.email || "");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const availableSlots = business.appointmentSlots || [
    "10:30 AM",
    "11:45 AM",
    "02:15 PM",
    "04:00 PM",
  ];

  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || confirmedBooking) return;
    setIsSubmitting(true);

    const bookingRef = `CYG-APT-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRecord = {
      id: bookingRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: business.id,
      businessName: business.name,
      category: business.category,
      actionType: business.actionType || "book_appointment",
      serviceOrTable: `${selectedService.name} (${selectedService.durationMinutes} min) with ${selectedStaff}`,
      date: selectedDate,
      time: selectedSlot,
      status: business.availabilityTier === "verified_live" ? "confirmed" : "pending",
      price: selectedService.price,
      currency: selectedService.currency || "₹",
      reference: bookingRef,
      notes,
      createdAt: new Date().toISOString(),
      cancellationPolicy: "Free rescheduling up to 4 hours in advance.",
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "bookings", bookingRef), newBooking);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `bookings/${bookingRef}`);
      }
    }

    setIsSubmitting(false);
    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
  };

  const copyRef = () => {
    if (confirmedBooking) {
      navigator.clipboard?.writeText(confirmedBooking.reference);
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

        {confirmedBooking ? (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1.5px] mx-auto">
              <div className="w-full h-full bg-[#080B1A] rounded-[14px] flex items-center justify-center text-[#00F5D4]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono font-semibold">
                {confirmedBooking.status === "confirmed" ? "Appointment Confirmed" : "Request Submitted"}
              </span>
              <h3 className="text-2xl font-bold text-white">{business.name}</h3>
              <p className="text-xs text-slate-400">
                {business.address} · {business.city}
              </p>
            </div>

            {/* Appointment Voucher Card */}
            <div className="p-5 rounded-2xl bg-[#101528] border border-[#1F2948] text-left text-xs space-y-2.5 font-mono shadow-inner">
              <div className="flex justify-between items-center border-b border-[#1A233E] pb-2 text-slate-300">
                <span>Appointment Ref:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00F5D4] font-bold">{confirmedBooking.reference}</span>
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
                <span>Service Selected:</span>
                <span className="text-white font-bold">{selectedService.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Practitioner:</span>
                <span className="text-slate-200">{selectedStaff}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Date & Time:</span>
                <span className="text-white font-bold">{confirmedBooking.date} at {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fee / Deposit:</span>
                <span className="text-[#00F5D4] font-bold">{selectedService.currency}{selectedService.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-[#1A233E]">
                <span>Cancellation:</span>
                <span>{confirmedBooking.cancellationPolicy}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              A reminder notification has been added to your CYGNUS Activity Ledger and calendar.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)]"
            >
              Done & View Activity
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono">
                  {business.subcategory || "Verified Service Appointment"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{business.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                <span>{business.address}</span>
              </p>
            </div>

            <form onSubmit={handleConfirmAppointment} className="space-y-5">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  1. Select Service or Procedure
                </label>
                <div className="space-y-2">
                  {(business.services || [defaultService]).map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        selectedService.id === svc.id
                          ? "bg-[#00F5D4]/15 border-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                          : "bg-[#101528] border-[#1F2948] hover:border-slate-500"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white">{svc.name}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{svc.description}</div>
                        <div className="text-[#38BDF8] text-[10px] font-mono mt-0.5">
                          {svc.durationMinutes} min session
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#00F5D4] font-mono pl-3 shrink-0">
                        {svc.currency}{svc.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Specialist (if available) */}
              {business.staff && business.staff.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    2. Practitioner / Specialist
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {business.staff.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStaff(st.name)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          selectedStaff === st.name
                            ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-bold"
                            : "bg-[#101528] border-[#1F2948] text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="font-bold text-white text-xs">{st.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{st.role}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    3. Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Today (Urgent Slot)">Today (Urgent Slot)</option>
                    <option value="Tomorrow, Oct 21">Tomorrow, Oct 21</option>
                    <option value="Wednesday, Oct 22">Wednesday, Oct 22</option>
                    <option value="Thursday, Oct 23">Thursday, Oct 23</option>
                    <option value="Saturday, Oct 25">Saturday, Oct 25</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    4. Available Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Details */}
              <div className="space-y-3 pt-2 border-t border-[#192238]">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Priya Nair"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+91 98111 22334"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Service Notes or Specific Symptoms</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. First time consultation, allergic to latex, preference for gentle scaling"
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
                <span>{isSubmitting ? "Locking Appointment..." : `Confirm ${selectedService.name} (${selectedSlot})`}</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceAppointmentModal;
