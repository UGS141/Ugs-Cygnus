import React, { useState } from "react";
import { BusinessEntity, BookingRecord } from "@/src/types/cygnus";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  X,
  ShoppingBag,
  Store,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Package,
} from "lucide-react";

interface ProductPurchaseModalProps {
  product: BusinessEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const ProductPurchaseModal: React.FC<ProductPurchaseModalProps> = ({
  product,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !product) return null;

  const [fulfillmentType, setFulfillmentType] = useState<"store_pickup" | "express_delivery">("store_pickup");
  const [buyerName, setBuyerName] = useState(auth.currentUser?.displayName || "");
  const [buyerEmail, setBuyerEmail] = useState(auth.currentUser?.email || "");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<BookingRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const price = fulfillmentType === "store_pickup"
    ? (product.storePrice || product.priceSample || 68990)
    : (product.onlinePrice || product.priceSample || 69990);

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || confirmedOrder) return;
    setIsSubmitting(true);

    const orderRef = `CYG-ORD-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRecord = {
      id: orderRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: product.id,
      businessName: `${product.brand ? product.brand + " · " : ""}${product.name}`,
      category: "product",
      actionType: "buy_product",
      serviceOrTable: `${fulfillmentType === "store_pickup" ? "In-Store Hold & Pickup" : "Express Insured Delivery"} @ ${product.address}`,
      date: "Ready in 2 Hours",
      time: "Valid for 48 Hours",
      status: "confirmed",
      price,
      currency: product.currency || "₹",
      reference: orderRef,
      notes: deliveryAddress ? `Delivery to: ${deliveryAddress}` : "Pickup at physical store counter",
      createdAt: new Date().toISOString(),
      cancellationPolicy: "Full refund or cancellation prior to in-store pickup or carrier dispatch.",
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "bookings", orderRef), newBooking);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `bookings/${orderRef}`);
      }
    }

    setIsSubmitting(false);
    setConfirmedOrder(newBooking);
    onBookingSuccess(newBooking);
  };

  const copyRef = () => {
    if (confirmedOrder) {
      navigator.clipboard?.writeText(confirmedOrder.reference);
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

        {confirmedOrder ? (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1.5px] mx-auto">
              <div className="w-full h-full bg-[#080B1A] rounded-[14px] flex items-center justify-center text-[#00F5D4]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono font-semibold">
                {fulfillmentType === "store_pickup" ? "Inventory Held for Store Pickup" : "Order Dispatched for Delivery"}
              </span>
              <h3 className="text-2xl font-bold text-white">{product.name}</h3>
              <p className="text-xs text-slate-400">
                {product.address} · {product.city}
              </p>
            </div>

            {/* Receipt Voucher */}
            <div className="p-5 rounded-2xl bg-[#101528] border border-[#1F2948] text-left text-xs space-y-2.5 font-mono shadow-inner">
              <div className="flex justify-between items-center border-b border-[#1A233E] pb-2.5 text-slate-300">
                <span>Order Reference:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00F5D4] font-bold">{confirmedOrder.reference}</span>
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
                <span>Fulfillment Mode:</span>
                <span className="text-white font-bold">
                  {fulfillmentType === "store_pickup" ? "Store Pickup (Held 48 hrs)" : "Insured Express Delivery"}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Amount:</span>
                <span className="text-[#00F5D4] font-bold text-sm">
                  {confirmedOrder.currency}{confirmedOrder.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Seller Verification:</span>
                <span className="text-emerald-400">{product.verifiedProvider || "Authorized Retail Channel"}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-[#1A233E]">
                <span>Cancellation:</span>
                <span>{confirmedOrder.cancellationPolicy}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Present your reservation reference upon store arrival or track carrier dispatch in My Activity.
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
                  Verified Hardware Stock Hold
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{product.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                <span>{product.address}</span>
              </p>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-5">
              {/* Fulfillment Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  1. Fulfillment Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFulfillmentType("store_pickup")}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      fulfillmentType === "store_pickup"
                        ? "bg-[#00F5D4]/15 border-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                        : "bg-[#101528] border-[#1F2948] hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[#00F5D4] font-bold text-xs mb-1">
                      <Store className="w-4 h-4" />
                      <span>In-Store Pickup</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {product.currency}{(product.storePrice || product.priceSample || 68990).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1 font-medium">
                      ✓ Ready in 2 Hours (Save ₹1,000)
                    </div>
                  </div>

                  <div
                    onClick={() => setFulfillmentType("express_delivery")}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      fulfillmentType === "express_delivery"
                        ? "bg-[#00F5D4]/15 border-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                        : "bg-[#101528] border-[#1F2948] hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-xs mb-1">
                      <Truck className="w-4 h-4" />
                      <span>Insured Express</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {product.currency}{(product.onlinePrice || product.priceSample || 69990).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Dispatched within 24 Hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address if Express */}
              {fulfillmentType === "express_delivery" && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Delivery Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter complete address with PIN code"
                    className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              )}

              {/* Buyer Contact */}
              <div className="space-y-3 pt-2 border-t border-[#192238]">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Aman Gupta"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Phone (SMS Alert)</label>
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="+91 99887 76655"
                      className="w-full bg-[#101528] border border-[#1F2948] focus:border-[#00F5D4] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
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
                    ? "Locking Stock..."
                    : `Reserve & Hold for ${product.currency || "₹"}${price.toLocaleString()}`}
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

export default ProductPurchaseModal;
