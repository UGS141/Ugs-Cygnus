import React, { useState } from "react";
import { BusinessEntity, BusinessCategory, ActionType } from "@/src/types/cygnus";
import { LiveMapCanvas } from "./LiveMapCanvas";
import { CompareModal } from "./CompareModal";
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
  Columns2,
  LayoutGrid,
  Map,
  Scale,
  Star,
  X,
  Share2,
  ChevronDown,
  SlidersHorizontal,
  Check,
  Sprout,
  Wrench,
  Laptop,
  Building2,
  Tractor,
  AlertTriangle,
  Briefcase,
  Crosshair,
  Truck,
  Zap,
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
  onLocationChange?: (coords: { lat: number; lng: number }, name: string) => void;
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
  onLocationChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | "all">("all");
  const [radiusKm, setRadiusKm] = useState(15);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"recommended" | "distance" | "rating" | "price_asc">("recommended");
  const [viewMode, setViewMode] = useState<"split" | "grid" | "map">("split");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(businesses[0]?.id || null);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<Array<{ title: string; uri: string }>>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Active City / Hub Preset
  const [activeCityName, setActiveCityName] = useState("Delhi NCR");

  // Missing Context Clarification Chips
  const [activeClarification, setActiveClarification] = useState<{
    topic: string;
    question: string;
    options: string[];
    selected: string | null;
  } | null>(null);

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Comprehensive example prompts covering the complete taxonomy
  const examplePrompts = [
    { label: "Find fertilizer suitable for my paddy field.", cat: "agriculture" as const, city: "Nellore", coords: { lat: 14.4426, lng: 79.9865 } },
    { label: "Find agricultural equipment dealers near Nellore.", cat: "agriculture" as const, city: "Nellore", coords: { lat: 14.4426, lng: 79.9865 } },
    { label: "Find a plumber available today.", cat: "home_services" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { label: "Compare laptops under ₹70,000.", cat: "product" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { label: "Find restaurants with tables available for four people.", cat: "restaurant" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { label: "Find wholesale rice suppliers.", cat: "agriculture" as const, city: "Nellore", coords: { lat: 14.4426, lng: 79.9865 } },
    { label: "Find a reliable website development agency.", cat: "professional" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { label: "Find construction materials for a house.", cat: "construction" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { label: "Find a tractor available for rent.", cat: "agriculture" as const, city: "Nellore", coords: { lat: 14.4426, lng: 79.9865 } },
    { label: "Find a computer academy offering Python classes.", cat: "academy" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { label: "Find a warehouse available for commercial use.", cat: "construction" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { label: "Find a nearby hospital with the relevant specialist.", cat: "healthcare" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { label: "Find a dentist near me with appointments this week.", cat: "healthcare" as const, city: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
  ];

  // City Presets
  const cityPresets = [
    { name: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
    { name: "Nellore (Andhra)", coords: { lat: 14.4426, lng: 79.9865 } },
    { name: "Gurugram Hub", coords: { lat: 28.4595, lng: 77.0266 } },
    { name: "Bengaluru", coords: { lat: 12.9716, lng: 77.5946 } },
    { name: "Hyderabad", coords: { lat: 17.3850, lng: 78.4867 } },
  ];

  const handleCitySelect = (city: { name: string; coords: { lat: number; lng: number } }) => {
    setActiveCityName(city.name);
    if (onLocationChange) {
      onLocationChange(city.coords, city.name);
    }
  };

  const handleExecuteSearch = async (
    queryToRun: string,
    overrideCat?: BusinessCategory | "all",
    targetCity?: string,
    targetCoords?: { lat: number; lng: number }
  ) => {
    const q = queryToRun.trim();
    if (!q) return;

    setIsAiSearching(true);
    setSearchQuery(q);

    if (targetCity && targetCoords) {
      handleCitySelect({ name: targetCity, coords: targetCoords });
    }

    // Auto-detect category from query keywords
    let cat: BusinessCategory | "all" = overrideCat || "all";
    const lower = q.toLowerCase();

    // Auto-route city if mentioned in query
    if (lower.includes("nellore") && !targetCity) {
      handleCitySelect({ name: "Nellore (Andhra)", coords: { lat: 14.4426, lng: 79.9865 } });
    }

    // Auto-populate comparison if user asks to compare
    if (lower.includes("compare") && (lower.includes("laptop") || lower.includes("70,000") || lower.includes("70000"))) {
      setCompareIds(["prod-01", "prod-02", "prod-03"]);
    }

    if (
      lower.includes("fertilizer") ||
      lower.includes("paddy") ||
      lower.includes("tractor") ||
      lower.includes("rice") ||
      lower.includes("harvester") ||
      lower.includes("agri") ||
      lower.includes("seed") ||
      lower.includes("soil")
    ) {
      cat = "agriculture";
      setActiveClarification({
        topic: "crop",
        question: "Target Crop & Cultivation Stage:",
        options: ["Paddy (Rice)", "Cotton / Chili", "Sugarcane", "Soil Testing First"],
        selected: lower.includes("paddy") ? "Paddy (Rice)" : null,
      });
    } else if (
      lower.includes("plumber") ||
      lower.includes("electrician") ||
      lower.includes("ac repair") ||
      lower.includes("leak") ||
      lower.includes("carpenter") ||
      lower.includes("home service")
    ) {
      cat = "home_services";
      setActiveClarification({
        topic: "urgency",
        question: "Urgency / Response Time Required:",
        options: ["Immediate Today (<45 mins)", "Scheduled Tomorrow", "Free Estimate"],
        selected: "Immediate Today (<45 mins)",
      });
    } else if (
      lower.includes("construction") ||
      lower.includes("cement") ||
      lower.includes("steel") ||
      lower.includes("warehouse") ||
      lower.includes("tmt")
    ) {
      cat = "construction";
      setActiveClarification({
        topic: "scale",
        question: "Project Scale / Quantity Required:",
        options: ["Commercial Truckload", "Retail Building Pack", "Lease Consultation"],
        selected: null,
      });
    } else if (lower.includes("laptop") || lower.includes("computer") || lower.includes("hardware")) {
      cat = "product";
      setActiveClarification(null);
    } else if (lower.includes("dentist") || lower.includes("clinic") || lower.includes("doctor") || lower.includes("hospital")) {
      cat = "healthcare";
      setActiveClarification(null);
    } else if (lower.includes("restaurant") || lower.includes("table") || lower.includes("dinner") || lower.includes("omakase")) {
      cat = "restaurant";
      setActiveClarification(null);
    } else if (lower.includes("python") || lower.includes("academy") || lower.includes("class") || lower.includes("course")) {
      cat = "academy";
      setActiveClarification(null);
    } else if (lower.includes("website") || lower.includes("agency") || lower.includes("marketing")) {
      cat = "professional";
      setActiveClarification(null);
    }

    setSelectedCategory(cat);

    try {
      const activeCoords = targetCoords || userCoords;
      const response = await fetch("/api/gemini/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          category: cat,
          userLocation: activeCoords,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInterpretation(data.text);
        if (data.places && data.places.length > 0) {
          setGroundingLinks(data.places);
        }
      } else {
        throw new Error("API call failed");
      }
    } catch (error) {
      console.warn("AI discovery call error:", error);
      // Domain-intelligent synthesis fallback
      if (lower.includes("paddy") || lower.includes("fertilizer")) {
        setAiInterpretation("CYGNUS analyzed paddy cultivation inputs: Recommending Sri Lakshmi Venkateswara Agro Agencies with certified Samba Masuri seeds, water-soluble NPK (19:19:19), and verified state retailer POS stock in Nellore.");
      } else if (lower.includes("laptop") || lower.includes("70,000")) {
        setAiInterpretation("CYGNUS compared laptops under ₹70,000: Shortlisted ASUS Vivobook OLED (₹68,990) and Lenovo IdeaPad Slim 5 (₹62,990) with in-stock retail verification at Nehru Place IT Market.");
      } else if (lower.includes("plumber")) {
        setAiInterpretation("CYGNUS located emergency master plumbers on active standby across Delhi NCR with GPS fleet tracking and under 30-minute arrival guarantee.");
      } else if (lower.includes("hospital") || lower.includes("specialist")) {
        setAiInterpretation("CYGNUS routed to MetroHeart Multispecialty Hospital with verified Centers of Excellence in Cardiology & Orthopedics, plus 24/7 on-duty emergency trauma specialists.");
      } else if (lower.includes("tractor") || lower.includes("harvester")) {
        setAiInterpretation("CYGNUS identified licensed machinery hubs near Nellore with available 45HP-50HP tractors, Kubota paddy harvesters, and professional operators.");
      } else if (lower.includes("warehouse")) {
        setAiInterpretation("CYGNUS located LogisticsHub Grade-A PEB commercial warehouse offering 35,000 sq ft, 12m clear height, and cold chain rooms on NH48 corridor.");
      } else {
        setAiInterpretation(`CYGNUS analyzed "${q}". Filtered matching providers in ${activeCityName} with verified inventory and booking options.`);
      }
    } finally {
      setIsAiSearching(false);
    }
  };

  // Toggle comparison item
  const handleToggleCompare = (biz: BusinessEntity) => {
    if (compareIds.includes(biz.id)) {
      setCompareIds((prev) => prev.filter((id) => id !== biz.id));
    } else {
      if (compareIds.length >= 3) {
        setCompareIds((prev) => [...prev.slice(1), biz.id]);
      } else {
        setCompareIds((prev) => [...prev, biz.id]);
      }
    }
  };

  // Filter & Sort businesses with natural language tokenization & multi-field semantic matching
  const filteredBusinesses = businesses
    .filter((b) => {
      if (selectedCategory !== "all" && b.category !== selectedCategory) {
        return false;
      }
      if (verifiedOnly && b.availabilityTier !== "verified_live") {
        return false;
      }
      if (openNowOnly && !b.isOpen) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const stopWords = new Set([
          "find", "a", "an", "the", "near", "for", "with", "me", "my", "in", "under", "to", "and", "or", "of", "available", "suitable", "compare", "reliable", "offering", "relevant", "some", "any", "is"
        ]);
        const tokens = q
          .replace(/[^\w\s₹]/g, " ")
          .split(/\s+/)
          .filter((t) => t.length > 2 && !stopWords.has(t));

        if (tokens.length > 0) {
          const searchableText = [
            b.name,
            b.subcategory,
            b.category,
            b.description,
            b.address,
            b.city,
            b.brand || "",
            b.verifiedProvider || "",
            ...(b.cropSuitability || []),
            ...(b.cuisine || []),
            ...(b.specs?.map((s) => `${s.label} ${s.value}`) || []),
            ...(b.services?.map((s) => `${s.name} ${s.description}`) || []),
            ...(b.equipmentList?.map((e) => `${e.name} ${e.model}`) || []),
            ...(b.bulkPriceTiers?.map((t) => `${t.minQty} ${t.pricePerUnit}`) || []),
            ...(b.staff?.map((st) => `${st.name} ${st.role}`) || []),
          ].join(" ").toLowerCase();

          // Match if any token is contained in searchableText, or if full query is contained
          const hasTokenMatch = tokens.some((token) => searchableText.includes(token));
          if (!hasTokenMatch && !searchableText.includes(q)) {
            return false;
          }
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_asc") {
        const pa = a.priceSample || 0;
        const pb = b.priceSample || 0;
        return pa - pb;
      }
      return 0;
    });

  const comparedEntities = businesses.filter((b) => compareIds.includes(b.id));

  const getActionLabel = (actionType: ActionType) => {
    switch (actionType) {
      case "reserve_table":
        return "Reserve Table";
      case "buy_product":
        return "Buy / Pickup";
      case "book_appointment":
        return "Book Slot";
      case "request_service":
        return "Request Plumber/Tech";
      case "request_quotation":
        return "Request Quote";
      case "rent_equipment":
        return "Rent Machinery";
      case "enroll_course":
        return "Enroll in Class";
      case "schedule_site_visit":
        return "Schedule Site Visit";
      default:
        return "Enquire / Book";
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      {/* 1. AI Universal Discovery Hero Header */}
      <section className="pt-8 pb-4 text-center max-w-4xl mx-auto space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1226]/80 border border-[#202948] text-xs text-slate-300 backdrop-blur-md shadow-lg flex-wrap justify-center">
          <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span className="font-semibold uppercase tracking-wider text-slate-200">
            Universal AI Discovery Platform
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[#38BDF8] font-mono text-[11px]">Real-Time Grounding</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Section 2 Mandatory Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          What are you looking for?
        </h1>

        <p className="text-sm text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          Describe any product, service, agricultural need, trade supplier, technician, or real-world booking. CYGNUS understands intent, searches live cartography, and connects you directly with verified providers.
        </p>

        {/* Location Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mr-1">
            <MapPin className="w-3.5 h-3.5 text-[#00F5D4]" />
            Location Hub:
          </span>
          {cityPresets.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => handleCitySelect(city)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                activeCityName === city.name
                  ? "bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4] font-bold shadow-[0_0_10px_rgba(0,245,212,0.3)]"
                  : "bg-[#0A0E21] border-[#1E2744] text-slate-400 hover:text-white"
              }`}
            >
              {city.name}
            </button>
          ))}
          <button
            type="button"
            onClick={onLocateMe}
            className="p-1 px-2.5 rounded-full bg-[#101730] border border-[#232F52] text-slate-300 hover:text-[#00F5D4] text-[11px] font-mono flex items-center gap-1 transition-colors"
            title="Use Live GPS Coordinates"
          >
            <Crosshair className={`w-3 h-3 ${isLocating ? "animate-spin text-[#00F5D4]" : "text-[#00F5D4]"}`} />
            <span>GPS Locate</span>
          </button>
        </div>

        {/* Natural Language Search Input Form */}
        <div className="max-w-2xl mx-auto relative pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSearch(searchQuery);
            }}
            className="relative flex items-center group"
          >
            <div className="absolute left-4 text-[#00F5D4] group-focus-within:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>

            {/* Mandatory Placeholder */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a product, place, service, or experience..."
              className="w-full bg-[#0B0F21] border border-[#212C4E] focus:border-[#00F5D4] rounded-2xl pl-12 pr-32 py-4 text-sm text-white placeholder-slate-500 shadow-[0_10px_35px_rgba(0,0,0,0.5)] focus:shadow-[0_0_25px_rgba(0,245,212,0.2)] focus:outline-none transition-all"
            />

            {/* Clear button if text entered */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-28 p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isAiSearching}
              className="absolute right-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,212,0.3)] cursor-pointer"
            >
              <span>{isAiSearching ? "Scanning..." : "Search"}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Interactive Clarification Chips if query has missing context */}
        {activeClarification && (
          <div className="pt-2 max-w-2xl mx-auto p-3 rounded-2xl bg-[#0D142E]/90 border border-[#223057] flex flex-wrap items-center justify-between gap-2 text-xs animate-fade-in">
            <span className="text-slate-300 font-medium font-mono text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
              {activeClarification.question}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeClarification.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setActiveClarification({ ...activeClarification, selected: opt });
                    handleExecuteSearch(`${searchQuery} ${opt}`, selectedCategory);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                    activeClarification.selected === opt
                      ? "bg-[#00F5D4] text-[#06070B] border-[#00F5D4] font-bold"
                      : "bg-[#111A3A] border-[#22325E] text-slate-300 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Example Prompt Chips across the universal industries */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px] text-slate-500 uppercase font-mono mr-1">Universal Prompts:</span>
          {examplePrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleExecuteSearch(item.label, item.cat, item.city, item.coords)}
              className="px-3 py-1 rounded-full bg-[#0D1226]/80 border border-[#1E2640] hover:border-[#00F5D4] text-slate-300 hover:text-white transition-all text-[11px] cursor-pointer hover:bg-[#111730]"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Universal Category Bar & View Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-3.5 rounded-2xl bg-[#090D1C]/90 border border-[#1D253E] flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-xl">
          {/* Universal Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Sectors", icon: null },
              { id: "agriculture", label: "Agriculture & Farming", icon: <Sprout className="w-3.5 h-3.5 text-emerald-400" /> },
              { id: "home_services", label: "Plumber & Electrician", icon: <Wrench className="w-3.5 h-3.5 text-amber-400" /> },
              { id: "construction", label: "Construction & Warehouses", icon: <Building2 className="w-3.5 h-3.5 text-blue-400" /> },
              { id: "product", label: "Electronics & Hardware", icon: <Laptop className="w-3.5 h-3.5 text-cyan-400" /> },
              { id: "restaurant", label: "Dining & Hospitality", icon: <Utensils className="w-3.5 h-3.5 text-teal-400" /> },
              { id: "healthcare", label: "Healthcare & Dental", icon: <Stethoscope className="w-3.5 h-3.5 text-rose-400" /> },
              { id: "academy", label: "Tech Academies & Coding", icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> },
              { id: "professional", label: "B2B Software & Design", icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" /> },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === c.id
                    ? "bg-[#00F5D4] text-[#06070B] shadow-[0_0_12px_rgba(0,245,212,0.3)]"
                    : "bg-[#0E1326] border border-[#1E2642] text-slate-400 hover:text-white hover:border-slate-500"
                }`}
              >
                {c.icon}
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Filters, Sorting & View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Verified Slots Only Toggle */}
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                verifiedOnly
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                  : "bg-[#0E1326] border-[#1E2642] text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Live Availability</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0E1326] border border-[#1E2642] text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#00F5D4] cursor-pointer"
            >
              <option value="recommended">Sort: AI Best Match</option>
              <option value="distance">Sort: Distance (Nearest)</option>
              <option value="rating">Sort: Rating (Highest)</option>
              <option value="price_asc">Sort: Price (Lowest)</option>
            </select>

            {/* View Mode Toggle (Split, Grid, Map) */}
            <div className="flex items-center bg-[#0B0F22] border border-[#1E2744] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "split"
                    ? "bg-[#00F5D4] text-[#06070B]"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Split View (List + Live Map)"
              >
                <Columns2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#00F5D4] text-[#06070B]"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "map"
                    ? "bg-[#00F5D4] text-[#06070B]"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Full Map View"
              >
                <Map className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Grounding Reasoning Callout */}
      {aiInterpretation && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#11162E] via-[#0E1326] to-[#0A0D1B] border border-[#232F52] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00F5D4] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>CYGNUS AI Geospatial Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-700/40 px-2 py-0.5 rounded font-mono">
                  Grounded with Google Maps
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {aiInterpretation}
            </p>

            {/* Google Maps Links from Grounding Chunks */}
            {groundingLinks.length > 0 && (
              <div className="pt-3 border-t border-[#1C253E] flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Google Maps Grounded Places:</span>
                {groundingLinks.slice(0, 4).map((link, i) => (
                  <a
                    key={i}
                    href={link.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#00F5D4] bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 px-2.5 py-1 rounded-lg border border-[#00F5D4]/30 transition-colors"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Results View according to View Mode */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* VIEW MODE: SPLIT (List + Synchronized Map) */}
        {viewMode === "split" && (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Synchronized Results List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Showing {filteredBusinesses.length} verified listings in {activeCityName}</span>
                <span className="font-mono text-[#00F5D4]">Radius: {radiusKm} km</span>
              </div>

              {filteredBusinesses.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#090D1C] border border-[#1E253E] text-center space-y-3">
                  <MapPin className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">No businesses match your active filters</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try switching city hub (e.g. Nellore for Agriculture or Delhi NCR for Services), or expanding search radius.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setVerifiedOnly(false);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#11172E] border border-[#00F5D4] text-[#00F5D4]"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBusinesses.map((biz) => {
                    const isSelected = biz.id === selectedBusinessId;
                    const isSaved = savedItemIds.includes(biz.id);
                    const isCompared = compareIds.includes(biz.id);

                    return (
                      <div
                        key={biz.id}
                        onClick={() => setSelectedBusinessId(biz.id)}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-4 group ${
                          isSelected
                            ? "bg-[#0F142B] border-[#00F5D4] shadow-[0_0_30px_-5px_rgba(0,245,212,0.25)]"
                            : "bg-[#090D1C] border-[#1D253E] hover:border-slate-500 hover:bg-[#0C1124]"
                        }`}
                      >
                        {/* Thumbnail Photo with Zoom */}
                        <div className="w-full sm:w-44 h-36 sm:h-auto rounded-xl overflow-hidden shrink-0 relative bg-[#070912]">
                          <img
                            src={biz.photos[0]}
                            alt={biz.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#070914]/85 text-[#00F5D4] border border-[#00F5D4]/40 backdrop-blur-md">
                            {biz.distanceKm} km
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="flex-1 flex flex-col justify-between space-y-2.5">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-mono uppercase text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded border border-[#00F5D4]/20">
                                  {biz.category.replace("_", " ")}
                                </span>
                                {biz.availabilityTier === "verified_live" && (
                                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                                    <ShieldCheck className="w-3 h-3" />
                                    Live Availability
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                {/* Compare toggle button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleCompare(biz);
                                  }}
                                  className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                                    isCompared
                                      ? "bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                  title={isCompared ? "In Comparison" : "Add to Comparison"}
                                >
                                  <Scale className="w-3.5 h-3.5" />
                                </button>

                                {/* Save / Bookmark button */}
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
                            </div>

                            <h3 className="text-base font-bold text-white mt-1 leading-snug group-hover:text-[#00F5D4] transition-colors">
                              {biz.name}
                            </h3>

                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                              <span className="truncate">{biz.address}, {biz.city}</span>
                            </p>

                            <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2 mt-1.5">
                              {biz.description}
                            </p>

                            {/* Agriculture Crop Suitability Tags if available */}
                            {biz.cropSuitability && (
                              <div className="pt-1 flex flex-wrap items-center gap-1">
                                <span className="text-[10px] text-slate-400 font-mono">Crop focus:</span>
                                {biz.cropSuitability.map((crop, i) => (
                                  <span key={i} className="text-[10px] bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                                    {crop}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Domain-specific attribute badges */}
                            {biz.specs && biz.specs.length > 0 && (
                              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-cyan-300 font-mono bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded truncate">
                                <span>Processor & RAM: {biz.specs[0].value}</span>
                              </div>
                            )}

                            {biz.staff && biz.staff.length > 0 && (
                              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-rose-300 font-mono bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded truncate">
                                <span>Specialist on Duty: {biz.staff[0].name} ({biz.staff[0].role})</span>
                              </div>
                            )}

                            {biz.technicianStatus === "on_duty_available" && (
                              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-300 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>Certified Plumber On-Duty · Arrival in &lt;{biz.emergencyTurnaroundMinutes || 30} mins</span>
                              </div>
                            )}

                            {biz.warehouseSpecs && (
                              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-blue-300 font-mono bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded truncate">
                                <span>Facility: {biz.warehouseSpecs.totalAreaSqFt.toLocaleString()} sq ft · {biz.warehouseSpecs.clearHeightMeters}m Clear Height · Cold Storage</span>
                              </div>
                            )}

                            {biz.bulkPriceTiers && biz.bulkPriceTiers.length > 0 && (
                              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-amber-300 font-mono bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded truncate">
                                <span>Wholesale MOQ: {biz.bulkPriceTiers[0].minQty} at {biz.bulkPriceTiers[0].pricePerUnit}</span>
                              </div>
                            )}

                            {biz.equipmentList && biz.equipmentList.length > 0 && (
                              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-teal-300 font-mono bg-teal-950/40 border border-teal-800/40 px-2 py-0.5 rounded truncate">
                                <span>Machinery Fleet: {biz.equipmentList[0].name} (₹{biz.equipmentList[0].ratePerHour}/hr with operator)</span>
                              </div>
                            )}
                          </div>

                          {/* Quick Metrics & Action Buttons */}
                          <div className="pt-2.5 border-t border-[#192238] flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-current text-amber-400" />
                                {biz.rating}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                ({biz.reviewCount})
                              </span>
                              <span className="text-slate-600">·</span>
                              <span className="text-xs font-bold text-white font-mono">
                                {biz.priceSample ? `${biz.currency || "₹"}${biz.priceSample.toLocaleString()}` : biz.priceRange}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenProfile(biz);
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white bg-[#101528] border border-[#1E2848] transition-colors cursor-pointer"
                              >
                                Quick View
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenBooking(biz);
                                }}
                                className="px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(0,245,212,0.25)] cursor-pointer"
                              >
                                {getActionLabel(biz.actionType)}
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
                  {activeCityName}
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
                onOpenBookingModal={(biz) => onOpenBooking(biz)}
              />
            </div>
          </div>
        )}

        {/* VIEW MODE: FULL GRID */}
        {viewMode === "grid" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Grid View: {filteredBusinesses.length} verified listings in {activeCityName}</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBusinesses.map((biz) => {
                const isSaved = savedItemIds.includes(biz.id);
                const isCompared = compareIds.includes(biz.id);

                return (
                  <div
                    key={biz.id}
                    onClick={() => onOpenProfile(biz)}
                    className="p-5 rounded-2xl bg-[#090D1C] border border-[#1D253E] hover:border-[#00F5D4]/40 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="h-44 rounded-xl overflow-hidden relative bg-[#070912]">
                        <img
                          src={biz.photos[0]}
                          alt={biz.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#070914]/85 text-[#00F5D4] border border-[#00F5D4]/40 backdrop-blur-md">
                          {biz.distanceKm} km
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCompare(biz);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                              isCompared
                                ? "bg-[#00F5D4] text-[#06070B]"
                                : "bg-black/60 text-white hover:text-[#00F5D4]"
                            }`}
                            title="Compare"
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSave(biz);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                              isSaved
                                ? "bg-[#00F5D4] text-[#06070B]"
                                : "bg-black/60 text-white hover:text-[#00F5D4]"
                            }`}
                            title="Save"
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[10px] font-mono uppercase text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded">
                            {biz.category.replace("_", " ")}
                          </span>
                          <span className="text-amber-400 font-bold flex items-center gap-0.5 font-mono">
                            <Star className="w-3 h-3 fill-current text-amber-400" />
                            {biz.rating} ({biz.reviewCount})
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#00F5D4] transition-colors leading-snug">
                          {biz.name}
                        </h3>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {biz.address}, {biz.city}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
                        {biz.description}
                      </p>

                      {/* Domain-specific attribute badges for Grid View */}
                      {biz.specs && biz.specs.length > 0 && (
                        <div className="text-[10px] text-cyan-300 font-mono bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded truncate">
                          ⚡ {biz.specs[0].value}
                        </div>
                      )}

                      {biz.staff && biz.staff.length > 0 && (
                        <div className="text-[10px] text-rose-300 font-mono bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded truncate">
                          🩺 {biz.staff[0].name} ({biz.staff[0].role})
                        </div>
                      )}

                      {biz.technicianStatus === "on_duty_available" && (
                        <div className="text-[10px] text-emerald-300 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>On-Duty Plumber (&lt;{biz.emergencyTurnaroundMinutes || 30}m arrival)</span>
                        </div>
                      )}

                      {biz.warehouseSpecs && (
                        <div className="text-[10px] text-blue-300 font-mono bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded truncate">
                          🏭 {biz.warehouseSpecs.totalAreaSqFt.toLocaleString()} sq ft · {biz.warehouseSpecs.clearHeightMeters}m Height
                        </div>
                      )}

                      {biz.bulkPriceTiers && biz.bulkPriceTiers.length > 0 && (
                        <div className="text-[10px] text-amber-300 font-mono bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded truncate">
                          📦 {biz.bulkPriceTiers[0].minQty}: {biz.bulkPriceTiers[0].pricePerUnit}
                        </div>
                      )}

                      {biz.cropSuitability && (
                        <div className="text-[10px] text-emerald-300 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded truncate">
                          🌾 Crop focus: {biz.cropSuitability.join(", ")}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#182036] flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white font-mono">
                        {biz.priceSample ? `${biz.currency || "₹"}${biz.priceSample.toLocaleString()}` : biz.priceRange}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBooking(biz);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
                      >
                        {getActionLabel(biz.actionType)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW MODE: FULL MAP */}
        {viewMode === "map" && (
          <div className="space-y-4">
            <LiveMapCanvas
              businesses={filteredBusinesses}
              selectedId={selectedBusinessId}
              onSelectBusiness={(id) => setSelectedBusinessId(id)}
              radiusKm={radiusKm}
              onRadiusChange={(r) => setRadiusKm(r)}
              userCoords={userCoords}
              onLocateMe={onLocateMe}
              isLocating={isLocating}
              className="h-[75vh]"
              onOpenBookingModal={(biz) => onOpenBooking(biz)}
            />
          </div>
        )}
      </section>

      {/* Floating Compare Dock Bar at Bottom of Viewport */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0B0F22]/95 border border-[#00F5D4] rounded-2xl px-5 py-3 shadow-[0_10px_40px_rgba(0,245,212,0.3)] backdrop-blur-xl flex items-center gap-4 animate-fade-up">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00F5D4] text-[#06070B] flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Compare Selected ({compareIds.length}/3)
              </div>
              <div className="text-[10px] text-slate-400">
                Side-by-side pricing, ETA, specs & slots
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#00F5D4] text-[#06070B] hover:brightness-110 transition-all shadow-md"
            >
              Open Comparison
            </button>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        items={comparedEntities}
        onRemoveItem={(id) => setCompareIds((prev) => prev.filter((i) => i !== id))}
        onBookItem={(item) => onOpenBooking(item)}
        onClearAll={() => {
          setCompareIds([]);
          setIsCompareModalOpen(false);
        }}
      />
    </div>
  );
};

export default DiscoveryHomeScreen;
