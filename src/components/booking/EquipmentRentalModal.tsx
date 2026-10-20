import React, { useState } from "react";
import { BusinessEntity, BookingRecord, EquipmentRentalItem } from "@/src/types/cygnus";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  X,
  Tractor,
  Clock,
  Calendar,
  CheckCircle2,
  MapPin,
  User,
  ShieldCheck,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

interface EquipmentRentalModalProps {
  business: BusinessEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const EquipmentRentalModal: React.FC<EquipmentRentalModalProps> = ({
  business,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !business) return null;

  const defaultEquipment: EquipmentRentalItem = business.equipmentList?.[0] || {
    id: "eq-default",
    name: "Mahindra 575 DI 45HP Tractor + Rotavator",
    model: "2024 Turbo",
    ratePerHour: 950,
    ratePerDay: 7500,
    operatorIncluded: true,
    minHours: 3,
    availableNow: true,
  };

  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentRentalItem>(defaultEquipment);
  const [durationMode, setDurationMode] = useState<"hours" | "days">("hours");
  const [durationValue, setDurationValue] = useState(4);
  const [startDate, setStartDate] = useState("Tomorrow, 06:30 AM");
  const [farmLocation, setFarmLocation] = useState(
    business.city === "Nellore" ? "Survey #88, Allur Road, Nellore" : "Construction Site Sector 62"
  );
  const [withOperator, setWithOperator] = useState(true);
  const [renterName, setRenterName] = useState(auth.currentUser?.displayName || "");
  const [renterPhone, setRenterPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRental, setConfirmedRental] = useState<BookingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const calculateTotal = () => {
    if (durationMode === "hours") {
      return selectedEquipment.ratePerHour * durationValue;
    }
    return selectedEquipment.ratePerDay * durationValue;
  };

  const handleConfirmRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || confirmedRental) return;
    setIsSubmitting(true);

