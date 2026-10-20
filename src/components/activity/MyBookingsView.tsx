import React, { useState } from "react";
import { BookingRecord, SavedPlaceItem } from "@/src/types/cygnus";
import { auth, db, signInWithGoogle, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MapPin,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Bookmark,
  LogIn,
  ExternalLink,
  QrCode,
  ArrowRight,
  Filter,
} from "lucide-react";

interface MyBookingsViewProps {
  bookings: BookingRecord[];
  savedItems: SavedPlaceItem[];
  onRemoveBooking: (id: string) => void;
  onRemoveSaved: (id: string) => void;
  onExploreMore: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  savedItems,
  onRemoveBooking,
  onRemoveSaved,
  onExploreMore,
}) => {
  const [activeTab, setActiveTab] = useState<"bookings" | "saved">("bookings");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const currentUser = auth.currentUser;

  const handleCancelBooking = async (bookingId: string) => {
    try {
      if (currentUser) {
        await updateDoc(doc(db, "bookings", bookingId), {
          status: "cancelled",
        });
      }
      onRemoveBooking(bookingId);
      setCancelModalId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
    }
  };

  const filteredBookings = bookings.filter((b, idx, arr) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    // Keep only the first occurrence of each unique ID or reference
    return arr.findIndex((item) => (item.id && item.id === b.id) || (item.reference && item.reference === b.reference)) === idx;
  });

  const uniqueSavedItems = savedItems.filter((item, idx, arr) => {
    return arr.findIndex((s) => (s.id && s.id === item.id) || (s.itemId && s.itemId === item.itemId)) === idx;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2640] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#00F5D4] font-semibold mb-1 font-mono">
            Real-World Activity & Ledger
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Activity & Saved Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your verified table reservations, clinic appointments, hardware pickups, and saved bookmarks.
          </p>
        </div>

        {/* Auth status indicator / Google Login button */}
        <div>
          {currentUser ? (
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0E1328] border border-[#202946] shadow-lg">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-8 h-8 rounded-full border border-[#00F5D4]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#00F5D4]/20 text-[#00F5D4] flex items-center justify-center text-xs font-bold">
                  {currentUser.displayName?.[0] || "U"}
                </div>
              )}
              <div className="text-xs text-left">
                <div className="text-white font-medium">{currentUser.displayName || "Explorer"}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  Cloud Synced
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold bg-[#11172E] border border-[#00F5D4] text-[#00F5D4] hover:bg-[#00F5D4]/10 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "bookings"
                ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_15px_rgba(0,245,212,0.3)] font-bold"
                : "bg-[#0E1324] text-slate-400 hover:text-white border border-[#1E2640]"
            }`}
          >
            Active Bookings ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "saved"
                ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_15px_rgba(0,245,212,0.3)] font-bold"
                : "bg-[#0E1324] text-slate-400 hover:text-white border border-[#1E2640]"
            }`}
          >
            Saved Places ({savedItems.length})
          </button>
        </div>

        {activeTab === "bookings" && bookings.length > 0 && (
          <div className="flex items-center gap-1 bg-[#0E1328] border border-[#1E2744] p-1 rounded-xl text-xs">
            {(["all", "confirmed", "pending", "cancelled"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-[#00F5D4]/20 text-[#00F5D4] font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1. Bookings Ledger Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#090D1C] border border-[#1E253E] text-center space-y-4">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore real-world restaurants, tech stores, dental clinics, or salon appointments on CYGNUS to make your first booking.
              </p>
              <button
                type="button"
                onClick={onExploreMore}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] cursor-pointer shadow-md"
              >
                Discover Nearby Venues
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredBookings.map((b, idx) => {
                const isConfirmed = b.status === "confirmed";
                const isCancelled = b.status === "cancelled";

                return (
                  <div
                    key={`${b.id || b.reference || "booking"}-${idx}`}
                    className="p-5 rounded-2xl bg-[#0E1328] border border-[#202946] flex flex-col justify-between space-y-4 relative group shadow-lg hover:border-[#00F5D4]/40 transition-all"
                  >
                    <div>
                      {/* Status header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F5D4] bg-[#00F5D4]/10 border border-[#00F5D4]/20 px-2 py-0.5 rounded">
                          {b.category}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          {isConfirmed ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Confirmed
                            </span>
                          ) : isCancelled ? (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              Cancelled
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Pending Approval
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white leading-snug">
                        {b.businessName}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 font-medium">
                        {b.serviceOrTable}
                      </p>

                      <div className="mt-3 p-3 rounded-xl bg-[#080B1A] border border-[#192138] space-y-1.5 text-xs font-mono">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Date & Time:</span>
                          <span className="text-white font-bold">{b.date} · {b.time}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Reference:</span>
                          <span className="text-[#00F5D4] font-bold">{b.reference}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Value:</span>
                          <span className="text-white font-bold">{b.currency}{b.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#1C243E] flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {b.cancellationPolicy}
                      </span>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => setCancelModalId(b.id)}
                          className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Saved Directory Tab */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedItems.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#090D1C] border border-[#1E253E] text-center space-y-4">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Saved Places Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bookmark restaurants, products, or service providers by clicking the bookmark icon on any discovery card.
              </p>
              <button
                type="button"
                onClick={onExploreMore}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] cursor-pointer"
              >
                Explore Places
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueSavedItems.map((item, idx) => (
                <div
                  key={`${item.id || item.itemId || "save"}-${idx}`}
                  className="p-5 rounded-2xl bg-[#0E1328] border border-[#202946] flex flex-col justify-between space-y-3 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[10px] font-mono uppercase text-[#00F5D4] bg-[#00F5D4]/10 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveSaved(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-white mt-1 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#00F5D4] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1C243E] flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold font-mono">★ {item.rating}</span>
                    <button
                      type="button"
                      onClick={onExploreMore}
                      className="text-xs text-[#00F5D4] hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#0C1022] border border-rose-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Cancel Reservation?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to cancel this booking? The slot will be released back to the live provider availability pool.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#11162B] border border-[#202A48] text-slate-300 hover:text-white"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => handleCancelBooking(cancelModalId)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsView;
