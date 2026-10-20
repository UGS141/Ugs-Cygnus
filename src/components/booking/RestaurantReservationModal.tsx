import React, { useState } from "react";
import { BusinessEntity, BookingRecord } from "@/src/types/cygnus";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  X,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Utensils,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Share2,
} from "lucide-react";

interface RestaurantReservationModalProps {
  restaurant: BusinessEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const RestaurantReservationModal: React.FC<RestaurantReservationModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !restaurant) return null;

  const [date, setDate] = useState("Tonight, Oct 20");
  const [partySize, setPartySize] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(restaurant.availableSlots?.[0] || "7:30 PM");
  const [seatingPref, setSeatingPref] = useState("Indoor Main Dining");
  const [guestName, setGuestName] = useState(auth.currentUser?.displayName || "");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState(auth.currentUser?.email || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const availableSlots = restaurant.availableSlots || ["7:00 PM", "7:30 PM", "8:15 PM", "9:00 PM", "9:45 PM"];

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || confirmedBooking) return;
    setIsSubmitting(true);

    const bookingRef = `CYG-TBL-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRecord = {
      id: bookingRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: restaurant.id,
      businessName: restaurant.name,
      category: "restaurant",
      actionType: "reserve_table",
      serviceOrTable: `Table for ${partySize} (${seatingPref})`,
      date,
      time: selectedSlot,
      partySize,
      status: restaurant.availabilityTier === "verified_live" ? "confirmed" : "pending",
      price: restaurant.priceSample || 1500,
      currency: restaurant.currency || "₹",
      reference: bookingRef,
      notes: specialRequests,
      createdAt: new Date().toISOString(),
      cancellationPolicy: "Free cancellation up to 2 hours before reservation time.",
    };

    // Save to Firestore if user is authenticated
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

  const copyReference = () => {
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
                {confirmedBooking.status === "confirmed" ? "Reservation Confirmed" : "Request Submitted"}
              </span>
              <h3 className="text-2xl font-bold text-white">{restaurant.name}</h3>
              <p className="text-xs text-slate-400">
                {restaurant.address} · {restaurant.city}
              </p>
            </div>

            {/* Reservation Receipt Pass */}
            <div className="p-5 rounded-2xl bg-[#101528] border border-[#1F2948] text-left text-xs space-y-2.5 font-mono shadow-inner">
              <div className="flex justify-between items-center border-b border-[#1A233E] pb-2.5 text-slate-300">
                <span>Confirmation Ref:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00F5D4] font-bold">{confirmedBooking.reference}</span>
                  <button
                    type="button"
                    onClick={copyReference}
                    className="p-1 hover:text-white text-slate-400 transition-colors"
                    title="Copy Code"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Date & Time:</span>
                <span className="text-white font-bold">{confirmedBooking.date} at {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Party Size:</span>
                <span className="text-white font-bold">{confirmedBooking.partySize} Guests ({seatingPref})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Verification Source:</span>
                <span className="text-emerald-400">{restaurant.verifiedProvider || "Google Maps Grounded API"}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-[#1A233E]">
                <span>Cancellation:</span>
                <span>{confirmedBooking.cancellationPolicy}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              A confirmation pass has been synced to your activity ledger and your calendar.
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
                  Table Reservation
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{restaurant.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                <span>{restaurant.address}</span>
              </p>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-5">
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  1. Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Tonight, Oct 20", "Tomorrow, Oct 21", "Wednesday, Oct 22"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDate(d)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                        date === d
                          ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-bold"
                          : "bg-[#101528] border-[#1F2948] text-slate-400 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Party Size */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  2. Party Size
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 4, 6, 8].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPartySize(size)}
                      className={`w-12 h-10 rounded-xl text-xs font-mono font-bold border transition-all ${
                        partySize === size
                          ? "bg-[#00F5D4] text-[#06070B] border-[#00F5D4] shadow-[0_0_10px_rgba(0,245,212,0.3)]"
                          : "bg-[#101528] border-[#1F2948] text-slate-400 hover:text-white"
                      }`}
                    >
                      {size}p
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  3. Available Verified Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-mono font-semibold border text-center transition-all ${
                        selectedSlot === slot
                          ? "bg-[#00F5D4] text-[#06070B] border-[#00F5D4] shadow-[0_0_12px_rgba(0,245,212,0.3)] font-bold"
                          : "bg-[#101528] border-[#1F2948] text-slate-300 hover:text-white hover:border-slate-500"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  4. Seating Area
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Indoor Main Dining", "Patio / Balcony", "Chef's Counter"].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setSeatingPref(pref)}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        seatingPref === pref
                          ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-semibold"
                          : "bg-[#101528] border-[#1F2948] text-slate-400 hover:text-white"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 pt-2 border-t border-[#192238]">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Guest Full Name</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Phone Number (SMS Confirmation)</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Special Requests (Optional)</label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g., Birthday celebration, quiet booth, vegetarian recommendations"
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
                <span>{isSubmitting ? "Securing Table..." : `Lock In Table for ${partySize} (${selectedSlot})`}</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantReservationModal;
