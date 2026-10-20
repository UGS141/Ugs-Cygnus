import React from "react";
import { auth, signInWithGoogle, logOut } from "@/src/lib/firebase";
import {
  Compass,
  Map,
  Bookmark,
  CalendarCheck,
  Bot,
  User,
  LogIn,
  LogOut,
  Radio,
  Sparkles,
  Zap,
} from "lucide-react";

export type NavTab = "discover" | "map" | "radar" | "bookings";

interface CygnusNavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenChat: () => void;
  bookingCount: number;
}

export const CygnusNavbar: React.FC<CygnusNavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenChat,
  bookingCount,
}) => {
  const user = auth.currentUser;

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#060814]/85 backdrop-blur-xl border-b border-[#1A223B]/80 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
          {/* Brand Lockup */}
          <div
            onClick={() => onTabChange("discover")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1.5px] shadow-[0_0_20px_rgba(0,245,212,0.35)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#070914] rounded-[10px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#00F5D4] group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span className="tracking-wider">CYGNUS</span>
                <span className="text-[9px] font-mono uppercase bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
                  AI + MAPS
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Geospatial Discovery & Verified Booking
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs (Discover, Map, 3D Radar, My Bookings) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0B0F21] border border-[#1E2744] p-1 rounded-2xl shadow-inner">
            <button
              type="button"
              onClick={() => onTabChange("discover")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === "discover"
                  ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_12px_rgba(0,245,212,0.35)] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("map")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === "map"
                  ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_12px_rgba(0,245,212,0.35)] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Live Map</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("radar")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === "radar"
                  ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_12px_rgba(0,245,212,0.35)] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>3D Radar</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("bookings")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === "bookings"
                  ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_12px_rgba(0,245,212,0.35)] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>My Activity</span>
              {bookingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#8B5CF6] text-white text-[10px] flex items-center justify-center font-bold">
                  {bookingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Icons: AI Concierge trigger & Firebase Auth */}
          <div className="flex items-center gap-2">
            {/* AI Concierge Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenChat}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0D1226] border border-[#232F52] hover:border-[#00F5D4] text-slate-200 hover:text-white transition-all flex items-center gap-1.5 shadow-md group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F5D4] group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Ask AI Concierge</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* User Sign In / Profile */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border border-[#00F5D4] overflow-hidden shadow-[0_0_10px_rgba(0,245,212,0.2)]"
                  title={user.displayName || user.email || "Account"}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#00F5D4]/20 text-[#00F5D4] flex items-center justify-center text-xs font-bold">
                      {user.displayName?.[0] || "U"}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => logOut()}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock Bar (Under 768px viewport) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B1A]/95 border-t border-[#1C243E] px-4 py-2 backdrop-blur-xl flex items-center justify-around shadow-2xl">
        <button
          type="button"
          onClick={() => onTabChange("discover")}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            currentTab === "discover" ? "text-[#00F5D4] font-bold" : "text-slate-400"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("map")}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            currentTab === "map" ? "text-[#00F5D4] font-bold" : "text-slate-400"
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("radar")}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            currentTab === "radar" ? "text-[#00F5D4] font-bold" : "text-slate-400"
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>3D Radar</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("bookings")}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors relative ${
            currentTab === "bookings" ? "text-[#00F5D4] font-bold" : "text-slate-400"
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Activity</span>
          {bookingCount > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-[#8B5CF6] text-white text-[9px] flex items-center justify-center font-bold">
              {bookingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenChat}
          className="flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-slate-400 hover:text-white"
        >
          <Bot className="w-4 h-4 text-[#00F5D4]" />
          <span>Ask AI</span>
        </button>
      </nav>
    </>
  );
};

export default CygnusNavbar;
