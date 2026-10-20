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

  const price = fulfillmentType === "store_pickup" ? (product.storePrice || product.priceSample || 68990) : (product.onlinePrice || product.priceSample || 69990);

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderRef = `CYG-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: BookingRecord = {
      id: orderRef,
      userId: auth.currentUser?.uid || "guest_user",
      businessId: product.id,
      businessName: `${product.brand ? product.brand + " · " : ""}${product.name}`,
      category: "product",
      serviceOrTable: `${fulfillmentType === "store_pickup" ? "In-Store Hold & Pickup" : "Express Insured Delivery"} @ ${product.address}`,
      date: "Ready in 2 Hours",
      time: "Valid for 48 Hours",
      status: "confirmed",
      price,
      currency: product.currency || "₹",
      reference: orderRef,
      notes: deliveryAddress ? `Delivery to: ${deliveryAddress}` : "Pickup at physical store",
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

        {confirmedOrder ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#00F5D4]/15 border border-[#00F5D4]/40 flex items-center justify-center mx-auto text-[#00F5D4]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono">
                {fulfillmentType === "store_pickup" ? "In-Store Stock Reserved" : "Order Placed & Dispatched"}
              </span>
              <h3 className="text-2xl font-bold text-white">{product.name}</h3>
              <p className="text-xs text-slate-400">
                {product.address} · {product.city}
              </p>
            </div>

            {/* Receipt Voucher */}
            <div className="p-4 rounded-xl bg-[#11162B] border border-[#212C4E] text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-[#1A233E] pb-2 text-slate-300">
                <span>Order Reference:</span>
                <span className="text-[#00F5D4] font-bold">{confirmedOrder.reference}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fulfillment Mode:</span>
                <span className="text-white font-bold">
                  {fulfillmentType === "store_pickup" ? "Store Pickup (Held 48 hrs)" : "Insured Delivery"}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Amount:</span>
                <span className="text-[#00F5D4] font-bold">
                  {confirmedOrder.currency}{confirmedOrder.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Seller Verification:</span>
                <span className="text-emerald-400">Authorized Brand Channel</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Present your reservation reference upon store arrival or track carrier telemetry in My Bookings.
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
          <form onSubmit={handleConfirmOrder} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-[#00F5D4]" />
                <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-semibold">
                  Product Verification & Checkout
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Live Stock Verified
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>{product.address} ({product.distanceKm} km away)</span>
              </p>
            </div>

            {/* Specifications Comparison Table */}
            {product.specs && (
              <div className="p-3.5 rounded-xl bg-[#111526] border border-[#212B47] space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Verified Hardware Specifications
                </div>
                <div className="space-y-1.5 text-xs">
                  {product.specs.map((sp, i) => (
                    <div key={i} className="flex justify-between border-b border-[#1A2238] pb-1 last:border-none">
                      <span className="text-slate-400">{sp.label}:</span>
                      <span className="text-slate-200 font-medium text-right max-w-[65%]">{sp.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fulfillment Mode Choice */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Select Purchase / Fulfillment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setFulfillmentType("store_pickup")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    fulfillmentType === "store_pickup"
                      ? "bg-[#00F5D4]/10 border-[#00F5D4] text-white shadow-[0_0_15px_rgba(0,245,212,0.15)]"
                      : "bg-[#111526] border-[#222A44] text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                    <Store className="w-4 h-4 text-[#00F5D4]" />
                    <span>In-Store Pickup & Demo</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Ready in 2 hours at Nehru Place Hub</div>
                  <div className="text-sm font-bold text-[#00F5D4] font-mono mt-2">
                    {product.currency}{product.storePrice?.toLocaleString() || price.toLocaleString()}
                  </div>
                </div>

                <div
                  onClick={() => setFulfillmentType("express_delivery")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    fulfillmentType === "express_delivery"
                      ? "bg-[#38BDF8]/10 border-[#38BDF8] text-white shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                      : "bg-[#111526] border-[#222A44] text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                    <Truck className="w-4 h-4 text-[#38BDF8]" />
                    <span>Direct Insured Delivery</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Same-day courier dispatch</div>
                  <div className="text-sm font-bold text-[#38BDF8] font-mono mt-2">
                    {product.currency}{product.onlinePrice?.toLocaleString() || price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Buyer Full Name *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Karan Verma"
                  className="w-full bg-[#111526] border border-[#222A44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5D4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+91 98112 23344"
                  className="w-full bg-[#111526] border border-[#222A44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5D4]"
                />
              </div>
            </div>

            {fulfillmentType === "express_delivery" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Flat 304, Palm Heights, New Delhi 110024"
                  className="w-full bg-[#111526] border border-[#222A44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F5D4]"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#1C243E] flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Authorized Seller · 100% Genuine Box
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] flex items-center gap-2"
              >
                <span>{isSubmitting ? "Reserving Item..." : `Confirm ${fulfillmentType === "store_pickup" ? "In-Store Hold" : "Purchase"}`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductPurchaseModal;
