import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(express.json());

// Serve static images directly from public/images, public/assets, and public
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default configuration & database
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Federal Capital Territory (Abuja)',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const defaultDeliveryFees: Record<string, number | null> = {
  'Lagos': 5000,
  'Ogun': 6500,
  'Oyo': 7000,
  'Ondo': 7500,
  'Osun': 7500,
  'Ekiti': 8000,
  'Federal Capital Territory (Abuja)': 8000,
  'Rivers': 8500,
  'Delta': 8500,
  'Edo': 8000,
  'Anambra': 8500,
  'Enugu': 8500,
  'Imo': 8500,
  'Abia': 8500,
  'Akwa Ibom': 9000,
  'Cross River': 9000,
  'Bayelsa': 9000,
  'Ebonyi': 9000,
  'Kano': 10000,
  'Kaduna': 9500,
  'Kwara': 8000,
  'Kogi': 8500,
  'Niger': 9000,
  'Plateau': 9500,
  'Nasarawa': 9000,
  'Benue': 9500,
  'Bauchi': 11000,
  'Gombe': 11000,
  'Adamawa': 12000,
  'Taraba': 12000,
  'Borno': 13000,
  'Yobe': 13000,
  'Jigawa': 11000,
  'Katsina': 11000,
  'Kebbi': 12000,
  'Sokoto': 12000,
  'Zamfara': 12000,
};

