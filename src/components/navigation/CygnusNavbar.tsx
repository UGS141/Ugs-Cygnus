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
    <header className="sticky top-0 z-40 bg-[#070914]/90 backdrop-blur-md border-b border-[#1A2035] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div
          onClick={() => onTabChange("discover")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1.5px] shadow-[0_0_15px_rgba(0,245,212,0.3)]">
            <div className="w-full h-full bg-[#070914] rounded-[10px] flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#00F5D4] group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>CYGNUS</span>
              <span className="text-[9px] font-mono uppercase bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30 px-1.5 py-0.2 rounded">
                AI + MAPS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Geospatial Discovery & Live Booking
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs (Discover, Map, 3D Radar, My Bookings) */}
        <nav className="flex items-center gap-1 bg-[#0D1022] border border-[#1F2742] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onTabChange("discover")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === "discover"
                ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_10px_rgba(0,245,212,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discover</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("map")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === "map"
                ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_10px_rgba(0,245,212,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Live Map</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("radar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 hidden md:flex ${
              currentTab === "radar"
                ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_10px_rgba(0,245,212,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>3D Radar</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("bookings")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === "bookings"
                ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_10px_rgba(0,245,212,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>My Bookings</span>
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
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#11172E] border border-[#232F52] hover:border-[#00F5D4] text-slate-200 hover:text-white transition-all flex items-center gap-1.5 shadow-md"
          >
            <Bot className="w-3.5 h-3.5 text-[#00F5D4]" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border border-[#00F5D4] overflow-hidden"
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
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default CygnusNavbar;
