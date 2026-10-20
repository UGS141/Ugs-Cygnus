export type BusinessCategory =
  | "agriculture"
  | "home_services"
  | "restaurant"
  | "product"
  | "salon"
  | "healthcare"
  | "repair"
  | "academy"
  | "hotel"
  | "construction"
  | "automotive"
  | "professional"
  | "industrial_b2b";

export type AvailabilityTier =
  | "verified_live" // Real-time verified booking slot or inventory available
  | "requires_confirmation" // Appointment / quote / table request submitted to provider
  | "inquiry_only"; // Call or direct message needed

export type ActionType =
  | "reserve_table"       // Restaurant
  | "buy_product"         // Retail products & hardware
  | "book_appointment"    // Healthcare, Dental, Salon, Wellness
  | "request_service"     // Plumbers, Electricians, Appliance Repair
  | "request_quotation"   // Agriculture, Construction, Wholesale B2B
  | "rent_equipment"      // Tractors, Harvesters, Heavy Machinery
  | "enroll_course"       // Academies, Tech Institutes
  | "schedule_site_visit" // Real estate, Commercial Warehouses
  | "contact_supplier";   // B2B & General enquiries

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

export interface EquipmentRentalItem {
  id: string;
  name: string;
  model: string;
  ratePerHour: number;
  ratePerDay: number;
  operatorIncluded: boolean;
  minHours: number;
  availableNow: boolean;
}

export interface DataFreshnessInfo {
  lastVerifiedAt: string;
  source: string;
  isDynamicLive: boolean;
  refreshIntervalMinutes?: number;
}

export interface BusinessEntity {
  id: string;
  name: string;
  category: BusinessCategory;
  subcategory: string;
  actionType: ActionType;
  rating: number;
  reviewCount: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  priceSample?: number;
  currency?: string;
  address: string;
  city: string;
  state?: string;
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
  verifiedProvider?: string;

  // Real-time map & data freshness metadata
  dataFreshness?: DataFreshnessInfo;

  // Agriculture specific
  cropSuitability?: string[];
  productSafetyLabel?: string;
  equipmentList?: EquipmentRentalItem[];
  wholesaleMOQ?: string;

  // Home service specific
  technicianStatus?: "on_duty_available" | "busy_next_at_3pm" | "scheduled_only";
  serviceAreaRadiusKm?: number;
  emergencyTurnaroundMinutes?: number;

  // Construction & Industrial specific
  warehouseSpecs?: {
    totalAreaSqFt: number;
    clearHeightMeters: number;
    powerLoadKva: number;
    dockDoors: number;
    coldStorageAvailable: boolean;
  };
  bulkPriceTiers?: { minQty: string; pricePerUnit: string }[];

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
  privacyCompliant?: boolean;
}

export interface BookingRecord {
  id: string;
  userId: string;
  businessId: string;
  businessName: string;
  category: BusinessCategory;
  actionType: ActionType;
  serviceOrTable: string;
  date: string;
  time: string;
  partySize?: number;
  quantity?: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  price: number;
  currency: string;
  reference: string;
  notes?: string;
  createdAt: string;
  cancellationPolicy?: string;
  fulfillmentDetails?: {
    type?: string;
    address?: string;
    urgency?: string;
    operatorNeeded?: boolean;
  };
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
  travelMode: "driving" | "walking" | "transit";
}