const initialData = {
  adminPassword: process.env.ADMIN_PASSWORD || 'moonlight2026',
  settings: {
    storeName: 'Smart Kitchen Store',
    productName: 'Smart Kitchen Piano Sink (75 × 45 cm)',
    headline: 'UPGRADE YOUR KITCHEN WITH THE PREMIUM SMART PIANO SINK',
    subheading: 'Experience a smarter, more elegant kitchen with a beautifully designed multifunctional workstation sink that combines modern style with everyday convenience.',
    sellingPrice: 135000,
    whatsappNumber: '+2349136827730',
    supportPhone: '09136827730',
    supportEmail: 'orders@smartkitchensink.ng',
    pickupOfficeAddress: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
    videoEmbedUrl: '', // Admin can set YouTube/Vimeo embed or video link
    videoTitle: 'Smart Piano Kitchen Sink Operational Showcase',
    videoDescription: 'Watch the 4-mode piano keys, flying rain waterfall flow, high-pressure glass rinser, and hydroelectric LED temperature display in action.',
    pixels: {
      metaPixelId: '947636671276929',
      tikTokPixelId: 'DBMVHBRC77UASCMH7A20',
      googleAnalyticsId: ''
    },
    policyText: {
      privacyPolicy: 'At Smart Kitchen Store, customer privacy is paramount. We only collect details necessary for processing your order and fulfilling delivery within Nigeria.',
      termsAndConditions: 'All orders placed are confirmed via call or WhatsApp before dispatch. Payment on delivery is available in eligible zones upon package inspection.',
      returnsPolicy: '7-day inspection and exchange period upon delivery. Items must remain unused in original protective packaging. Includes 1-Year Manufacturer Warranty.',
      faqText: [
        {
          question: '1. What is the Smart Kitchen Piano Sink (75 × 45 cm)?',
          answer: 'It is a premium multifunctional culinary workstation featuring 4 tactile piano keys for water modes, flying rain waterfall spout, high-pressure glass rinser, internal hydroelectric LED temperature screen, and sliding cutting board ledges.'
        },
        {
          question: '2. How does the digital temperature display work without batteries?',
          answer: 'The LED display and ambient glow are powered 100% by internal hydroelectric water hydraulics. As water flows through the faucet, it generates power automatically. Zero batteries, wiring, or electrical connections required.'
        },
        {
          question: '3. What dimensions and countertop cutout are required?',
          answer: 'The sink measures 750 mm × 450 mm (75 × 45 cm) with a generous 205 mm deep basin. It fits standard Nigerian 700 × 400 mm countertop cutouts and supports topmount (drop-in), undermount, or flushmount installation.'
        },
        {
          question: '4. What is included in the complete box package?',
          answer: 'Every package contains the SUS304 Nano Piano Sink basin, Integrated Waterfall Faucet Tower with 360° pull-out sprayer, Solid Wood Chopping Board, Stainless Steel Perforated Washing Colander, Triangular Prep Basin, Automatic Glass Rinser, Soap Dispenser, and heavy-duty anti-odor drainage pipe assembly with standard 1/2" flexible hoses.'
        },
        {
          question: '5. How does delivery work across Nigeria?',
          answer: 'We deliver nationwide across all 36 states and the FCT. For Lagos State, doorstep delivery is ₦5,000 and takes 1–2 business days. For other states, delivery takes 3–5 business days to your major commercial park terminal or direct doorstep.'
        },
        {
          question: '6. Which payment methods are available?',
          answer: 'We support Payment on Delivery (Cash or Bank Transfer upon inspecting the sink) across major cities in Nigeria.'
        },
        {
          question: '7. How do I contact customer support or confirm via WhatsApp?',
          answer: 'Once you submit your order form, you can immediately confirm with your unique order reference directly on WhatsApp with one click, or call our desk at 09136827730.'
        }
      ]
    }
  },
  deliveryFees: defaultDeliveryFees,
  specifications: [
    { label: 'Outer Dimensions', value: '750 mm (L) × 450 mm (W) × 205 mm (Basin Depth) [75 × 45 cm]' },
    { label: 'Countertop Cutout', value: '700 × 400 mm (Fits standard 750 × 450 mm counter fit)' },
    { label: 'Material & Construction', value: 'Commercial SUS304 Honeycomb Nano Anti-Scratch Stainless Steel' },
    { label: 'Surface Finish', value: 'High-Density Nano PVD Titanium Grey (Oil & Scratch Resistant)' },
    { label: 'Water Controls (4 Piano Keys)', value: 'Flying Rain Waterfall, 360° Pull-Out Sprayer, Glass Rinser, Drinking Tap' },
    { label: 'LED Temperature Console', value: 'Hydroelectric Self-Powered Display (°C) & Ambient Flow Glow' },
    { label: 'Automatic Glass Rinser', value: '5-Jet Inverted High-Pressure Cup Washer (Cleans in 2 Seconds)' },
    { label: 'Workstation Ledge System', value: 'Double-Track Sliding Ledges for Chopping Board & Colander' },
    { label: 'Plumbing & Fittings', value: 'Standard Nigerian 1/2" Hot & Cold Inlets + Anti-Odor Siphon Trap' },
    { label: 'Warranty & Guarantee', value: '1-Year Manufacturer Warranty + 7-Day Inspection/Exchange Period' }
  ],
  includedItems: [
    'Smart Piano Workstation Basin (750 × 450 mm)',
    'Waterfall & 3-Mode Pull-Out Spray Faucet Tower',
    'Custom Solid Walnut Prep Cutting Board',
    'Stainless Steel Perforated Washing Colander',
    'Inner Triangular Prep Washing Basin',
    'High-Pressure Glass Cup Rinser & Connector',
    'Matte Finish Soap Dispenser',
    'Complete Multi-Layer Anti-Odor Drainage Waste Pipe Set',
    'Hot & Cold Stainless Steel Flexible Braided Hoses'
  ],
  galleryImages: [
    {
      id: 'img-master-poster',
      url: '/public/assets/aistudio/Neon_Smart_Lock_Security_Poster_0741352e.png',
      title: 'A-01 Smart Access Master Showcase',
      subtitle: 'Official presentation featuring the ₦180,000 promo price, 3D Face Recognition, and 4.0-inch Interior Screen'
    },
    {
      id: 'img-video-intercom',
      url: '/public/assets/aistudio/image_d0f1a489.png',
      title: 'Video Intercom & 3D Face Recognition',
      subtitle: 'Active monitoring video intercom, 3D face recognition cat-eye camera, and Tuya Smart Mobile App integration'
    },
    {
      id: 'img-fingerprint-05s',
      url: '/public/assets/aistudio/image_3e43ad8c.png',
      title: 'Semiconductor Fingerprint 0.5s Unlock',
      subtitle: 'Ultra-fast 0.5-second biometric sensor, 99.99% recognition accuracy, and 0.01% false rejection rate'
    },
    {
      id: 'img-privacy-password',
      url: '/public/assets/aistudio/image_59eea695.png',
      title: 'Anti-Peep Virtual Privacy Password',
      subtitle: 'Enter random fake PIN digits before or after your real password to protect against shoulder-surfing'
    },
    {
      id: 'img-multi-access-methods',
      url: '/public/assets/aistudio/image_aa3a96c0.png',
      title: '6-in-1 Multi-Access Smart Unlocking',
      subtitle: 'Unlock via 3D Face, Biometric Fingerprint, Encrypted IC Card, Virtual Password, Mechanical Key, or Phone App'
    },
    {
      id: 'img-parameters-anatomy',
      url: '/public/assets/aistudio/image_d9b7f963.png',
      title: 'Technical Parameters & Anatomy Architecture',
      subtitle: 'Comprehensive breakdown of front and interior panel components, emergency ports, sensors, and safety handles'
    },
    {
      id: 'img-endurance-battery',
      url: '/public/assets/aistudio/image_2cf67039.png',
      title: 'Long Endurance Rechargeable Battery & Screen',
      subtitle: 'High-capacity lithium battery lasting 3–5 months per charge with built-in interior color monitor'
    },
    {
      id: 'img-product-package-list',
      url: '/public/assets/aistudio/image_1fd68c2a.png',
      title: 'Complete Box Hardware Package & Inclusions',
      subtitle: 'Front & rear panels, heavy-duty multi-bolt lock body, 2 keys, 2 magnetic IC cards, USB cable, screws & templates'
    },
    {
      id: 'img-mortise-dimensions',
      url: '/public/assets/aistudio/image_61bdf854.png',
      title: 'Heavy-Duty Security Mortise Dimensions (24*240)',
      subtitle: 'Industrial-grade multi-bolt stainless steel lock body with 240mm faceplate for standard Nigerian security doors'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      name: 'Arc. Emeka Okafor',
      location: 'Lekki Phase 1, Lagos',
      rating: 5,
      date: '2026-09-28',
      comment: 'Installed this in our newly remodeled kitchen in Lekki. The waterfall faucet and the piano switch keys feel like a million bucks. Water pressure from the glass rinser is fantastic and the nano finish cleans easily.',
      verified: true
    },
    {
      id: 'rev-2',
      name: 'Hajiya Aisha Mohammed',
      location: 'Gwarinpa Estate, Abuja',
      rating: 5,
      date: '2026-10-02',
      comment: 'Delivered promptly to Abuja within 3 days. Our plumber had zero issues with the standard fittings. The digital temperature display helps so much when preparing hot water for baby bottles and rinsing oily pots.',
      verified: true
    },
    {
      id: 'rev-3',
      name: 'Engr. Tunde Adeleke',
      location: 'Ikeja GRA, Lagos',
      rating: 5,
      date: '2026-10-09',
      comment: 'Very thick and solid 304 stainless steel. The wooden cutting board and colander fit right onto the inner tracks, turning the sink into a full prep station. Worth every kobo of the ₦135,000.',
      verified: true
    },
    {
      id: 'rev-4',
      name: 'Dr. (Mrs) Nkechi Wilcox',
      location: 'Old GRA, Port Harcourt',
      rating: 5,
      date: '2026-10-12',
      comment: 'Ordered 2 units for our duplex in Port Harcourt. Excellent communication from the Moonlight Crescent team and the piano keys have such a smooth, high-grade mechanical feel.',
      verified: true
    }
  ],
  orders: [] as any[]
};

