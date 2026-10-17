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

// Serve static images directly from public/images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

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
      tikTokPixelId: 'DB2I7I3C77UA626EHF30',
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
      id: 'img-hero-installation',
      url: '/images/H360739baac2a4cf88fc2046698612fb1a.jpg',
      title: 'Luxury Kitchen Island Installation',
      subtitle: 'Integrated SUS304 smart sink with dual waterfall and real-time digital temperature display'
    },
    {
      id: 'img-piano-keys-modes',
      url: '/images/H7cd8196bf11145a98421bf3effdabdf9r.jpg',
      title: 'Tactile Piano Keys & 4 Water Modes',
      subtitle: 'Tap water outlet, flying rain, cascading waterfall, and high-pressure cup washer'
    },
    {
      id: 'img-dimensions-blueprint',
      url: '/images/H3c4573d0554c4af38cc585c26b09e3e8z.jpg',
      title: 'Technical Dimensions & Cutout Blueprint',
      subtitle: 'Standard 750 × 450 mm sink with 205 mm deep basin for standard 700 × 400 mm countertop cutout'
    },
    {
      id: 'img-flying-rain-waterfall',
      url: '/images/Hd85d44aecd9c4c648346996b0540cbd69.jpg',
      title: 'Flying Rain Waterfall Flow',
      subtitle: 'Gentle rainfall cascade across the perforated stainless steel washing colander'
    },
    {
      id: 'img-pullout-sprayer',
      url: '/images/Hbfbca46f9fec49179449b17fec40bc4ey.jpg',
      title: '360° Pull-Out Sprayer Faucet',
      subtitle: 'Flexible pull-out spray head reaching all sink corners with multiple spray patterns'
    },
    {
      id: 'img-plate-washing',
      url: '/images/Hd1946b3f5dba430aba7b4b0ecb381f0d1.jpg',
      title: 'High-Flow Waterfall Plate Washing',
      subtitle: 'Wide sheet water flow for rapid dish cleaning and vegetable preparation'
    },
    {
      id: 'img-honeycomb-surface',
      url: '/images/H29dff7a62abd4a2fa499cb2b7c22bd73i.jpg',
      title: 'Honeycomb Anti-Scratch Nano Surface',
      subtitle: 'High-tensile SUS304 steel with embossed hexagonal nano-pattern resisting scratches and grease'
    },
    {
      id: 'img-real-unboxing-box',
      url: '/images/H25a587f0b5d442b5aed842726533b1296_1.png',
      title: 'Real Factory Unboxing Package',
      subtitle: 'Actual boxed unit with solid wood chopping board, drainage pipes, basins, and protective foam'
    },
    {
      id: 'img-package-components-grid',
      url: '/images/H94af9dd4bf0b4dcdaa5f60afba5a6c56x.png',
      title: 'Complete Box Component Checklist',
      subtitle: 'Includes sink, flying rain faucet, basin-in-basin, chopping board, basket, valves, and sewer pipe'
    },
    {
      id: 'img-showroom-counter',
      url: '/images/H25af698200be4abd9392342c5f411ad5k.jpg',
      title: 'Real Showroom Countertop Unit',
      subtitle: 'Double sliding track ledges fitted with perforated colander and cutting board'
    },
    {
      id: 'img-detached-console-bar',
      url: '/images/H1591db5734b3464b8000d90f72ddd4fcb.jpg',
      title: 'Basin & Modular Faucet Console Bar',
      subtitle: 'Precision engineered mounting holes for faucet tower, soap dispenser, and cup washer'
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
    deliveryAddress,
    quantity,
    notes
  } = req.body;

  if (!fullName || !phone || !state || !city || !deliveryAddress) {
    return res.status(400).json({ error: 'Please provide all required delivery details' });
  }

  const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);
  const db = readDb();
  const unitPrice = db.settings.sellingPrice || 135000;
  const subtotal = unitPrice * parsedQty;
  const deliveryFee = db.deliveryFees[state] ?? null;
  const total = subtotal + (deliveryFee ?? 0);

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
    city: city.trim(),
    deliveryAddress: deliveryAddress.trim(),
    quantity: parsedQty,
    unitPrice,
    subtotal,
    deliveryFee,
    total,
    notes: notes ? notes.trim() : '',
    status: 'Pending',
    paymentMethod: 'Payment on Delivery'
  };

  db.orders.unshift(newOrder);
  writeDb(db);

  res.status(201).json({
    success: true,
    order: newOrder
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
    'City',
    'Delivery Address',
    'Quantity',
    'Subtotal (NGN)',
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
    escapeCsv(o.city),
    escapeCsv(o.deliveryAddress),
    escapeCsv(o.quantity),
    escapeCsv(o.subtotal),
    escapeCsv(o.deliveryFee ?? 'To be confirmed'),
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
