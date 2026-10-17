export interface Order {
  id: string; // e.g. MC-83921
  createdAt: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  state: string;
  city: string;
  deliveryAddress: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  deliveryFee: number | null; // null if pending confirmation
  total: number;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Payment on Delivery' | 'Bank Transfer on Delivery';
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verified: boolean;
  photoUrl?: string;
}

export interface SpecificationItem {
  label: string;
  value: string;
}

export interface StoreSettings {
  storeName: string;
  productName: string;
  headline: string;
  subheading: string;
  sellingPrice: number;
  whatsappNumber: string; // international format e.g. +2348012345678
  supportPhone: string;
  supportEmail: string;
  pickupOfficeAddress: string;
  videoEmbedUrl: string; // can be YouTube, Vimeo, direct MP4 or fallback interactive demo
  videoTitle: string;
  videoDescription: string;
  pixels: {
    metaPixelId: string;
    tikTokPixelId: string;
    googleAnalyticsId: string;
  };
  policyText: {
    privacyPolicy: string;
    termsAndConditions: string;
    returnsPolicy: string;
    faqText: { question: string; answer: string }[];
  };
}

export interface DeliveryFeesMap {
  [stateName: string]: number | null; // null means "Delivery fee to be confirmed"
}

export interface PublicConfig {
  settings: StoreSettings;
  deliveryFees: DeliveryFeesMap;
  reviews: CustomerReview[];
  specifications: SpecificationItem[];
  includedItems: string[];
  galleryImages: {
    id: string;
    url: string;
    title: string;
    subtitle: string;
  }[];
  nigerianStates?: string[];
}