// Database helper functions
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return data;
  } catch (err) {
    console.error('Error reading db:', err);
    return initialData;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Ensure database file exists on startup
readDb();

// Active admin sessions in memory
const activeSessions = new Set<string>();

// Middleware for admin auth
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeSessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
  next();
}

// Meta Conversions API (CAPI) helper functions
function sha256Hash(val: string): string {
  return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

interface MetaCapiParams {
  eventName: string;
  eventId?: string;
  customData?: any;
  userDataInput?: any;
  req: Request;
  testEventCodeOverride?: string;
  sourceUrlOverride?: string;
}

async function sendMetaCapiGeneric({
  eventName,
  eventId,
  customData,
  userDataInput = {},
  req,
  testEventCodeOverride,
  sourceUrlOverride
}: MetaCapiParams) {
  try {
    const db = readDb();
    const pixelId = db.settings?.pixels?.metaPixelId || '947636671276929';
    const accessToken = db.settings?.pixels?.metaAccessToken || process.env.META_ACCESS_TOKEN;
    const testEventCode = testEventCodeOverride || db.settings?.pixels?.metaTestEventCode || process.env.META_TEST_EVENT_CODE;

    const cookies = ((req.headers.cookie as string) || '').split(';').reduce((acc: Record<string, string>, c: string) => {
      const [k, v] = c.trim().split('=');
      if (k && v) acc[k] = v;
      return acc;
    }, {});

    const clientIp = ((req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Mozilla/5.0';
    const eventSourceUrl = sourceUrlOverride || (req.headers.referer as string) || (req.headers.origin as string) || 'https://ais-pre-esmhdnz2qbrgb3hajpuwbr-656280234555.europe-west1.run.app';

    const formattedUserData: Record<string, any> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent
    };

    if (userDataInput.phone) {
      let cleanPhone = String(userDataInput.phone).replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '234' + cleanPhone.slice(1);
      else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) cleanPhone = '234' + cleanPhone;
      formattedUserData.ph = [sha256Hash(cleanPhone)];
    }

    if (userDataInput.fullName) {
      const parts = String(userDataInput.fullName).trim().split(/\s+/);
      if (parts[0]) formattedUserData.fn = [sha256Hash(parts[0])];
      if (parts.length > 1) formattedUserData.ln = [sha256Hash(parts.slice(1).join(' '))];
    } else {
      if (userDataInput.firstName) formattedUserData.fn = [sha256Hash(userDataInput.firstName)];
      if (userDataInput.lastName) formattedUserData.ln = [sha256Hash(userDataInput.lastName)];
    }

    if (userDataInput.email) formattedUserData.em = [sha256Hash(userDataInput.email)];
    if (userDataInput.state) formattedUserData.st = [sha256Hash(userDataInput.state)];
    if (userDataInput.city) formattedUserData.ct = [sha256Hash(userDataInput.city)];
    formattedUserData.country = [sha256Hash('ng')];

    if (cookies._fbp) formattedUserData.fbp = cookies._fbp;
    if (cookies._fbc) formattedUserData.fbc = cookies._fbc;

    const finalEventId = eventId || `${eventName.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const eventPayload: any = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: finalEventId,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: formattedUserData,
      custom_data: {
        currency: 'NGN',
        value: customData?.value || 180000,
        content_name: customData?.content_name || 'A-01 Deadbolt Type Smart Lock',
        content_type: 'product',
        ...(customData || {})
      }
    };

    const payload: any = {
      data: [eventPayload]
    };

    if (testEventCode && testEventCode.trim()) {
      payload.test_event_code = testEventCode.trim();
    }

    if (accessToken && accessToken.trim()) {
      const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log(`[Meta CAPI] Dispatched ${eventName} (${finalEventId}) for Pixel ${pixelId}:`, data);
      return { success: true, mode: 'graph_api', pixelId, eventId: finalEventId, result: data };
    } else {
      console.log(`[Meta CAPI] Event ${eventName} queued for Pixel ${pixelId} (Browser Pixel 947636671276929 active with matching eventID: ${finalEventId})`);
      return { status: 'queued', pixelId, eventId: finalEventId, payload };
    }
  } catch (err: any) {
    console.error('[Meta CAPI Error]:', err);
    return { success: false, error: err.message };
  }
}

async function sendMetaConversionsApi(order: any, req: Request) {
  try {
    const db = readDb();
    const pixelId = db.settings?.pixels?.metaPixelId || '947636671276929';
    const accessToken = db.settings?.pixels?.metaAccessToken || process.env.META_ACCESS_TOKEN;
    const testEventCode = db.settings?.pixels?.metaTestEventCode || process.env.META_TEST_EVENT_CODE;

    let cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }

    const nameParts = (order.fullName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const cookies = ((req.headers.cookie as string) || '').split(';').reduce((acc: Record<string, string>, c: string) => {
      const [k, v] = c.trim().split('=');
      if (k && v) acc[k] = v;
      return acc;
    }, {});

    const clientIp = ((req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()) || req.socket.remoteAddress || '';
    const userAgent = (req.headers['user-agent'] as string) || '';
    const eventSourceUrl = (req.headers.referer as string) || (req.headers.origin as string) || 'https://ais-pre-esmhdnz2qbrgb3hajpuwbr-656280234555.europe-west1.run.app';

    const userData: Record<string, any> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent
    };

    if (cleanPhone) userData.ph = [sha256Hash(cleanPhone)];
    if (firstName) userData.fn = [sha256Hash(firstName)];
    if (lastName) userData.ln = [sha256Hash(lastName)];
    if (order.state) userData.st = [sha256Hash(order.state)];
    userData.country = [sha256Hash('ng')];
    if (cookies._fbp) userData.fbp = cookies._fbp;
    if (cookies._fbc) userData.fbc = cookies._fbc;

    const payload: any = {
      data: [
        {
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: order.id, // deduplicated with browser fbq
          event_source_url: eventSourceUrl,
          action_source: 'website',
          user_data: userData,
          custom_data: {
            currency: 'NGN',
            value: order.total,
            content_name: 'A-01 Deadbolt Type Smart Lock',
            content_type: 'product',
            num_items: order.quantity,
            order_id: order.id
          }
        },
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: `lead-${order.id}`,
          event_source_url: eventSourceUrl,
          action_source: 'website',
          user_data: userData,
          custom_data: {
            currency: 'NGN',
            value: order.total,
            content_name: 'A-01 Deadbolt Type Smart Lock',
            num_items: order.quantity
          }
        }
      ]
    };

    if (testEventCode && testEventCode.trim()) {
      payload.test_event_code = testEventCode.trim();
    }

    if (accessToken && accessToken.trim()) {
      const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log(`[Meta Conversions API] Sent events for Order ${order.id}:`, data);
      return data;
    } else {
      console.log(`[Meta Conversions API] Prepared CAPI event for Order ${order.id} on Pixel ${pixelId} (Browser Pixel tracking active with matching eventID: ${order.id})`);
      return { status: 'queued', pixelId, eventId: order.id };
    }
  } catch (err) {
    console.error('[Meta Conversions API Error]:', err);
    return null;
  }
}

// Formspree email notification helper
async function sendFormspreeNotification(order: any) {
  try {
    const db = readDb();
    const endpoint = db.settings?.formspreeEndpoint || process.env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/xbggbvjg';
    if (!endpoint || !endpoint.trim()) return;

    const response = await fetch(endpoint.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `New A-01 Smart Lock Order #${order.id} - ₦${order.total.toLocaleString()} (${order.fullName})`,
        orderReference: order.id,
        orderDate: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
        customerFullName: order.fullName,
        customerPhone: order.phone,
        customerWhatsApp: order.whatsapp || order.phone,
        deliveryState: order.state,
        deliveryMethod: order.deliveryMethod,
        pickupTerminal: order.motorParkLocation || 'N/A',
        doorstepAddress: order.deliveryAddress,
        quantityOrdered: `${order.quantity} unit(s)`,
        unitPrice: `₦${order.unitPrice.toLocaleString()}`,
        subtotal: `₦${order.subtotal.toLocaleString()}`,
        multiItemDiscount: order.discount ? `-₦${order.discount.toLocaleString()}` : '₦0',
        doorstepSurcharge: order.doorstepFee ? `₦${order.doorstepFee.toLocaleString()}` : '₦0 (FREE in Lagos / Motor Park)',
        totalPayableOnDelivery: `₦${order.total.toLocaleString()}`,
        paymentMethod: order.paymentMethod || 'Payment on Delivery',
        customerNotes: order.notes || 'None'
      })
    });

    const data = await response.json().catch(() => ({}));
    console.log(`[Formspree] Notification dispatched for Order ${order.id}:`, data);
    return data;
  } catch (err) {
    console.error(`[Formspree Error] Failed to send email for Order ${order.id}:`, err);
    return null;
  }
}

