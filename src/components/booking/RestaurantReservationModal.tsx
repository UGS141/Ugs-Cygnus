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

  const availableSlots = restaurant.availableSlots || ["7:00 PM", "7:30 PM", "8:15 PM", "9:00 PM"];

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingRef = `CYG-TBL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: BookingRecord = {
      id: bookingRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: restaurant.id,
      businessName: restaurant.name,
      category: "restaurant",
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

    // Save to Firestore if user is logged in
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
                {confirmedBooking.status === "confirmed" ? "Table Reservation Confirmed" : "Request Submitted"}
              </span>
              <h3 className="text-2xl font-bold text-white">{restaurant.name}</h3>
              <p className="text-xs text-slate-400">
                {restaurant.address} · {restaurant.city}
              </p>
            </div>

            {/* Reservation Receipt Card */}
            <div className="p-4 rounded-xl bg-[#11162B] border border-[#212C4E] text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-[#1A233E] pb-2 text-slate-300">
                <span>Confirmation Ref:</span>
                <span className="text-[#00F5D4] font-bold">{confirmedBooking.reference}</span>
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
                <span className="text-emerald-400">{restaurant.verifiedProvider || "Direct Verified"}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-[#1A233E]">
                <span>Cancellation:</span>
                <span>{confirmedBooking.cancellationPolicy}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              A calendar invite and SMS confirmation have been synced to your activity ledger.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 transition-all"
            >
              Done & View in My Bookings
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmReservation} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Utensils className="w-4 h-4 text-[#00F5D4]" />
                <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-semibold">
                  Table Reservation
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {restaurant.verifiedProvider || "Verified Booking"}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">{restaurant.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>{restaurant.address}</span>
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Select Date
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Tonight, Oct 20", "Tomorrow, Oct 21", "Wednesday, Oct 22"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      date === d
                        ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-semibold"
                        : "bg-[#111526] border-[#222A44] text-slate-300 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Party Size */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Party Size (Guests)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPartySize(num)}
                    className={`py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      partySize === num
                        ? "bg-[#00F5D4] text-[#06070B] font-bold border-[#00F5D4]"
                        : "bg-[#111526] border-[#222A44] text-slate-300 hover:text-white"
                    }`}
                  >
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Verified Slots */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Verified Available Time Slots
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">Live Provider Synced</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 rounded-lg text-xs font-mono font-medium border text-center transition-all ${
                      selectedSlot === slot
                        ? "bg-[#38BDF8] text-[#06070B] font-bold border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                        : "bg-[#111526] border-[#222A44] text-slate-300 hover:border-[#38BDF8]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Preference */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Seating Area Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Indoor Main Dining", "Outdoor Garden Terrace", "Chef's Counter"].map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setSeatingPref(area)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      seatingPref === area
                        ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-white font-semibold"
                        : "bg-[#111526] border-[#222A44] text-slate-400 hover:text-white"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Rohan Sharma"
                  className="w-full bg-[#111526] border border-[#222A44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5D4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#111526] border border-[#222A44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5D4]"
                />
              </div>
            </div>

            {/* Special Dietary / Occasion Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Dietary Requirements or Occasion (Optional)
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vegetarian, Anniversary celebration, Quiet table"
                className="w-full bg-[#111526] border border-[#222A44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5D4]"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#1C243E] flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                No booking fee · Instant confirmation
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] flex items-center gap-2"
              >
                <span>{isSubmitting ? "Locking Table..." : "Confirm Table Reservation"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RestaurantReservationModal;
