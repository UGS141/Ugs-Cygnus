import React, { useState, useEffect } from "react";
import { BusinessEntity, BookingRecord, SavedPlaceItem } from "@/src/types/cygnus";
import { MOCK_BUSINESSES } from "@/src/data/mockPlaces";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";

import CygnusNavbar, { NavTab } from "@/src/components/navigation/CygnusNavbar";
import DiscoveryHomeScreen from "@/src/components/discovery/DiscoveryHomeScreen";
import LiveMapCanvas from "@/src/components/discovery/LiveMapCanvas";
import CygnusCelestialRadar from "@/src/components/three/CygnusCelestialRadar";
import MyBookingsView from "@/src/components/activity/MyBookingsView";
import RestaurantReservationModal from "@/src/components/booking/RestaurantReservationModal";
import ServiceAppointmentModal from "@/src/components/booking/ServiceAppointmentModal";
import ProductPurchaseModal from "@/src/components/booking/ProductPurchaseModal";
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
  const [isLocating, setIsLocating] = useState(false);

  // Active Modals State
  const [activeRestaurant, setActiveRestaurant] = useState<BusinessEntity | null>(null);
  const [activeServiceBiz, setActiveServiceBiz] = useState<BusinessEntity | null>(null);
  const [activeProduct, setActiveProduct] = useState<BusinessEntity | null>(null);
  const [profileBiz, setProfileBiz] = useState<BusinessEntity | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
            const records: BookingRecord[] = [];
            snapshot.forEach((doc) => {
              records.push(doc.data() as BookingRecord);
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
            const items: SavedPlaceItem[] = [];
            snapshot.forEach((doc) => {
              items.push(doc.data() as SavedPlaceItem);
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
        // Fallback demo bookings for guests
        setBookings((prev) =>
          prev.length === 0
            ? [
                {
                  id: "CYG-TBL-892411",
                  userId: "guest",
                  businessId: "rest-01",
                  businessName: "Aura Hearth & Woodfire Kitchen",
                  category: "restaurant",
                  serviceOrTable: "Table for 2 (Indoor Main Dining)",
                  date: "Tonight, Oct 20",
                  time: "8:15 PM",
                  partySize: 2,
                  status: "confirmed",
                  price: 1800,
                  currency: "₹",
                  reference: "CYG-TBL-892411",
                  createdAt: new Date().toISOString(),
                  cancellationPolicy: "Free cancellation up to 2 hours prior",
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

  // Route booking requests to specific modal based on business category
  const handleOpenBooking = (biz: BusinessEntity) => {
    if (biz.category === "restaurant") {
      setActiveRestaurant(biz);
    } else if (biz.category === "product") {
      setActiveProduct(biz);
    } else {
      setActiveServiceBiz(biz);
    }
  };

  // Handle successful booking addition
  const handleBookingSuccess = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
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
    <div className="min-h-screen bg-[#060812] text-[#F8FAFC] selection:bg-[#00F5D4] selection:text-[#060812]">
      {/* 1. Top Navbar */}
      <CygnusNavbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenChat={() => setIsChatOpen(true)}
        bookingCount={bookings.filter((b) => b.status === "confirmed").length}
      />

      {/* 2. Main Content Screens */}
      <main>
        {/* Tab 1: AI Discovery Home Screen */}
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
          />
        )}

        {/* Tab 2: Full-screen Live Map Discovery */}
        {currentTab === "map" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Full-Bleed Geospatial Canvas</h2>
                <p className="text-xs text-slate-400">
                  Interactive real-world markers with live provider availability
                </p>
              </div>
            </div>

            <LiveMapCanvas
              businesses={businesses}
              selectedId={businesses[0]?.id || null}
              onSelectBusiness={(id) => {
                const found = businesses.find((b) => b.id === id);
                if (found) setProfileBiz(found);
              }}
              radiusKm={15}
              onRadiusChange={() => {}}
              userCoords={userCoords}
              onLocateMe={handleLocateMe}
              isLocating={isLocating}
              className="h-[75vh]"
            />
          </div>
        )}

        {/* Tab 3: Three.js 3D Spatial Radar Studio */}
        {currentTab === "radar" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded">
                Three.js Spatial Studio Rig
              </span>
              <h2 className="text-3xl font-bold text-white">
                CYGNUS Celestial 3D Radar Beacon
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Procedural 8-part PBR constellation beacon rendered with ACESFilmicToneMapping, RoomEnvironment reflection map, and exponential damping camera smoothing.
              </p>
            </div>

            <CygnusCelestialRadar className="h-[520px] max-w-4xl mx-auto" />
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

      {/* 3. Interactive Modals */}
      {/* Restaurant Table Reservation Modal */}
      <RestaurantReservationModal
        restaurant={activeRestaurant}
        isOpen={Boolean(activeRestaurant)}
        onClose={() => setActiveRestaurant(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Local Service Appointment Modal */}
      <ServiceAppointmentModal
        business={activeServiceBiz}
        isOpen={Boolean(activeServiceBiz)}
        onClose={() => setActiveServiceBiz(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Product Purchase & In-Store Pickup Modal */}
      <ProductPurchaseModal
        product={activeProduct}
        isOpen={Boolean(activeProduct)}
        onClose={() => setActiveProduct(null)}
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