// TikTok Events API (Server-Side Conversion Tracking)
async function sendTikTokEventsApi(order: any, req: express.Request) {
  try {
    const db = readDb();
    const pixelId = db.settings?.pixels?.tikTokPixelId || 'DBMVHBRC77UASCMH7A20';
    const accessToken = db.settings?.pixels?.tikTokAccessToken || process.env.TIKTOK_ACCESS_TOKEN;
    const testEventCode = db.settings?.pixels?.tikTokTestEventCode || process.env.TIKTOK_TEST_EVENT_CODE;

    const clientIp = ((req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Mozilla/5.0';
    const eventSourceUrl = (req.headers['referer'] as string) || 'https://ais-pre-esmhdnz2qbrgb3hajpuwbr-656280234555.europe-west1.run.app/';

    // Hash user phone for TikTok Advanced Matching
    const crypto = await import('crypto');
    const cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
    const phoneToHash = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    const hashedPhone = phoneToHash ? crypto.createHash('sha256').update(phoneToHash).digest('hex') : undefined;

    const payload: any = {
      pixel_code: pixelId,
      event_source: 'web',
      event_source_id: pixelId,
      data: [
        {
          event: 'CompletePayment',
          event_id: order.id,
          timestamp: Math.floor(Date.now() / 1000).toString(),
          context: {
            user: {
              ...(hashedPhone ? { phone_number: hashedPhone } : {})
            },
            page: {
              url: eventSourceUrl
            },
            ip: clientIp,
            user_agent: userAgent
          },
          properties: {
            contents: [
              {
                content_id: 'A-01',
                content_type: 'product',
                content_name: 'A-01 Deadbolt Type Smart Lock',
                quantity: order.quantity || 1,
                price: order.total
              }
            ],
            value: order.total,
            currency: 'NGN'
          }
        }
      ]
    };

    if (testEventCode && testEventCode.trim()) {
      payload.test_event_code = testEventCode.trim();
    }

    if (accessToken && accessToken.trim()) {
      const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken.trim()
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      console.log(`[TikTok Events API] Sent event for Order ${order.id}:`, data);
      return data;
    } else {
      console.log(`[TikTok Events API] Browser Pixel active for Order ${order.id} with pixel ${pixelId} (event_id: ${order.id})`);
      return { status: 'browser_active', pixelId, eventId: order.id };
    }
  } catch (err) {
    console.error('[TikTok Events API Error]:', err);
    return null;
  }
}

// ----------------------------------------------------
// Public API Endpoints
// ----------------------------------------------------

// 1. Get Public Store Config
app.get('/api/public-config', (req, res) => {
  const db = readDb();
  res.json({
    settings: db.settings,
    deliveryFees: db.deliveryFees,
    reviews: db.reviews,
    specifications: db.specifications,
    includedItems: db.includedItems,
    galleryImages: db.galleryImages,
    nigerianStates: NIGERIAN_STATES
  });
});

// 2. Submit New Order
app.post('/api/orders', (req, res) => {
  const {
    fullName,
    phone,
    whatsapp,
    state,
    city,
    deliveryMethod,
    motorParkLocation,
    deliveryAddress,
    quantity,
    notes
  } = req.body;

  const isMotorPark = deliveryMethod === 'Motor Park Delivery';
  const effectiveAddress = isMotorPark
    ? (deliveryAddress && deliveryAddress.trim().length > 0
        ? deliveryAddress.trim()
        : motorParkLocation
        ? `${motorParkLocation} Motor Park Terminal, ${state}`
        : `Central Commercial Motor Park Terminal, ${state}`)
    : (deliveryAddress ? deliveryAddress.trim() : '');

  if (!fullName || !phone || !state) {
    return res.status(400).json({ error: 'Please provide all required delivery details (Name, Phone, State)' });
  }

  if (!isMotorPark && !effectiveAddress) {
    return res.status(400).json({ error: 'Please provide your doorstep delivery address' });
  }

  const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);
  const db = readDb();
  const unitPrice = db.settings.sellingPrice || 180000;
  const subtotal = unitPrice * parsedQty;

  // User request: "THE DISCOUNT FOR MULTIPLE ITEM IS 5K NOT 15K"
  let discount = 0;
  if (parsedQty > 1) {
    discount = (parsedQty - 1) * 5000;
  }

  // User request: Base state delivery removed (FREE nationwide!)
  const baseDeliveryFee = 0;

  // User request: Extra 5k for home delivery is NOT applicable to Lagos
  const isLagos = (state || '').trim().toLowerCase().includes('lagos');
  const isDoorstep = deliveryMethod === 'Doorstep Delivery';
  const doorstepFee = isDoorstep ? (isLagos ? 0 : 5000) : 0;
  const totalDeliveryFee = doorstepFee;
  const total = subtotal - discount + totalDeliveryFee;

  // Generate unique order reference (e.g. MC-26941)
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderId = `MC-${new Date().getFullYear().toString().slice(-2)}${randomSuffix}`;

  const newOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    fullName: fullName.trim(),
    phone: phone.trim(),
    whatsapp: (whatsapp || phone).trim(),
    state: state.trim(),
    city: (city || state).trim(),
    deliveryMethod: deliveryMethod || 'Motor Park Delivery',
    motorParkLocation: motorParkLocation ? motorParkLocation.trim() : undefined,
    doorstepFee,
    deliveryAddress: effectiveAddress,
    quantity: parsedQty,
    unitPrice,
    subtotal,
    discount,
    deliveryFee: totalDeliveryFee,
    total,
    notes: notes ? notes.trim() : '',
    status: 'Pending',
    paymentMethod: 'Payment on Delivery'
  };

  db.orders.unshift(newOrder);
  writeDb(db);

  // Trigger Meta Conversions API (CAPI) server-side event
  sendMetaConversionsApi(newOrder, req).catch((err) => {
    console.error('Meta CAPI error on order creation:', err);
  });

  // Trigger TikTok Events API server-side event
  sendTikTokEventsApi(newOrder, req).catch((err) => {
    console.error('TikTok Events API error on order creation:', err);
  });

  // Trigger Formspree email notification to seller
  sendFormspreeNotification(newOrder).catch((err) => {
    console.error('Formspree notification error on order creation:', err);
  });

  res.status(201).json({
    success: true,
    order: newOrder
  });
});

