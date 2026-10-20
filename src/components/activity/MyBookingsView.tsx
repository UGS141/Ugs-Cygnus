import React, { useState } from "react";
import { BookingRecord, SavedPlaceItem } from "@/src/types/cygnus";
import { auth, db, signInWithGoogle, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2640] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#00F5D4] font-semibold mb-1">
            Real-World Activity & Ledger
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            My Bookings & Saved Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your verified table reservations, clinic appointments, service slots, and bookmarks.
          </p>
        </div>

        {/* Auth status indicator / Google Login button */}
        <div>
          {currentUser ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-[#101528] border border-[#202946]">
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
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Cloud Synced
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#11172E] border border-[#00F5D4] text-[#00F5D4] hover:bg-[#00F5D4]/10 transition-all flex items-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
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
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === "saved"
              ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_15px_rgba(0,245,212,0.3)] font-bold"
              : "bg-[#0E1324] text-slate-400 hover:text-white border border-[#1E2640]"
          }`}
        >
          Saved Directory ({savedItems.length})
        </button>
      </div>

      {/* 1. Bookings Ledger Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#0B0E1B] border border-[#1E253E] text-center space-y-4">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Active Bookings Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore real-world restaurants, tech stores, dental clinics, or salon appointments on CYGNUS live map to make your first booking.
              </p>
              <button
                type="button"
                onClick={onExploreMore}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B]"
              >
                Discover Nearby Venues
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {bookings.map((b) => {
                const isConfirmed = b.status === "confirmed";
                const isCancelled = b.status === "cancelled";

                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-xl bg-[#0D1122] border border-[#202946] flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#00F5D4] uppercase tracking-wider bg-[#00F5D4]/10 px-2 py-0.5 rounded">
                          {b.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1 ${
                            isConfirmed
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-700/50"
                              : isCancelled
                              ? "bg-rose-950/80 text-rose-400 border border-rose-700/50"
                              : "bg-amber-950/80 text-amber-400 border border-amber-700/50"
                          }`}
                        >
                          {isConfirmed ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </>
                          ) : isCancelled ? (
                            <>
                              <XCircle className="w-3 h-3" /> Cancelled
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> Pending Provider Review
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{b.businessName}</h3>
                      <p className="text-xs text-slate-300 font-medium">{b.serviceOrTable}</p>

                      <div className="p-3 rounded-lg bg-[#11162B] border border-[#1E2744] text-xs font-mono text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Date & Time:</span>
                          <span className="text-white font-bold">{b.date} · {b.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ref Code:</span>
                          <span className="text-[#00F5D4]">{b.reference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="text-slate-200">{b.currency}{b.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1C243E] flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {b.cancellationPolicy || "Flexible cancellation"}
                      </span>
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => setCancelModalId(b.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
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

      {/* 2. Saved Items Tab */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedItems.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#0B0E1B] border border-[#1E253E] text-center space-y-4">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Saved Places Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bookmark places, restaurants, products, and clinics during your search to compare and book later.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#0D1122] border border-[#202946] flex items-center justify-between"
                >
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#00F5D4]">
                      {item.category}
                    </div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.location} · {item.priceRange}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveSaved(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D1122] border border-[#232E4E] shadow-2xl text-foreground space-y-4">
            <h3 className="text-lg font-bold text-white">Cancel This Booking?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel reference <span className="font-mono text-[#00F5D4]">{cancelModalId}</span>? Your reserved slot will be released back to the provider.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => handleCancelBooking(cancelModalId)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition-all"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsView;
