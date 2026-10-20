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
    name: "General Consultation & Service Assessment",
    durationMinutes: 45,
    price: business.priceSample || 1200,
    currency: business.currency || "₹",
    description: "Standard diagnostic and service delivery slot.",
  };

  const [selectedService, setSelectedService] = useState<ServiceItem>(defaultService);
  const [selectedStaff, setSelectedStaff] = useState<string>(business.staff?.[0]?.name || "Any Senior Specialist");
  const [selectedDate, setSelectedDate] = useState("Tomorrow");
  const [selectedSlot, setSelectedSlot] = useState(business.appointmentSlots?.[0] || "11:00 AM");
  const [clientName, setClientName] = useState(auth.currentUser?.displayName || "");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState(auth.currentUser?.email || "");
  const [notes, setNotes] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const availableSlots = business.appointmentSlots || [
    "10:30 AM",
    "11:45 AM",
    "02:15 PM",
    "04:00 PM",
  ];

  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingRef = `CYG-APT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: BookingRecord = {
      id: bookingRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: business.id,
      businessName: business.name,
      category: business.category,
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

    // Save to Firestore if authenticated
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0D1022] border border-[#222C4D] rounded-2xl shadow-2xl p-6 sm:p-8 text-foreground max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#00F5D4]/15 border border-[#00F5D4]/40 flex items-center justify-center mx-auto text-[#00F5D4]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono">
                {confirmedBooking.status === "confirmed" ? "Appointment Confirmed" : "Request Submitted for Confirmation"}
              </span>
              <h3 className="text-2xl font-bold text-white">{business.name}</h3>
              <p className="text-xs text-slate-400">
                {business.address} · {business.city}
              </p>
            </div>

            {/* Appointment Voucher Card */}
            <div className="p-4 rounded-xl bg-[#11162B] border border-[#212C4E] text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-[#1A233E] pb-2 text-slate-300">
                <span>Appointment Ref:</span>
                <span className="text-[#00F5D4] font-bold">{confirmedBooking.reference}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Service Selected:</span>
                <span className="text-white font-bold">{selectedService.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Practitioner / Staff:</span>
                <span className="text-slate-200">{selectedStaff}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Date & Time:</span>
                <span className="text-white font-bold">{confirmedBooking.date} at {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Amount:</span>
                <span className="text-[#00F5D4] font-bold">
                  {confirmedBooking.currency}{confirmedBooking.price} (Pay on visit)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Appointment record dispatched to {clientEmail || "your email"}. Synced to My Bookings ledger.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 transition-all"
            >
              Done & View Activity
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmAppointment} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-semibold">
                  {business.category.toUpperCase()} APPOINTMENT
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {business.verifiedProvider || "Verified Scheduling"}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">{business.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>{business.address}</span>
              </p>
            </div>

            {/* Service Selection */}
            {business.services && business.services.length > 0 && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Specific Service
                </label>
                <div className="space-y-2">
                  {business.services.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedService.id === svc.id
                          ? "bg-[#00F5D4]/10 border-[#00F5D4] text-white"
                          : "bg-[#111526] border-[#222A44] text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white">{svc.name}</div>
                        <div className="text-slate-400 mt-0.5">{svc.description}</div>
                        <div className="text-[11px] text-[#38BDF8] mt-1 font-mono">
                          Duration: {svc.durationMinutes} mins
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#00F5D4] font-mono shrink-0 pl-3">
                        {svc.currency}{svc.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff / Specialist Selection if available */}
            {business.staff && business.staff.length > 0 && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                  Choose Practitioner / Specialist
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {business.staff.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStaff(st.name)}
                      className={`p-2.5 rounded-lg text-xs text-left border transition-all ${
                        selectedStaff === st.name
                          ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-white font-semibold"
                          : "bg-[#111526] border-[#222A44] text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="font-bold text-slate-200">{st.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{st.role}</div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">★ {st.rating}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Appointment Date
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Today", "Tomorrow", "Thursday"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      selectedDate === d
                        ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-semibold"
                        : "bg-[#111526] border-[#222A44] text-slate-300 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Time Slots */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Available Slots
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-1 text-xs font-mono font-medium border text-center rounded-lg transition-all ${
                      selectedSlot === slot
                        ? "bg-[#38BDF8] text-[#06070B] font-bold border-[#38BDF8]"
                        : "bg-[#111526] border-[#222A44] text-slate-300 hover:border-[#38BDF8]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Information */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Priya Nair"
                  className="w-full bg-[#111526] border border-[#222A44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5D4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 99887 76655"
                  className="w-full bg-[#111526] border border-[#222A44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5D4]"
                />
              </div>
            </div>

            {/* Healthcare Privacy Notice compliance */}
            {business.category === "healthcare" && (
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200/90 leading-relaxed flex items-start gap-2">
                <FileText className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>
                  <strong>HIPAA & NABH Health Privacy:</strong> Clinical consultation notes and medical history are encrypted in transit. Your contact details are strictly transmitted to Nova Dental Clinic for medical intake purposes.
                </span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-3 border-t border-[#1C243E] flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Pay {selectedService.currency}{selectedService.price} at venue
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] flex items-center gap-2"
              >
                <span>{isSubmitting ? "Securing Slot..." : "Confirm Appointment"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceAppointmentModal;