// Formspree Test Endpoint
app.post('/api/formspree/test', async (req, res) => {
  const db = readDb();
  const endpoint = req.body.endpoint || db.settings?.formspreeEndpoint || 'https://formspree.io/f/xbggbvjg';
  try {
    const response = await fetch(endpoint.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: 'Test Notification - A-01 Smart Lock Store',
        message: 'This is a test notification from your A-01 Smart Lock website. Formspree is properly connected and ready to send you order emails!',
        testDate: new Date().toISOString()
      })
    });
    const result = await response.json().catch(() => ({}));
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error communicating with Formspree' });
  }
});

// Meta Conversions API Live Event Relay (tracks PageView, ViewContent, InitiateCheckout, Contact, Lead, Purchase)
app.post('/api/meta-capi/event', async (req, res) => {
  const { eventName, eventId, params, userData, testEventCode, sourceUrl } = req.body;
  if (!eventName) {
    return res.status(400).json({ error: 'eventName is required' });
  }

  const result = await sendMetaCapiGeneric({
    eventName,
    eventId,
    customData: params,
    userDataInput: userData,
    req,
    testEventCodeOverride: testEventCode,
    sourceUrlOverride: sourceUrl
  });

  res.json({ success: true, result });
});

// Meta Conversions API Test Endpoint
app.post('/api/meta-capi/test', async (req, res) => {
  const db = readDb();
  const pixelId = req.body.pixelId || db.settings?.pixels?.metaPixelId || '947636671276929';
  const accessToken = req.body.accessToken || db.settings?.pixels?.metaAccessToken || process.env.META_ACCESS_TOKEN;
  const testEventCode = req.body.testEventCode || db.settings?.pixels?.metaTestEventCode || process.env.META_TEST_EVENT_CODE;

  if (!accessToken || !accessToken.trim()) {
    return res.json({
      success: true,
      mode: 'browser_active',
      pixelId,
      message: 'Browser Meta Pixel 947636671276929 is active and tracking all events. To send server-side events directly to Meta Graph API, enter your Meta System User Access Token in Settings.',
      samplePayload: {
        event_name: 'ViewContent',
        pixel_id: pixelId,
        currency: 'NGN',
        value: 180000,
        content_name: 'A-01 Deadbolt Type Smart Lock'
      }
    });
  }

  const result = await sendMetaCapiGeneric({
    eventName: req.body.eventName || 'ViewContent',
    eventId: `test-${Date.now()}`,
    customData: {
      currency: 'NGN',
      value: 180000,
      content_name: 'A-01 Deadbolt Type Smart Lock',
      content_type: 'product'
    },
    req,
    testEventCodeOverride: testEventCode
  });

  res.json({ success: true, mode: 'graph_api', pixelId, result });
});

