import React, { useState, useEffect } from "react";
import { BusinessEntity, BookingRecord, SavedPlaceItem } from "@/src/types/cygnus";
import { MOCK_BUSINESSES } from "@/src/data/mockPlaces";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";

import ScrollProgress from "@/src/components/ScrollProgress";
import CygnusNavbar, { NavTab } from "@/src/components/navigation/CygnusNavbar";
import DiscoveryHomeScreen from "@/src/components/discovery/DiscoveryHomeScreen";
import LiveMapCanvas from "@/src/components/discovery/LiveMapCanvas";
import CygnusCelestialRadar from "@/src/components/three/CygnusCelestialRadar";
import MyBookingsView from "@/src/components/activity/MyBookingsView";

// Transaction & Booking Modals
import RestaurantReservationModal from "@/src/components/booking/RestaurantReservationModal";
import ServiceAppointmentModal from "@/src/components/booking/ServiceAppointmentModal";
import ProductPurchaseModal from "@/src/components/booking/ProductPurchaseModal";
import QuotationRequestModal from "@/src/components/booking/QuotationRequestModal";
import EquipmentRentalModal from "@/src/components/booking/EquipmentRentalModal";
import HomeServiceRequestModal from "@/src/components/booking/HomeServiceRequestModal";
import UnifiedBusinessProfile from "@/src/components/profile/UnifiedBusinessProfile";
import GeminiChatDrawer from "@/src/components/chat/GeminiChatDrawer";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("discover");
  const [businesses, setBusinesses] = useState<BusinessEntity[]>(MOCK_BUSINESSES);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [savedItems, setSavedItems] = useState<SavedPlaceItem[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.2090,
  });
  const [activeRegionName, setActiveRegionName] = useState("Delhi NCR");
  const [isLocating, setIsLocating] = useState(false);

  // Active Modals State for Universal Action Framework
  const [activeRestaurant, setActiveRestaurant] = useState<BusinessEntity | null>(null);
  const [activeServiceBiz, setActiveServiceBiz] = useState<BusinessEntity | null>(null);
  const [activeProduct, setActiveProduct] = useState<BusinessEntity | null>(null);
  const [activeQuotationBiz, setActiveQuotationBiz] = useState<BusinessEntity | null>(null);
  const [activeEquipmentBiz, setActiveEquipmentBiz] = useState<BusinessEntity | null>(null);
  const [activeHomeServiceBiz, setActiveHomeServiceBiz] = useState<BusinessEntity | null>(null);
  const [profileBiz, setProfileBiz] = useState<BusinessEntity | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Keyboard shortcut listener: Cmd+K or Ctrl+K opens AI assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Initial user auth tracking & live Firestore sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Listen to live user bookings in Firestore
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );

        const unsubscribeBookings = onSnapshot(
          bookingsQuery,
          (snapshot) => {
            const seen = new Set<string>();
            const records: BookingRecord[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data() as BookingRecord;
              const id = data.id || doc.id;
              if (!seen.has(id)) {
                seen.add(id);
                records.push({ ...data, id });
              }
            });
            // Sort by creation date descending
            records.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setBookings(records);
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, "bookings");
          }
        );

        // Listen to live saved items
        const savedQuery = query(
          collection(db, "savedItems"),
          where("userId", "==", user.uid)
        );

        const unsubscribeSaved = onSnapshot(
          savedQuery,
          (snapshot) => {
            const seen = new Set<string>();
            const items: SavedPlaceItem[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data() as SavedPlaceItem;
              const id = data.id || doc.id;
              if (!seen.has(id)) {
                seen.add(id);
                items.push({ ...data, id });
              }
            });
            setSavedItems(items);
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, "savedItems");
          }
        );

        return () => {
          unsubscribeBookings();
          unsubscribeSaved();
        };
      } else {
        // Fallback initial sample booking for demo
        setBookings((prev) =>
          prev.length === 0
            ? [
                {
                  id: "CYG-RFQ-819204",
                  userId: "guest",
                  businessId: "agri-01",
                  businessName: "Sri Lakshmi Venkateswara Agro Agencies",
                  category: "agriculture",
                  actionType: "request_quotation",
                  serviceOrTable: "B2B Quotation: 50 Bags (50kg) Paddy BPT-5204 Seeds & Urea",
                  date: "Within 48 Hours",
                  time: "Nellore Rural Hub",
                  status: "confirmed",
                  price: 62500,
                  currency: "₹",
                  reference: "CYG-RFQ-819204",
                  createdAt: new Date().toISOString(),
                  cancellationPolicy: "Wholesale price locked for 72 hours",
                },
              ]
            : prev
        );
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Geolocation detection handler
  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setActiveRegionName("Current GPS Location");
          setIsLocating(false);
        },
        (err) => {
          console.warn("Geolocation denied or unavailable:", err.message);
          setIsLocating(false);
        },
        { timeout: 8000 }
      );
    }
  };

  const handleLocationChange = (coords: { lat: number; lng: number }, name: string) => {
    setUserCoords(coords);
    setActiveRegionName(name);
  };

  // Route booking requests to specific modal based on business actionType & category
  const handleOpenBooking = (biz: BusinessEntity) => {
    if (biz.actionType === "reserve_table") {
      setActiveRestaurant(biz);
    } else if (biz.actionType === "buy_product") {
      setActiveProduct(biz);
    } else if (biz.actionType === "request_service") {
      setActiveHomeServiceBiz(biz);
    } else if (biz.actionType === "rent_equipment") {
      setActiveEquipmentBiz(biz);
    } else if (
      biz.actionType === "request_quotation" ||
      biz.actionType === "schedule_site_visit" ||
      biz.actionType === "contact_supplier"
    ) {
      setActiveQuotationBiz(biz);
    } else {
      setActiveServiceBiz(biz);
    }
  };

  // Handle successful booking addition
  const handleBookingSuccess = (newBooking: BookingRecord) => {
    setBookings((prev) => {
      const filtered = prev.filter(
        (b) => b.id !== newBooking.id && (!b.reference || b.reference !== newBooking.reference)
      );
      return [newBooking, ...filtered];
    });
    setCurrentTab("bookings");
  };

  // Save / Bookmark toggle
  const handleToggleSave = async (biz: BusinessEntity) => {
    const isAlreadySaved = savedItems.some((s) => s.itemId === biz.id);

    if (isAlreadySaved) {
      const target = savedItems.find((s) => s.itemId === biz.id);
      if (target) {
        if (auth.currentUser) {
          try {
            await deleteDoc(doc(db, "savedItems", target.id));
          } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `savedItems/${target.id}`);
          }
        }
        setSavedItems((prev) => prev.filter((s) => s.id !== target.id));
      }
    } else {
      const newSaved: SavedPlaceItem = {
        id: `save-${Date.now()}`,
        userId: auth.currentUser?.uid || "guest",
        itemId: biz.id,
        title: biz.name,
        category: biz.category,
        location: `${biz.address}, ${biz.city}`,
        rating: biz.rating,
        priceRange: biz.priceRange,
        createdAt: new Date().toISOString(),
      };

      if (auth.currentUser) {
        try {
          await setDoc(doc(db, "savedItems", newSaved.id), newSaved);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `savedItems/${newSaved.id}`);
        }
      }
      setSavedItems((prev) => [newSaved, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050712] text-[#F8FAFC] selection:bg-[#00F5D4] selection:text-[#060812] relative overflow-x-hidden">
      {/* 0. Top Viewport Scroll Progress Bar */}
      <ScrollProgress />

      {/* Atmospheric Ambient Glow Backdrops (Antigravity Style) */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-[#8B5CF6]/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-[#00F5D4]/6 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[700px] h-[400px] bg-[#3B82F6]/6 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* 1. Top Navbar */}
      <CygnusNavbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenChat={() => setIsChatOpen(true)}
        bookingCount={bookings.filter((b) => b.status === "confirmed").length}
      />

      {/* 2. Main Content Screens */}
      <main>
        {/* Tab 1: AI Universal Discovery Home Screen */}
        {currentTab === "discover" && (
          <DiscoveryHomeScreen
            businesses={businesses}
            onOpenBooking={handleOpenBooking}
            onOpenProfile={(biz) => setProfileBiz(biz)}
            onToggleSave={handleToggleSave}
            savedItemIds={savedItems.map((s) => s.itemId)}
            userCoords={userCoords}
            onLocateMe={handleLocateMe}
            isLocating={isLocating}
            onLocationChange={handleLocationChange}
          />
        )}

        {/* Tab 2: Full-screen Live Map Discovery */}
        {currentTab === "map" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-widest text-[#00F5D4] font-mono font-semibold">
                    Universal Cartographic Canvas
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Real-Time Location & Place Discovery
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Location-aware providers, agricultural dealers, emergency technicians, restaurants & machinery
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 bg-[#0E1326] border border-[#1E2744] px-3 py-1.5 rounded-xl font-mono">
                  {businesses.length} Anchored Providers · {activeRegionName}
                </span>
              </div>
            </div>

            <LiveMapCanvas
              businesses={businesses}
              selectedId={businesses[0]?.id || null}
              onSelectBusiness={(id) => {
                const found = businesses.find((b) => b.id === id);
                if (found) setProfileBiz(found);
              }}
              radiusKm={25}
              onRadiusChange={() => {}}
              userCoords={userCoords}
              onLocateMe={handleLocateMe}
              isLocating={isLocating}
              className="h-[75vh]"
              onOpenBookingModal={handleOpenBooking}
              onManualLocationChange={(locName, coords) => handleLocationChange(coords, locName)}
            />
          </div>
        )}

        {/* Tab 3: Three.js 3D Spatial Radar Studio */}
        {currentTab === "radar" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F5D4] bg-[#00F5D4]/10 border border-[#00F5D4]/30 px-2.5 py-0.5 rounded-full">
                Three.js Spatial Constellation Rig
              </span>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                CYGNUS Celestial 3D Radar Beacon
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Procedural 8-part PBR constellation beacon rendered with ACESFilmicToneMapping, RoomEnvironment reflection map, and exponential damping camera smoothing.
              </p>
            </div>

            <CygnusCelestialRadar className="h-[540px] max-w-4xl mx-auto" />
          </div>
        )}

        {/* Tab 4: My Bookings & Activity */}
        {currentTab === "bookings" && (
          <MyBookingsView
            bookings={bookings}
            savedItems={savedItems}
            onRemoveBooking={(id) => setBookings((prev) => prev.filter((b) => b.id !== id))}
            onRemoveSaved={(id) => setSavedItems((prev) => prev.filter((s) => s.id !== id))}
            onExploreMore={() => setCurrentTab("discover")}
          />
        )}
      </main>

      {/* 3. Universal Action Framework Modals */}
      {/* 1. Restaurant Table Reservation Modal */}
      <RestaurantReservationModal
        restaurant={activeRestaurant}
        isOpen={Boolean(activeRestaurant)}
        onClose={() => setActiveRestaurant(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 2. Service & Diagnostic Appointment Modal */}
      <ServiceAppointmentModal
        business={activeServiceBiz}
        isOpen={Boolean(activeServiceBiz)}
        onClose={() => setActiveServiceBiz(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 3. Product Purchase & In-Store Pickup Modal */}
      <ProductPurchaseModal
        product={activeProduct}
        isOpen={Boolean(activeProduct)}
        onClose={() => setActiveProduct(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 4. Agricultural & Construction B2B Quotation Modal */}
      <QuotationRequestModal
        business={activeQuotationBiz}
        isOpen={Boolean(activeQuotationBiz)}
        onClose={() => setActiveQuotationBiz(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 5. Tractor & Machinery Equipment Rental Modal */}
      <EquipmentRentalModal
        business={activeEquipmentBiz}
        isOpen={Boolean(activeEquipmentBiz)}
        onClose={() => setActiveEquipmentBiz(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 6. On-Demand Emergency Plumber & Electrician Modal */}
      <HomeServiceRequestModal
        business={activeHomeServiceBiz}
        isOpen={Boolean(activeHomeServiceBiz)}
        onClose={() => setActiveHomeServiceBiz(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Unified Business Profile Modal */}
      <UnifiedBusinessProfile
        business={profileBiz}
        isOpen={Boolean(profileBiz)}
        onClose={() => setProfileBiz(null)}
        onActionClick={handleOpenBooking}
        onToggleSave={handleToggleSave}
        isSaved={profileBiz ? savedItems.some((s) => s.itemId === profileBiz.id) : false}
      />

      {/* Gemini Multi-Turn Conversational Assistant Drawer */}
      <GeminiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onApplySearchQuery={(q) => setCurrentTab("discover")}
      />
    </div>
  );
}
