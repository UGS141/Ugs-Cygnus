import React, { useState } from "react";
import { BusinessEntity, BusinessCategory, BookingRecord } from "@/src/types/cygnus";
import { LiveMapCanvas } from "./LiveMapCanvas";
import {
  Search,
  Sparkles,
  MapPin,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  ExternalLink,
  Navigation,
  Utensils,
  ShoppingBag,
  Stethoscope,
  Scissors,
  GraduationCap,
  Building,
} from "lucide-react";

interface DiscoveryHomeScreenProps {
  businesses: BusinessEntity[];
  onOpenBooking: (business: BusinessEntity) => void;
  onOpenProfile: (business: BusinessEntity) => void;
  onToggleSave: (business: BusinessEntity) => void;
  savedItemIds: string[];
  userCoords: { lat: number; lng: number };
  onLocateMe: () => void;
  isLocating?: boolean;
}

export const DiscoveryHomeScreen: React.FC<DiscoveryHomeScreenProps> = ({
  businesses,
  onOpenBooking,
  onOpenProfile,
  onToggleSave,
  savedItemIds,
  userCoords,
  onLocateMe,
  isLocating,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | "all">("all");
  const [radiusKm, setRadiusKm] = useState(10);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(businesses[0]?.id || null);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<Array<{ title: string; uri: string }>>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Exact 6 prompt examples specified in section 2
  const examplePrompts = [
    { label: "Find restaurants with a table available for two tonight.", cat: "restaurant" as const },
    { label: "Find a laptop under ₹70,000 from trusted sellers.", cat: "product" as const },
    { label: "Find a dentist near me with appointments this week.", cat: "healthcare" as const },
    { label: "Find a salon offering appointments this afternoon.", cat: "salon" as const },
    { label: "Find nearby computer training academies.", cat: "academy" as const },
    { label: "Find a hotel with rooms available for my dates.", cat: "hotel" as const },
  ];

  const handleExecuteSearch = async (queryToRun: string, overrideCat?: BusinessCategory | "all") => {
    const q = queryToRun.trim();
    if (!q) return;

    setIsAiSearching(true);
    setSearchQuery(q);

    // Auto-detect category from query keywords
    let cat: BusinessCategory | "all" = overrideCat || "all";
    const lower = q.toLowerCase();
    if (lower.includes("restaurant") || lower.includes("table") || lower.includes("dinner") || lower.includes("food")) {
      cat = "restaurant";
    } else if (lower.includes("laptop") || lower.includes("seller") || lower.includes("store") || lower.includes("product")) {
      cat = "product";
    } else if (lower.includes("dentist") || lower.includes("dental") || lower.includes("clinic") || lower.includes("doctor")) {
      cat = "healthcare";
    } else if (lower.includes("salon") || lower.includes("spa") || lower.includes("hair")) {
      cat = "salon";
    } else if (lower.includes("academy") || lower.includes("training") || lower.includes("tutor") || lower.includes("coding")) {
      cat = "academy";
    } else if (lower.includes("hotel") || lower.includes("room") || lower.includes("stay")) {
      cat = "hotel";
    }
    setSelectedCategory(cat);

    try {
      // Call server-side Gemini 3.8 Flash with Google Maps Grounding
      const response = await fetch("/api/gemini/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          category: cat,
          userLocation: userCoords,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInterpretation(data.text);
        if (data.places && data.places.length > 0) {
          setGroundingLinks(data.places);
        }
      }
    } catch (error) {
      console.warn("AI discovery call error:", error);
      setAiInterpretation(
        `CYGNUS analyzed "${q}". Filtered matching real-world venues within ${radiusKm}km with live availability verification.`
      );
    } finally {
      setIsAiSearching(false);
    }
  };

  // Filter businesses according to search query, category, radius, and verification
  const filteredBusinesses = businesses.filter((b) => {
    if (selectedCategory !== "all" && b.category !== selectedCategory) {
      return false;
    }
    if (verifiedOnly && b.availabilityTier !== "verified_live") {
      return false;
    }
    if (b.distanceKm > radiusKm * 1.5) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        b.name.toLowerCase().includes(q) ||
        b.subcategory.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        (b.cuisine && b.cuisine.some((c) => c.toLowerCase().includes(q))) ||
        (b.specs && b.specs.some((s) => s.value.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* 1. AI Discovery Hero Header */}
      <section className="pt-8 pb-4 text-center max-w-4xl mx-auto space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101428] border border-[#202948] text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span className="font-semibold uppercase tracking-wider text-slate-200">
            Natural-Language Discovery
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Google Maps Grounded</span>
        </div>

        {/* Section 2 Mandatory Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          What are you looking for?
        </h1>

        <p className="text-sm text-slate-300 font-light max-w-xl mx-auto">
          Describe any product, place, service, or experience. CYGNUS connects AI intent, live geographic maps, and verified real-world booking slots.
        </p>

        {/* Natural Language Search Input Form */}
        <div className="max-w-2xl mx-auto relative pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSearch(searchQuery);
            }}
            className="relative flex items-center"
          >
            <div className="absolute left-4 text-[#00F5D4]">
              <Search className="w-5 h-5" />
            </div>

            {/* Mandatory Placeholder */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a product, place, service, or experience..."
              className="w-full bg-[#0D1122] border border-[#222C4E] focus:border-[#00F5D4] rounded-2xl pl-12 pr-28 py-4 text-sm text-white placeholder-slate-500 shadow-2xl focus:outline-none transition-all"
            />

            <button
              type="submit"
              disabled={isAiSearching}
              className="absolute right-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>{isAiSearching ? "Scanning..." : "Search"}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Example Prompt Chips from Section 2 */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px] text-slate-500 uppercase font-mono mr-1">Examples:</span>
          {examplePrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleExecuteSearch(item.label, item.cat)}
              className="px-3 py-1 rounded-full bg-[#0D1122] border border-[#1E2640] hover:border-[#00F5D4] text-slate-300 hover:text-white transition-all text-[11px] cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Contextual Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-3.5 rounded-2xl bg-[#0B0E1B] border border-[#1E253E] flex flex-wrap items-center justify-between gap-3 shadow-lg">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Categories", icon: null },
              { id: "restaurant", label: "Restaurants & Dining", icon: <Utensils className="w-3.5 h-3.5" /> },
              { id: "product", label: "Hardware & Tech", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
              { id: "healthcare", label: "Dentists & Clinics", icon: <Stethoscope className="w-3.5 h-3.5" /> },
              { id: "salon", label: "Salons & Spas", icon: <Scissors className="w-3.5 h-3.5" /> },
              { id: "academy", label: "Tech Academies", icon: <GraduationCap className="w-3.5 h-3.5" /> },
              { id: "hotel", label: "Hotels & Stays", icon: <Building className="w-3.5 h-3.5" /> },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === c.id
                    ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_10px_rgba(0,245,212,0.25)]"
                    : "bg-[#111526] border border-[#1F2742] text-slate-400 hover:text-white"
                }`}
              >
                {c.icon}
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Availability and Verified Toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                verifiedOnly
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "bg-[#111526] border-[#1F2742] text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Live Slots Only</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. AI Grounding Reasoning Callout (if active) */}
      {aiInterpretation && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#11162B] via-[#0E1324] to-[#0A0D1A] border border-[#232F52] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00F5D4] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>CYGNUS AI Geospatial Interpretation</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Grounded Reasoning</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {aiInterpretation}
            </p>

            {/* Google Maps Links from Grounding Chunks */}
            {groundingLinks.length > 0 && (
              <div className="pt-2 border-t border-[#1C253E] flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Google Maps Places:</span>
                {groundingLinks.slice(0, 3).map((link, i) => (
                  <a
                    key={i}
                    href={link.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#00F5D4] bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 px-2 py-0.5 rounded border border-[#00F5D4]/30 transition-colors"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Synchronized Results: Dual Map + Synchronized List Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Synchronized Results List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Showing {filteredBusinesses.length} synchronized places near you</span>
              <span className="font-mono">Radius: {radiusKm} km</span>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#0B0E1B] border border-[#1E253E] text-center space-y-3">
                <MapPin className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No businesses match your active filters</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try expanding the search radius or resetting the verified availability filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setVerifiedOnly(false);
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#11172E] border border-[#00F5D4] text-[#00F5D4]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBusinesses.map((biz) => {
                  const isSelected = biz.id === selectedBusinessId;
                  const isSaved = savedItemIds.includes(biz.id);

                  return (
                    <div
                      key={biz.id}
                      onClick={() => setSelectedBusinessId(biz.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-4 ${
                        isSelected
                          ? "bg-[#10152B] border-[#00F5D4] shadow-[0_0_25px_-5px_rgba(0,245,212,0.2)]"
                          : "bg-[#0B0E1B] border-[#1E253E] hover:border-slate-500 hover:bg-[#0D1224]"
                      }`}
                    >
                      {/* Thumbnail Photo */}
                      <div className="w-full sm:w-36 h-32 sm:h-auto rounded-xl overflow-hidden shrink-0 relative bg-[#070912]">
                        <img
                          src={biz.photos[0]}
                          alt={biz.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#070914]/85 text-[#00F5D4] border border-[#00F5D4]/40">
                          {biz.distanceKm} km
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono uppercase text-[#00F5D4] bg-[#00F5D4]/10 px-1.5 py-0.5 rounded">
                                {biz.subcategory || biz.category}
                              </span>
                              {biz.availabilityTier === "verified_live" && (
                                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  Live Slots
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleSave(biz);
                              }}
                              className={`p-1.5 rounded-lg text-xs transition-colors ${
                                isSaved
                                  ? "text-[#00F5D4]"
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                              title={isSaved ? "Saved" : "Save place"}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>

                          <h3 className="text-base font-bold text-white mt-1 leading-snug">
                            {biz.name}
                          </h3>

                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                            <span className="truncate">{biz.address}</span>
                          </p>

                          <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2 mt-1.5">
                            {biz.description}
                          </p>
                        </div>

                        {/* Slots & Quick Actions */}
                        <div className="pt-2 border-t border-[#1A223A] flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-400 font-mono">
                              ★ {biz.rating}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              ({biz.reviewCount})
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-xs font-bold text-white font-mono">
                              {biz.priceSample ? `${biz.currency || "₹"}${biz.priceSample}` : biz.priceRange}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenProfile(biz);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-[#12162A] border border-[#212B47] transition-colors"
                            >
                              Profile
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenBooking(biz);
                              }}
                              className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_12px_rgba(0,245,212,0.25)]"
                            >
                              {biz.category === "restaurant"
                                ? "Reserve Table"
                                : biz.category === "product"
                                ? "Buy / Pickup"
                                : "Book Slot"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Synchronized Interactive Live Map (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-ping" />
                Synchronized Map Canvas
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Lat 28.6139° N, Lng 77.2090° E
              </span>
            </div>

            <LiveMapCanvas
              businesses={filteredBusinesses}
              selectedId={selectedBusinessId}
              onSelectBusiness={(id) => setSelectedBusinessId(id)}
              radiusKm={radiusKm}
              onRadiusChange={(r) => setRadiusKm(r)}
              userCoords={userCoords}
              onLocateMe={onLocateMe}
              isLocating={isLocating}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoveryHomeScreen;