// TikTok Pixel & Events API Test Endpoint
app.post('/api/tiktok/test', async (req, res) => {
  const db = readDb();
  const pixelId = req.body.pixelId || db.settings?.pixels?.tikTokPixelId || 'DBMVHBRC77UASCMH7A20';
  const testEventCode = req.body.testEventCode || db.settings?.pixels?.tikTokTestEventCode || process.env.TIKTOK_TEST_EVENT_CODE;
  const accessToken = req.body.accessToken || db.settings?.pixels?.tikTokAccessToken || process.env.TIKTOK_ACCESS_TOKEN;

  const clientIp = ((req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = (req.headers['user-agent'] as string) || 'Mozilla/5.0';

  const testPayload: any = {
    pixel_code: pixelId,
    event_source: 'web',
    event_source_id: pixelId,
    data: [
      {
        event: 'ViewContent',
        event_id: `test-${Date.now()}`,
        timestamp: Math.floor(Date.now() / 1000).toString(),
        context: {
          page: { url: (req.headers.referer as string) || 'https://ais-pre-esmhdnz2qbrgb3hajpuwbr-656280234555.europe-west1.run.app/' },
          ip: clientIp,
          user_agent: userAgent
        },
        properties: {
          contents: [{ content_id: 'A-01', content_type: 'product', content_name: 'A-01 Smart Lock', quantity: 1, price: 180000 }],
          value: 180000,
          currency: 'NGN'
        }
      }
    ]
  };

  if (testEventCode && testEventCode.trim()) {
    testPayload.test_event_code = testEventCode.trim();
  }

  if (accessToken && accessToken.trim()) {
    try {
      const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Token': accessToken.trim() },
        body: JSON.stringify(testPayload)
      });
      const result = await response.json().catch(() => ({}));
      return res.json({ success: true, mode: 'server_api', result });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Error sending TikTok event' });
    }
  }

  return res.json({
    success: true,
    mode: 'browser_pixel',
    pixelId,
    testPayload,
    note: 'TikTok Pixel DBMVHBRC77UASCMH7A20 is active in header and fires PageView and eCommerce events.'
  });
});

