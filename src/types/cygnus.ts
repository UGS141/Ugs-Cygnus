export type BusinessCategory =
  | "restaurant"
  | "product"
  | "salon"
  | "healthcare"
  | "repair"
  | "academy"
  | "hotel";

export type AvailabilityTier =
  | "verified_live" // Real-time verified booking slot available
  | "requires_confirmation" // Appointment / table request submitted to provider
  | "inquiry_only"; // Call or direct message needed

export interface MenuItem {
  name: string;
  price: string;
  description: string;
  isPopular?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  currency: string;
  description: string;
}

export interface StaffSpecialist {
  id: string;
  name: string;
  role: string;
  rating: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface BusinessEntity {
  id: string;
  name: string;
  category: BusinessCategory;
  subcategory: string;
  rating: number;
  reviewCount: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  priceSample?: number;
  currency?: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  isOpen: boolean;
  openingHours: string;
  phone: string;
  website?: string;
  googleMapsUri?: string;
  photos: string[];
  description: string;
  availabilityTier: AvailabilityTier;
  verifiedProvider?: string; // e.g. "ReserveWithGoogle", "OpenTable Live", "ZocDoc API", "Shopify POS"

  // Restaurant specific
  cuisine?: string[];
  availableSlots?: string[];
  menuHighlights?: MenuItem[];

  // Product specific
  brand?: string;
  specs?: ProductSpec[];
  stockStatus?: "in_stock" | "low_stock" | "online_only" | "backorder";
  onlinePrice?: number;
  storePrice?: number;
  sellerType?: "physical_and_online" | "online_only" | "authorized_retailer";

  // Service specific
  services?: ServiceItem[];
  staff?: StaffSpecialist[];
  appointmentSlots?: string[];
  privacyCompliant?: boolean; // for healthcare HIPAA/NABH compliance notice
}

export interface BookingRecord {
  id: string;
  userId: string;
  businessId: string;
  businessName: string;
  category: BusinessCategory;
  serviceOrTable: string;
  date: string;
  time: string;
  partySize?: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  price: number;
  currency: string;
  reference: string;
  notes?: string;
  createdAt: string;
  cancellationPolicy?: string;
}

export interface SavedPlaceItem {
  id: string;
  userId: string;
  itemId: string;
  title: string;
  category: BusinessCategory;
  location: string;
  rating: number;
  priceRange: string;
  createdAt: string;
}

export interface DiscoveryFilterState {
  query: string;
  category: BusinessCategory | "all";
  radiusKm: number;
  priceFilter: string[];
  availabilityOnly: boolean;
  verifiedOnly: boolean;
  date?: string;
  timeSlot?: string;
  partySize?: number;
  userCoords: { lat: number; lng: number };
}
