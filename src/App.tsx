import React, { useState, useEffect } from 'react';
import { PublicConfig, Order } from './types';
import { fetchPublicConfig } from './services/api';
import { initPixels, trackEvent } from './services/tracking';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGallery } from './components/ProductGallery';
import { Benefits } from './components/Benefits';
import { Demonstration } from './components/Demonstration';
import { Specifications } from './components/Specifications';
import { Reviews } from './components/Reviews';
import { OrderForm } from './components/OrderForm';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { FaqAndTrust } from './components/FaqAndTrust';
import { Footer } from './components/Footer';
import { FloatingReview } from './components/FloatingReview';
import { MobileStickyBar } from './components/MobileStickyBar';
import { AdminDashboard } from './components/AdminDashboard';
import { CookieBanner } from './components/CookieBanner';

// Fallback initial config matching the required ₦180,000 price & reference specs
const initialFallbackConfig: PublicConfig = {
  settings: {
    storeName: 'Moonlight Crescent — Smart Security & Locks',
    productName: 'A-01 Deadbolt Type Smart Lock',
    headline: 'SMART ACCESS. SECURE EVERY DAY.',
    subheading: 'Sleek design. Advanced protection. Built for reliability, designed for you. Advanced security meets modern convenience with 3D Face Recognition, 4.0-Inch Interior Screen, and Tuya Smart Remote Control.',
    sellingPrice: 180000,
    whatsappNumber: '+2348147778029',
    supportPhone: '08147778029',
    supportEmail: 'orders@smartlock.ng',
    pickupOfficeAddress: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
    videoEmbedUrl: '',
    videoTitle: 'A-01 Deadbolt Smart Lock Operational & Feature Showcase',
    videoDescription: 'Watch 3D Face Recognition Cat-Eye Camera, Semiconductor Biometric Fingerprint, 4.0-Inch Interior IPS Screen, Virtual Passcode, and Tuya App remote unlock in action.',
    pixels: {
      metaPixelId: '947636671276929',
      tikTokPixelId: 'DB2I7I3C77UA626EHF30',
      googleAnalyticsId: ''
    },
    policyText: {
      privacyPolicy: 'At Moonlight Crescent, customer privacy is paramount. We only collect details necessary for processing your order and fulfilling delivery within Nigeria.',
      termsAndConditions: 'All orders placed are confirmed via call or WhatsApp before dispatch. Payment on delivery is available nationwide across Nigeria upon package inspection.',
      returnsPolicy: '1-Year Comprehensive Warranty plus 7-day inspection and exchange period upon delivery. Items must remain in original protective packaging.',
      faqText: [
        {
          question: '1. What is the A-01 Deadbolt Type Smart Lock?',
          answer: 'The A-01 is a premium deadbolt type smart door lock featuring 6-in-1 multi-access: 3D Face Recognition via an infrared cat-eye camera, 4.0-inch interior HD IPS color display screen, 0.3s semiconductor biometric fingerprint, anti-peep capacitive touch passcode, RFID IC smart card swipe, mobile app remote control via Tuya/Smart Life, and physical emergency mechanical keys.'
        },
        {
          question: '2. How does the 3D Face Recognition & 4.0-inch Interior Screen work?',
          answer: 'The exterior unit is equipped with a high-precision 3D infrared cat-eye camera that recognizes authorized faces in under 0.5 seconds, even in pitch-black night conditions or with hats and glasses. When someone approaches or rings the built-in doorbell, the interior 4.0-inch high-definition screen lights up instantly so you can see exactly who is outside before opening the door.'
        },
        {
          question: '3. What happens if the battery runs down completely?',
          answer: 'The lock is equipped with dual emergency fail-safes. First, there is an external Type-C USB emergency power interface at the bottom that you can power instantly using any mobile power bank. Second, 2 high-security laser-cut mechanical override keys are included to unlock the door manually at any time. The high-capacity rechargeable lithium battery lasts 6 to 8 months per charge and alerts you well in advance when battery drops below 20%.'
        },
        {
          question: '4. Will it fit my door? (Installation & Compatibility)',
          answer: 'Yes! The A-01 Deadbolt Smart Lock is engineered to fit standard Nigerian residential and commercial doors with thicknesses between 40mm and 100mm. It works seamlessly on modern wooden doors, armored security doors, steel doors, stainless steel doors, and composite doors. Full mounting hardware, strike plate, and installation template are included.'
        },
        {
          question: '5. How does delivery work across Nigeria?',
          answer: 'We deliver nationwide across all 36 states and the FCT. Base delivery is FREE nationwide! If you choose Motor Park Delivery, it is 100% FREE and requires no street address — simply pick your preferred transit terminal. In Lagos State, Doorstep Delivery is completely FREE (no extra fee). In other states, Doorstep Delivery attracts an extra fee of ₦5,000. Plus, enjoy an instant ₦5,000 discount for every additional lock ordered!'
        },
        {
          question: '6. Can I generate temporary passcodes for guests or cleaners?',
          answer: 'Yes. Via the connected Tuya Smart / Smart Life smartphone app, you can create one-time dynamic passwords or time-restricted PIN codes for guests, domestic staff, or Airbnb tenants without revealing your master master code. You also receive real-time push notifications and full unlock history logs on your phone.'
        },
        {
          question: '7. How do I contact customer support or confirm via WhatsApp?',
          answer: 'Once you submit your order form, you can immediately confirm with your unique order reference directly on WhatsApp with one click, or call our customer line directly at 08147778029.'
        }
      ]
    }
  },
  deliveryFees: {
    'Lagos': 0,
    'Federal Capital Territory (Abuja)': 5000,
    'Rivers': 5000,
    'Ogun': 5000,
    'Oyo': 5000,
    'Delta': 5000,
    'Edo': 5000,
    'Anambra': 5000,
    'Enugu': 5000,
    'Kano': 5000,
    'Kaduna': 5000
  },
  specifications: [
    { label: 'Model & Type', value: 'A-01 Deadbolt Type Smart Lock (Front & Rear Panels)' },
    { label: 'Access Methods (6-in-1)', value: '3D Face Recognition, Semiconductor Fingerprint, Anti-Peep Touch PIN, Smart RFID Card, Tuya App, Mechanical Key' },
    { label: 'Face Recognition Technology', value: '3D Infrared Cat-Eye Camera with Biometric Depth Sensor (Works in dark night, anti-photo spoofing, <0.5s)' },
    { label: 'Interior Screen', value: '4.0-Inch High-Definition IPS Color Screen (Instant video display of visitors outside)' },
    { label: 'Fingerprint Recognition', value: '0.3-Second Semiconductor Biometric Sensor with 360° Angle Reading (Stores up to 100 fingerprints)' },
    { label: 'Smart Mobile App', value: 'Tuya Smart / Smart Life (Remote Unlock, Temporary Guest Passwords, Real-Time Access History Logs)' },
    { label: 'Doorbell Function', value: 'Integrated One-Click Exterior Smart Chime Doorbell + Indoor Chime & Mobile App Push Alert' },
    { label: 'Physical Security & Handles', value: 'Heavy-Duty Stainless Steel Deadbolt Mortise + Ergonomic Quick-Open Handle + Internal Anti-Lock Knob' },
    { label: 'Materials & Build', value: 'Reinforced High-Tensile Aerospace Aluminum Alloy & Zinc Alloy Chassis (Anti-Drill, Anti-Prying)' },
    { label: 'Power & Battery Life', value: 'Rechargeable High-Capacity Lithium Battery Pack (6–8 Months runtime per charge + Low Battery Warning)' },
    { label: 'Emergency Power & Backup', value: 'External Type-C USB Port for Power Bank Jumpstart + 2x Laser-Cut Physical Emergency Override Keys' },
    { label: 'Door Thickness Compatibility', value: 'Universal fit for doors 40 mm – 100 mm thick (Wooden, Security Armored, Steel, Stainless Steel, Composite)' },
    { label: 'Warranty & Support', value: '1-Year Comprehensive Replacement Warranty + Nationwide Payment on Delivery' }
  ],
  includedItems: [
    'A-01 Smart Lock Exterior Front Panel with 3D Face Recognition Camera, Keypad & Fingerprint Sensor',
    'A-01 Smart Lock Interior Rear Panel with 4.0-Inch HD IPS Color Screen & Quick-Open Handle',
    'Heavy-Duty Multi-Bolt Stainless Steel Security Mortise Lock Body & Cylinder',
    'High-Capacity Rechargeable Lithium Battery Pack',
    'Fast Type-C USB Battery Charging Cable',
    '2 × High-Security Encrypted RFID Smart IC Cards',
    '2 × Precision Laser-Cut Mechanical Emergency Override Keys',
    'Heavy-Duty Stainless Steel Strike Plate & Complete Screw Mounting Hardware Kit',
    'Detailed English User Guide & Door Cutout Template'
  ],
  galleryImages: [
    {
      id: 'img-master-poster',
      url: '/public/assets/aistudio/Neon_Smart_Lock_Security_Poster_0741352e.png',
      title: 'A-01 Deadbolt Smart Lock Official Showcase',
      subtitle: 'Complete front and interior panel display with 3D Face Recognition, 4.0-inch screen, and Tuya Smart connectivity'
    },
    {
      id: 'img-door-installed',
      url: '/images/smart_lock_door_1793893094297.jpg',
      title: 'Luxury Apartment Door Installation',
      subtitle: 'Sleek black finish with illuminated numeric touch keypad, round face camera, and deadbolt handle'
    },
    {
      id: 'img-interior-screen',
      url: '/images/smart_lock_screen_1793893110263.jpg',
      title: '4.0-Inch Interior HD Color Screen',
      subtitle: 'See live video of visitors outside, quick-open safety handle, and mechanical anti-lock knob'
    },
    {
      id: 'img-face-scan',
      url: '/images/smart_lock_face_scan_1793893126016.jpg',
      title: 'Instant 3D Infrared Face Recognition',
      subtitle: 'Hands-free biometric unlocking in under 0.5 seconds with advanced infrared cat-eye camera'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      name: 'Arc. Femi Adeyemi',
      location: 'Ikoyi, Lagos',
      rating: 5,
      date: '2026-10-24',
      comment: 'Installed this A-01 smart lock on our main apartment entrance door in Ikoyi. The 3D face recognition is instantaneous—as soon as I walk up to the door it unlocks without touching anything. The interior 4-inch screen is a huge blessing for the family.',
      verified: true
    },
    {
      id: 'rev-2',
      name: 'Barrister Chidinma Okonkwo',
      location: 'Maitama, Abuja',
      rating: 5,
      date: '2026-10-29',
      comment: 'Delivery to Abuja was super fast via Utako transit terminal. Solid build quality, heavy-duty deadbolt. The Tuya app lets me generate temporary codes for my cleaners when I am in court. 100% worth the ₦180,000 investment.',
      verified: true
    },
    {
      id: 'rev-3',
      name: 'Engr. Kenneth Nwachukwu',
      location: 'Peter Odili Road, Port Harcourt',
      rating: 5,
      date: '2026-11-01',
      comment: 'Ordered 2 locks with the multi-item discount for my duplex in PH. The semiconductor fingerprint sensor never fails, even with wet hands. Very reassuring to have the Type-C emergency port and manual keys just in case.',
      verified: true
    },
    {
      id: 'rev-4',
      name: 'Alhaji Ibrahim Danladi',
      location: 'Bodija, Ibadan',
      rating: 5,
      date: '2026-11-03',
      comment: 'Top notch security. The loud doorbell chime and the interior screen make it so safe for my children at home. Excellent customer support when placing the order.',
      verified: true
    }
  ]
};

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Federal Capital Territory (Abuja)',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export default function App() {
  const [config, setConfig] = useState<PublicConfig>(initialFallbackConfig);
  const [nigerianStates, setNigerianStates] = useState<string[]>(NIGERIAN_STATES);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const loadConfig = async () => {
    try {
      const data = await fetchPublicConfig();
      setConfig(data);
      if ((data as any).nigerianStates) {
        setNigerianStates((data as any).nigerianStates);
      }
      initPixels(data.settings.pixels);
      trackEvent('ViewContent', {
        content_name: data.settings.productName,
        value: data.settings.sellingPrice,
        currency: 'NGN'
      });
    } catch (err) {
      console.warn('Using local fallback configuration:', err);
    }
  };

  useEffect(() => {
    loadConfig();
    trackEvent('PageView');
  }, []);

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sellingPrice = config.settings.sellingPrice || 180000;
  const heroImage =
    config.galleryImages[0]?.url ||
    '/public/assets/aistudio/Neon_Smart_Lock_Security_Poster_0741352e.png';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. Header (Top Bar Contract: 3 zones, single-line links, 1 primary action) */}
      <Header
        price={sellingPrice}
        onOrderClick={scrollToOrderForm}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          price={sellingPrice}
          onOrderClick={scrollToOrderForm}
          heroImage={heroImage}
        />

        {/* 3. Product Gallery */}
        <ProductGallery images={config.galleryImages} />

        {/* 4. Product Benefits Section */}
        <Benefits />

        {/* 5. Product Demonstration Section */}
        <Demonstration
          videoEmbedUrl={config.settings.videoEmbedUrl}
          videoTitle={config.settings.videoTitle}
          videoDescription={config.settings.videoDescription}
          price={sellingPrice}
          onOrderClick={scrollToOrderForm}
          posterImage={config.galleryImages[1]?.url || heroImage}
        />

        {/* 6. Product Details & Technical Specifications */}
        <Specifications
          price={sellingPrice}
          specifications={config.specifications}
          includedItems={config.includedItems}
        />

        {/* 7. Customer Reviews */}
        <Reviews reviews={config.reviews} />

        {/* 8. Conversion-Focused Order Form & Checkout */}
        <OrderForm
          price={sellingPrice}
          deliveryFees={config.deliveryFees}
          nigerianStates={nigerianStates}
          onOrderSuccess={(order) => setConfirmedOrder(order)}
        />

        {/* 9. FAQ & Trust Section */}
        <FaqAndTrust settings={config.settings} />
      </main>

      {/* 10. Footer */}
      <Footer
        settings={config.settings}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* 11. Floating Verified Reviews Badge */}
      <FloatingReview reviews={config.reviews} />

      {/* 12. Mobile Sticky Purchase Bar (complying with <= 15% viewport height) */}
      <MobileStickyBar
        price={sellingPrice}
        onOrderClick={scrollToOrderForm}
      />

      {/* 13. Order Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          whatsappNumber={config.settings.whatsappNumber}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      {/* 14. Secure Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        publicConfig={config}
        onConfigUpdated={loadConfig}
      />

      {/* 15. Cookie Consent Notice */}
      <CookieBanner />
    </div>
  );
}