    const rentalRef = `CYG-RNT-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const totalPrice = calculateTotal();

    const newBooking: BookingRecord = {
      id: rentalRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: business.id,
      businessName: business.name,
      category: business.category,
      actionType: "rent_equipment",
      serviceOrTable: `${selectedEquipment.name} (${durationValue} ${durationMode}) ${withOperator ? "+ Operator" : ""}`,
      date: startDate,
      time: `${durationValue} ${durationMode}`,
      status: "confirmed",
      price: totalPrice,
      currency: business.currency || "₹",
      reference: rentalRef,
      notes: `Site/Farm: ${farmLocation} · Operator: ${withOperator ? "Yes (Included)" : "No (Self-drive)"}`,
      createdAt: new Date().toISOString(),
      cancellationPolicy: "Free cancellation up to 6 hours before dispatch slot.",
      fulfillmentDetails: {
        type: "On-Site Machinery Dispatch",
        address: farmLocation,
        operatorNeeded: withOperator,
      },
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "bookings", rentalRef), newBooking);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `bookings/${rentalRef}`);
      }
    }

    setIsSubmitting(false);
    setConfirmedRental(newBooking);
    onBookingSuccess(newBooking);
  };

  const copyRef = () => {
    if (confirmedRental) {
      navigator.clipboard?.writeText(confirmedRental.reference);
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

        {confirmedRental ? (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1.5px] mx-auto">
              <div className="w-full h-full bg-[#080B1A] rounded-[14px] flex items-center justify-center text-[#00F5D4]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono font-semibold">
                Equipment Dispatch Scheduled & Locked
              </span>
              <h3 className="text-2xl font-bold text-white">{selectedEquipment.name}</h3>
              <p className="text-xs text-slate-400">
                {business.name} · {business.city}
              </p>
            </div>

            {/* Rental Voucher Pass */}
            <div className="p-5 rounded-2xl bg-[#101528] border border-[#1F2948] text-left text-xs space-y-2.5 font-mono shadow-inner">
              <div className="flex justify-between items-center border-b border-[#1A233E] pb-2.5 text-slate-300">
                <span>Rental Booking Ref:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00F5D4] font-bold">{confirmedRental.reference}</span>
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
                <span>Equipment & Model:</span>
                <span className="text-white font-bold">{selectedEquipment.name} ({selectedEquipment.model})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Duration / Schedule:</span>
                <span className="text-white font-bold">{durationValue} {durationMode} starting {startDate}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Farm / Site Location:</span>
                <span className="text-slate-200 truncate max-w-[200px]">{farmLocation}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Operator Included:</span>
                <span className="text-emerald-400">{withOperator ? "Yes (Certified Operator)" : "No"}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Estimated Cost:</span>
                <span className="text-[#00F5D4] font-bold text-sm">
                  {business.currency || "₹"}{calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              The equipment fleet coordinator will call to confirm GPS drop coordinates before dispatch.
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
                  Farm & Construction Machinery Rental
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{business.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                <span>{business.address}, {business.city}</span>
              </p>
            </div>

            <form onSubmit={handleConfirmRental} className="space-y-5">
              {/* Equipment Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  1. Select Machinery / Implement
                </label>
                <div className="space-y-2">
                  {(business.equipmentList || [defaultEquipment]).map((eq) => (
                    <div
                      key={eq.id}
                      onClick={() => setSelectedEquipment(eq)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        selectedEquipment.id === eq.id
                          ? "bg-[#00F5D4]/15 border-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                          : "bg-[#101528] border-[#1F2948] hover:border-slate-500"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{eq.name}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{eq.model} · Min {eq.minHours} hrs</div>
                        <div className="text-emerald-400 text-[10px] font-mono mt-0.5">
                          {eq.availableNow ? "✓ Available Now for Dispatch" : "In Field (Available Tomorrow)"}
                        </div>
                      </div>
                      <div className="text-right pl-3 shrink-0">
                        <div className="text-[#00F5D4] font-bold font-mono">
                          {business.currency || "₹"}{eq.ratePerHour}/hr
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          or {business.currency || "₹"}{eq.ratePerDay}/day
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration Switcher */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                    2. Duration Rate Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDurationMode("hours")}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        durationMode === "hours"
                          ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-bold"
                          : "bg-[#101528] border-[#1F2948] text-slate-400 hover:text-white"
                      }`}
                    >
                      Hourly ({selectedEquipment.ratePerHour}/hr)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationMode("days")}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        durationMode === "days"
                          ? "bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-bold"
                          : "bg-[#101528] border-[#1F2948] text-slate-400 hover:text-white"
                      }`}
                    >
                      Full Day ({selectedEquipment.ratePerDay}/day)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                    Number of {durationMode === "hours" ? "Hours" : "Days"}
                  </label>
                  <div className="flex items-center gap-2">
                    {(durationMode === "hours" ? [3, 4, 6, 8] : [1, 2, 3, 5]).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setDurationValue(v)}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                          durationValue === v
                            ? "bg-[#00F5D4] text-[#06070B] border-[#00F5D4]"
                            : "bg-[#101528] border-[#1F2948] text-slate-300 hover:text-white"
                        }`}
                      >
                        {v} {durationMode === "hours" ? "h" : "d"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Time & Location */}
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Dispatch Time Slot</label>
                    <select
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="Today, 02:00 PM Slot">Today, 02:00 PM Slot</option>
                      <option value="Tomorrow, 06:30 AM (Morning Shift)">Tomorrow, 06:30 AM (Morning Shift)</option>
                      <option value="Tomorrow, 01:30 PM (Afternoon Shift)">Tomorrow, 01:30 PM (Afternoon Shift)</option>
                      <option value="Day After Tomorrow, 06:30 AM">Day After Tomorrow, 06:30 AM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Operator Preference</label>
                    <div className="flex items-center gap-2 h-9">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={withOperator}
                          onChange={(e) => setWithOperator(e.target.checked)}
                          className="rounded border-[#1F2948] text-[#00F5D4] focus:ring-[#00F5D4]"
                        />
                        <span>Include Skilled Operator</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Farm / Construction Drop Location</label>
                  <input
                    type="text"
                    required
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    placeholder="Enter village name, survey number, or landmark for flatbed trailer drop"
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-[#192238]">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Farmer / Site Manager Name</label>
                  <input
                    type="text"
                    required
                    value={renterName}
                    onChange={(e) => setRenterName(e.target.value)}
                    placeholder="e.g. S. Venkat Reddy"
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Phone Number (Call on Dispatch)</label>
                  <input
                    type="tel"
                    required
                    value={renterPhone}
                    onChange={(e) => setRenterPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Total Calculation & CTA */}
              <div className="p-3.5 rounded-2xl bg-[#101528] border border-[#1F2948] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">Total Estimated Rental:</div>
                  <div className="text-base font-bold text-[#00F5D4] font-mono">
                    {business.currency || "₹"}{calculateTotal().toLocaleString()}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isSubmitting ? "Locking Machinery..." : "Reserve Machinery Slot"}</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentRentalModal;