// 3. Get single order by ID (for confirmation page / customer lookup)
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const order = db.orders.find((o: any) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

// ----------------------------------------------------
// Admin API Endpoints
// ----------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const db = readDb();
  if (password === db.adminPassword) {
    const token = crypto.randomBytes(24).toString('hex');
    activeSessions.add(token);
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: 'Invalid admin password' });
});

// Admin Logout
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) activeSessions.delete(token);
  res.json({ success: true });
});

// Admin Get Orders & Stats
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const db = readDb();
  const orders = db.orders || [];

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o: any) => o.status !== 'Cancelled')
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;
  const confirmedOrders = orders.filter((o: any) => o.status === 'Confirmed').length;
  const dispatchedOrders = orders.filter((o: any) => o.status === 'Dispatched').length;
  const deliveredOrders = orders.filter((o: any) => o.status === 'Delivered').length;

  res.json({
    orders,
    stats: {
      totalOrders,
      totalRevenue,
      pendingOrders,
      confirmedOrders,
      dispatchedOrders,
      deliveredOrders
    }
  });
});

// Admin Update Order Status
app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const db = readDb();
  const orderIndex = db.orders.findIndex((o: any) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (status) {
    db.orders[orderIndex].status = status;
  }
  if (notes !== undefined) {
    db.orders[orderIndex].notes = notes;
  }

  writeDb(db);
  res.json({ success: true, order: db.orders[orderIndex] });
});

