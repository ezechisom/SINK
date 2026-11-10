import React, { useState, useEffect, useRef } from 'react';
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
import { QuickOrderModal } from './components/QuickOrderModal';
import { CountdownTimer } from './components/CountdownTimer';
import { OrderTracking } from './components/OrderTracking';
import { resolveImageUrl } from './utils/imageHelper';

// Fallback initial config matching the required ₦180,000 price & reference specs
const initialFallbackConfig: PublicConfig = {
  settings: {
    storeName: 'Moonlight Crescent — Smart Security & Locks',
    productName: 'A-01 Deadbolt Type Smart Lock',
    headline: 'SMART ACCESS. SECURE EVERY DAY.',
    subheading: 'Sleek design. Advanced protection. Built for reliability, designed for you. Advanced security meets modern convenience with Contactless Palm Vein Scanning, 3D Face Recognition, 4.0-Inch Interior Screen, and Tuya Smart Remote Control.',
    sellingPrice: 180000,
    whatsappNumber: '+2349136827730',
    supportPhone: '09136827730',
    supportEmail: 'info@moonlightluxuryhometech.shop',
    formspreeEndpoint: 'https://formspree.io/f/xbggbvjg',
    pickupOfficeAddress: 'Block 17 Shop 5 Agric Odunade Market, Lagos, Nigeria',
    videoEmbedUrl: '',
    videoTitle: 'A-01 Deadbolt Smart Lock Operational & Feature Showcase',
    videoDescription: 'Watch 3D Face Recognition Cat-Eye Camera, Semiconductor Biometric Fingerprint, 4.0-Inch Interior IPS Screen, Virtual Passcode, and Tuya App remote unlock in action.',
    pixels: {
      metaPixelId: '947636671276929',
      metaAccessToken: '',
      metaTestEventCode: '',
      tikTokPixelId: 'DBMVHBRC77UASCMH7A20',
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
          answer: 'We deliver nationwide across Nigeria. For Lagos State, orders enjoy direct Doorstep Delivery straight to your home or office 100% FREE. For other states outside Lagos, you can choose 100% FREE Motor Park Delivery to your designated transit terminal (no street address required), or Doorstep Delivery for a ₦5,000 surcharge. Plus, enjoy an instant ₦5,000 discount for every additional lock ordered!'
        },
        {
          question: '6. Can I generate temporary passcodes for guests or cleaners?',
          answer: 'Yes. Via the connected Tuya Smart / Smart Life smartphone app, you can create one-time dynamic passwords or time-restricted PIN codes for guests, domestic staff, or Airbnb tenants without revealing your master master code. You also receive real-time push notifications and full unlock history logs on your phone.'
        },
        {
          question: '7. How do I contact customer support or confirm via WhatsApp?',
          answer: 'Once you submit your order form, you can immediately confirm with your unique order reference directly on WhatsApp with one click, or call our customer line directly at 09136827730.'
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
    { label: 'Access Methods (Multiple Unlocking)', value: 'Contactless Palm Vein, 3D Face Recognition, Semiconductor Fingerprint, Anti-Peep Touch PIN, Smart RFID/NFC Card, Tuya App, Mechanical Key, Combination Unlock' },
    { label: 'Palm Vein Technology', value: 'Near-Infrared Touchless Subcutaneous Vascular Vein Scanner (<0.5s response, 0.0001% FAR, 100% anti-spoofing)' },
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
      url: '/assets/aistudio/Neon_Smart_Lock_Security_Poster_0741352e.png',
      title: 'A-01 Smart Access Master Showcase',
      subtitle: 'Official presentation featuring the ₦180,000 promo price, 3D Face Recognition, and 4.0-inch Interior Screen'
    },
    {
      id: 'img-video-intercom',
      url: '/assets/aistudio/image_d0f1a489.png',
      title: 'Video Intercom & 3D Face Recognition',
      subtitle: 'Active monitoring video intercom, 3D face recognition cat-eye camera, and Tuya Smart Mobile App integration'
    },
    {
      id: 'img-fingerprint-05s',
      url: '/assets/aistudio/image_3e43ad8c.png',
      title: 'Semiconductor Fingerprint 0.5s Unlock',
      subtitle: 'Ultra-fast 0.5-second biometric sensor, 99.99% recognition accuracy, and 0.01% false rejection rate'
    },
    {
      id: 'img-privacy-password',
      url: '/assets/aistudio/image_59eea695.png',
      title: 'Anti-Peep Virtual Privacy Password',
      subtitle: 'Enter random fake PIN digits before or after your real password to protect against shoulder-surfing'
    },
    {
      id: 'img-multi-access-methods',
      url: '/assets/aistudio/image_42d449af.png',
      title: 'Multiple Unlocking Methods & Smart Access',
      subtitle: 'Multiple ways to unlock: Face Recognition, Palm Vein, Semiconductor Fingerprint, Password, NFC Card, Manual Key, Combination & Tuya App'
    },
    {
      id: 'img-parameters-anatomy',
      url: '/assets/aistudio/image_d9b7f963.png',
      title: 'Technical Parameters & Anatomy Architecture',
      subtitle: 'Comprehensive breakdown of front and interior panel components, emergency ports, sensors, and safety handles'
    },
    {
      id: 'img-endurance-battery',
      url: '/assets/aistudio/image_2cf67039.png',
      title: 'Long Endurance Rechargeable Battery & Screen',
      subtitle: 'High-capacity lithium battery lasting 3–5 months per charge with built-in interior color monitor'
    },
    {
      id: 'img-product-package-list',
      url: '/assets/aistudio/image_1fd68c2a.png',
      title: 'Complete Box Hardware Package & Inclusions',
      subtitle: 'Front & rear panels, heavy-duty multi-bolt lock body, 2 keys, 2 magnetic IC cards, USB cable, screws & templates'
    },
    {
      id: 'img-mortise-dimensions',
      url: '/assets/aistudio/image_61bdf854.png',
      title: 'Heavy-Duty Security Mortise Dimensions (24*240)',
      subtitle: 'Industrial-grade multi-bolt stainless steel lock body with 240mm faceplate for standard Nigerian security doors'
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
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [isFillingMainForm, setIsFillingMainForm] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const hasOrderedRef = useRef(false);
  const isAdminOpenRef = useRef(false);
  const isFillingMainFormRef = useRef(false);
  const hasStartedScrollingRef = useRef(false);
  const initialScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retriggerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    hasOrderedRef.current = hasOrdered;
    if (hasOrdered) {
      if (initialScrollTimeoutRef.current) clearTimeout(initialScrollTimeoutRef.current);
      if (retriggerTimeoutRef.current) clearTimeout(retriggerTimeoutRef.current);
      setIsQuickOrderOpen(false);
    }
  }, [hasOrdered]);

  useEffect(() => {
    isAdminOpenRef.current = isAdminOpen;
  }, [isAdminOpen]);

  useEffect(() => {
    isFillingMainFormRef.current = isFillingMainForm;
    if (isFillingMainForm) {
      setIsQuickOrderOpen(false);
    }
  }, [isFillingMainForm]);

  // Function to schedule a re-popup after specified delay (default 100 seconds)
  const scheduleRetrigger = (delayMs = 100000) => {
    if (retriggerTimeoutRef.current) {
      clearTimeout(retriggerTimeoutRef.current);
      retriggerTimeoutRef.current = null;
    }

    if (hasOrderedRef.current) return;

    retriggerTimeoutRef.current = setTimeout(() => {
      if (hasOrderedRef.current) return;

      // Never show popup if customer is currently filling the main form or admin is open
      if (isFillingMainFormRef.current || isAdminOpenRef.current) {
        scheduleRetrigger(15000);
        return;
      }

      setIsQuickOrderOpen(true);
    }, delayMs);
  };

  // User instruction:
  // "LET THE POP UP FORM POP UP ONLY AFTER 60SECS OF THE PERSON SCROLLING ON THE WEBSITE
  // AND GOES OUT AFTER 15SECS IF THE PERSON DOESNT FILL THE FORM
  // THEN IT WILL POP UP AGAIN AFTER 100 SECONDS IF THE PERSON IS STILL ON THE SITE AND HAVENT PLACE AN ORDER"
  useEffect(() => {
    if (hasOrdered) return;

    const handleFirstScroll = () => {
      if (hasStartedScrollingRef.current) return;
      hasStartedScrollingRef.current = true;

      // Starts 60-second timer from the moment person starts scrolling on the website
      initialScrollTimeoutRef.current = setTimeout(() => {
        if (!hasOrderedRef.current && !isAdminOpenRef.current && !isFillingMainFormRef.current) {
          setIsQuickOrderOpen(true);
        } else if (!hasOrderedRef.current) {
          // If customer was filling main form right at the 60s mark, schedule 100s retrigger
          scheduleRetrigger(100000);
        }
      }, 60000);
    };

    window.addEventListener('scroll', handleFirstScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleFirstScroll);
      if (initialScrollTimeoutRef.current) clearTimeout(initialScrollTimeoutRef.current);
      if (retriggerTimeoutRef.current) clearTimeout(retriggerTimeoutRef.current);
    };
  }, [hasOrdered]);

  const handleQuickOrderClose = () => {
    setIsQuickOrderOpen(false);
    // User instruction: "THEN IT WILL POP UP AGAIN AFTER 100 SECONDS IF THE PERSON IS STILL ON THE SITE AND HAVENT PLACE AN ORDER"
    if (!hasOrderedRef.current) {
      scheduleRetrigger(100000);
    }
  };

  // Smooth scroll or modal open for order tracking
  const handleOpenTracking = (orderId?: string) => {
    if (orderId) {
      setActiveTrackingOrderId(orderId);
    }
    const el = document.getElementById('tracking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsTrackingModalOpen(true);
    }
  };

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
    trackEvent('InitiateCheckout', {
      content_name: 'A-01 Deadbolt Type Smart Lock',
      currency: 'NGN',
      value: sellingPrice,
      num_items: 1
    });
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sellingPrice = config.settings.sellingPrice || 180000;
  const heroImage = resolveImageUrl(
    config.galleryImages[0]?.url ||
    '/assets/aistudio/Neon_Smart_Lock_Security_Poster_0741352e.png'
  );

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8fafc] text-[#0f172a] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 14-Day Countdown Urgency Top Banner */}
      <CountdownTimer
        variant="banner"
        price={sellingPrice}
        onOrderClick={scrollToOrderForm}
      />

      {/* 1. Header (Top Bar Contract: 3 zones, single-line links, 1 primary action) */}
      <Header
        price={sellingPrice}
        onOrderClick={scrollToOrderForm}
        onAdminClick={() => setIsAdminOpen(true)}
        onTrackClick={() => handleOpenTracking()}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          price={sellingPrice}
          onOrderClick={scrollToOrderForm}
          heroImage={heroImage}
        />

        {/* 3. Dedicated High-Definition Photo Gallery */}
        <ProductGallery
          images={config.galleryImages}
        />

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
          onFormInteraction={(isInteracting) => {
            setIsFillingMainForm(isInteracting);
            if (isInteracting) {
              setIsQuickOrderOpen(false);
            }
          }}
          onOrderSuccess={(order) => {
            setHasOrdered(true);
            setConfirmedOrder(order);
          }}
        />

        {/* 9. Order Tracking Feature (Local Storage Lookup & Real-Time Status Updates) */}
        <OrderTracking
          initialOrderId={activeTrackingOrderId}
          onOrderClick={scrollToOrderForm}
        />

        {/* 10. FAQ & Trust Section */}
        <FaqAndTrust settings={config.settings} />
      </main>

      {/* 11. Footer */}
      <Footer
        settings={config.settings}
        onAdminClick={() => setIsAdminOpen(true)}
        onTrackClick={() => handleOpenTracking()}
      />

      {/* 12. Floating Verified Reviews Badge */}
      <FloatingReview reviews={config.reviews} />

      {/* 13. Mobile Sticky Purchase Bar (complying with <= 15% viewport height) */}
      <MobileStickyBar
        price={sellingPrice}
        onOrderClick={scrollToOrderForm}
      />

      {/* 14. Order Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          whatsappNumber={config.settings.whatsappNumber}
          onClose={() => setConfirmedOrder(null)}
          onTrackOrder={(orderId) => {
            setActiveTrackingOrderId(orderId);
            handleOpenTracking(orderId);
          }}
        />
      )}

      {/* 15. Quick Order Modal (pops up only after 60s of scrolling, auto-closes in 15s if not filled, re-pops up after 100s) */}
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={handleQuickOrderClose}
        price={sellingPrice}
        nigerianStates={nigerianStates}
        deliveryFees={config.deliveryFees}
        formspreeEndpoint={config.settings.formspreeEndpoint}
        images={config.galleryImages}
        onOrderSuccess={(order) => {
          setHasOrdered(true);
          hasOrderedRef.current = true;
          if (retriggerTimeoutRef.current) clearTimeout(retriggerTimeoutRef.current);
          if (initialScrollTimeoutRef.current) clearTimeout(initialScrollTimeoutRef.current);
          setConfirmedOrder(order);
          setIsQuickOrderOpen(false);
        }}
      />

      {/* 16. Secure Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        publicConfig={config}
        onConfigUpdated={loadConfig}
      />

      {/* 17. Cookie Consent Notice */}
      <CookieBanner />

      {/* 18. Interactive Order Tracking Modal */}
      {isTrackingModalOpen && (
        <OrderTracking
          isOpenAsModal={true}
          initialOrderId={activeTrackingOrderId}
          onCloseModal={() => setIsTrackingModalOpen(false)}
          onOrderClick={() => {
            setIsTrackingModalOpen(false);
            scrollToOrderForm();
          }}
        />
      )}
    </div>
  );
}