// Admin Delete Order
app.delete('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.orders = db.orders.filter((o: any) => o.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Admin Export Orders as CSV
app.get('/api/admin/orders/export', requireAdmin, (req, res) => {
  const db = readDb();
  const orders = db.orders || [];

  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Phone',
    'WhatsApp',
    'State',
    'Delivery Method',
    'Motor Park Terminal',
    'Doorstep Fee (NGN)',
    'Delivery Address',
    'Quantity',
    'Subtotal (NGN)',
    'Discount (NGN)',
    'Delivery Fee (NGN)',
    'Total (NGN)',
    'Status',
    'Customer Notes'
  ];

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = orders.map((o: any) => [
    escapeCsv(o.id),
    escapeCsv(new Date(o.createdAt).toLocaleString()),
    escapeCsv(o.fullName),
    escapeCsv(o.phone),
    escapeCsv(o.whatsapp),
    escapeCsv(o.state),
    escapeCsv(o.deliveryMethod || 'Motor Park Delivery'),
    escapeCsv(o.motorParkLocation || 'N/A'),
    escapeCsv(o.doorstepFee || 0),
    escapeCsv(o.deliveryAddress),
    escapeCsv(o.quantity),
    escapeCsv(o.subtotal),
    escapeCsv(o.discount || 0),
    escapeCsv(o.deliveryFee ?? 0),
    escapeCsv(o.total),
    escapeCsv(o.status),
    escapeCsv(o.notes)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=moonlight_crescent_orders_${Date.now()}.csv`);
  res.send(csvContent);
});

// Admin Update Store Settings
app.post('/api/admin/settings', requireAdmin, (req, res) => {
  const { settings, newPassword } = req.body;
  const db = readDb();
  if (settings) {
    db.settings = { ...db.settings, ...settings };
  }
  if (newPassword && newPassword.trim()) {
    db.adminPassword = newPassword.trim();
  }
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// Admin Update Delivery Fees
app.post('/api/admin/delivery-fees', requireAdmin, (req, res) => {
  const { deliveryFees } = req.body;
  const db = readDb();
  if (deliveryFees) {
    db.deliveryFees = deliveryFees;
    writeDb(db);
  }
  res.json({ success: true, deliveryFees: db.deliveryFees });
});

// Admin Manage Reviews
app.post('/api/admin/reviews', requireAdmin, (req, res) => {
  const { action, review, reviewId } = req.body;
  const db = readDb();

  if (action === 'add' && review) {
    const newRev = {
      id: `rev-${Date.now()}`,
      name: review.name || 'Customer',
      location: review.location || 'Nigeria',
      rating: review.rating || 5,
      date: new Date().toISOString().split('T')[0],
      comment: review.comment || '',
      verified: review.verified !== false,
      photoUrl: review.photoUrl || ''
    };
    db.reviews.unshift(newRev);
  } else if (action === 'edit' && review) {
    const idx = db.reviews.findIndex((r: any) => r.id === review.id);
    if (idx !== -1) {
      db.reviews[idx] = { ...db.reviews[idx], ...review };
    }
  } else if (action === 'delete' && reviewId) {
    db.reviews = db.reviews.filter((r: any) => r.id !== reviewId);
  }

  writeDb(db);
  res.json({ success: true, reviews: db.reviews });
});

// Admin Update Specifications & Inclusions
app.post('/api/admin/specifications', requireAdmin, (req, res) => {
  const { specifications, includedItems } = req.body;
  const db = readDb();
  if (specifications) db.specifications = specifications;
  if (includedItems) db.includedItems = includedItems;
  writeDb(db);
  res.json({ success: true, specifications: db.specifications, includedItems: db.includedItems });
});

// Admin Update Media Gallery
app.post('/api/admin/media', requireAdmin, (req, res) => {
  const { galleryImages, videoEmbedUrl, videoTitle, videoDescription } = req.body;
  const db = readDb();
  if (galleryImages) db.galleryImages = galleryImages;
  if (videoEmbedUrl !== undefined) db.settings.videoEmbedUrl = videoEmbedUrl;
  if (videoTitle !== undefined) db.settings.videoTitle = videoTitle;
  if (videoDescription !== undefined) db.settings.videoDescription = videoDescription;
  writeDb(db);
  res.json({ success: true, galleryImages: db.galleryImages, settings: db.settings });
});

// ----------------------------------------------------
// Setup Vite in Dev or Serve Static in Prod
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Moonlight Crescent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
