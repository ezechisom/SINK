import { Order } from '../types';

export interface TrackingMilestone {
  step: number;
  code: 'received' | 'confirmed' | 'prepared' | 'dispatched' | 'out_for_delivery' | 'delivered';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface TrackingResult {
  orderId: string;
  order: Order;
  currentStep: number; // 1 to 5
  statusLabel: string;
  statusCode: 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  courierName: string;
  waybillNumber: string;
  driverPhone: string;
  destination: string;
  timeline: TrackingMilestone[];
  isFromStorage: boolean;
  lastUpdated: string;
}

/**
 * Format a timestamp into an elegant, readable Nigerian local date-time string
 */
export function formatTrackingDate(isoString: string, hoursOffset = 0): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    if (hoursOffset !== 0) {
      d.setHours(d.getHours() + hoursOffset);
    }
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Retrieve all orders stored in the browser's localStorage
 */
export function getStoredOrders(): Order[] {
  const orders: Order[] = [];
  const seenIds = new Set<string>();

  try {
    // 1. mc_pending_orders
    const pending = JSON.parse(localStorage.getItem('mc_pending_orders') || '[]');
    if (Array.isArray(pending)) {
      pending.forEach((o) => {
        if (o && o.id && !seenIds.has(o.id.toUpperCase())) {
          seenIds.add(o.id.toUpperCase());
          orders.push(o);
        }
      });
    }

    // 2. mc_last_order
    const last = JSON.parse(localStorage.getItem('mc_last_order') || 'null');
    if (last && last.id && !seenIds.has(last.id.toUpperCase())) {
      seenIds.add(last.id.toUpperCase());
      orders.unshift(last);
    }

    // 3. mc_simulated_orders
    const simulated = JSON.parse(localStorage.getItem('mc_simulated_orders') || '[]');
    if (Array.isArray(simulated)) {
      simulated.forEach((o) => {
        if (o && o.id && !seenIds.has(o.id.toUpperCase())) {
          seenIds.add(o.id.toUpperCase());
          orders.push(o);
        }
      });
    }
  } catch (err) {
    console.warn('Error reading stored orders from localStorage:', err);
  }

  return orders;
}

/**
 * Save an order to simulated storage so user can revisit it
 */
export function saveOrderToStorage(order: Order): void {
  try {
    const existing = JSON.parse(localStorage.getItem('mc_simulated_orders') || '[]');
    const filtered = existing.filter((o: any) => o.id !== order.id);
    filtered.unshift(order);
    localStorage.setItem('mc_simulated_orders', JSON.stringify(filtered.slice(0, 30)));
  } catch (e) {}
}

/**
 * Generates or retrieves realistic simulated status updates for an order
 */
export function generateTrackingStatus(order: Order, forceStep?: number): TrackingResult {
  const createdDate = new Date(order.createdAt || Date.now());
  const now = Date.now();
  const elapsedHours = Math.max(0, (now - createdDate.getTime()) / (1000 * 60 * 60));

  // Determine stage based on elapsed time or forced step
  let step = 1;
  if (forceStep !== undefined) {
    step = Math.min(5, Math.max(1, forceStep));
  } else if (order.status === 'Delivered') {
    step = 5;
  } else if (order.status === 'Dispatched') {
    step = 3;
  } else if (order.status === 'Confirmed') {
    step = 2;
  } else {
    // Dynamic simulated progression based on elapsed hours
    if (elapsedHours > 36) {
      step = 5; // Delivered
    } else if (elapsedHours > 16) {
      step = 4; // Out for Delivery
    } else if (elapsedHours > 6) {
      step = 3; // Dispatched & In Transit
    } else if (elapsedHours > 1) {
      step = 2; // Verified & Inspection Done
    } else {
      step = 1; // Order Received & Processing
    }
  }

  const isLagos = (order.state || '').toLowerCase().includes('lagos');
  const courierName = isLagos
    ? 'Moonlight Crescent Direct Logistics (Lagos Dispatch Unit)'
    : 'GIG Logistics / RedStar Transit Nationwide Express';

  const orderNumeric = parseInt((order.id || '').replace(/[^0-9]/g, '').slice(-5), 10) || 54291;
  const waybillNumber = `WAYBILL-MC-${orderNumeric}`;
  const driverPhone = isLagos ? '09136827730' : '09136827730';

  let estimatedDelivery = 'Within 24 Hours';
  if (step === 5) {
    estimatedDelivery = 'Delivered (Signed & Payment Confirmed)';
  } else if (step === 4) {
    estimatedDelivery = 'Today (Courier en route to your location)';
  } else if (step === 3) {
    estimatedDelivery = isLagos ? 'Today / Tomorrow Morning' : '1 to 2 Business Days';
  } else {
    estimatedDelivery = isLagos ? 'Within 24 to 48 Hours' : '2 to 3 Business Days';
  }

  // Construct milestone timeline
  const baseTime = createdDate.toISOString();
  const timeline: TrackingMilestone[] = [
    {
      step: 1,
      code: 'received',
      title: 'Order Received & Documented',
      description: 'Your order details, lock specifications, and delivery preferences have been registered in our system.',
      location: 'Moonlight Crescent Central Office, Odunade Market, Lagos',
      timestamp: formatTrackingDate(baseTime, 0),
      completed: step >= 1,
      current: step === 1
    },
    {
      step: 2,
      code: 'confirmed',
      title: 'Phone Verification & Quality Test',
      description: 'Our customer care agent verified your delivery address. The lock unit underwent 100% biometric, 3D face recognition, 4.0" screen, and deadbolt mortise testing.',
      location: 'Technical Verification & Testing Hub, Lagos',
      timestamp: formatTrackingDate(baseTime, 1.2),
      completed: step >= 2,
      current: step === 2
    },
    {
      step: 3,
      code: 'dispatched',
      title: 'Dispatched from Fulfillment Hub',
      description: order.deliveryMethod === 'Motor Park Delivery'
        ? `Consigned for express transit to ${order.motorParkLocation || 'Central Commercial Park'} Terminal, ${order.state}. Waybill logged.`
        : `Handed over to ${courierName} for doorstep transit. Secure packaging with tamper-evident seal.`,
      location: isLagos ? 'Main Distribution Depot, Ikeja, Lagos' : 'Interstate Cargo Terminal, Ojota / Jibowu, Lagos',
      timestamp: formatTrackingDate(baseTime, 4.5),
      completed: step >= 3,
      current: step === 3
    },
    {
      step: 4,
      code: 'out_for_delivery',
      title: 'Out for Delivery / Arrival Notice',
      description: order.deliveryMethod === 'Motor Park Delivery'
        ? `Package arrived at ${order.state} terminal. Driver ready for handoff and inspection upon arrival.`
        : `Delivery courier is en route to ${order.deliveryAddress || order.state}. Please keep your phone line (${order.phone}) active.`,
      location: `${order.state} Local Delivery Hub`,
      timestamp: formatTrackingDate(baseTime, 18),
      completed: step >= 4,
      current: step === 4
    },
    {
      step: 5,
      code: 'delivered',
      title: 'Delivered & Payment on Delivery Completed',
      description: 'Package handed over, unboxed for customer inspection, verified authentic, and payment collected.',
      location: `${order.deliveryAddress || order.state}`,
      timestamp: formatTrackingDate(baseTime, 24),
      completed: step >= 5,
      current: step === 5
    }
  ];

  let statusLabel = 'Order Received & Processing';
  let statusCode: TrackingResult['statusCode'] = 'pending';

  switch (step) {
    case 1:
      statusLabel = 'Order Received — Verification Pending';
      statusCode = 'pending';
      break;
    case 2:
      statusLabel = 'Verified — Quality & Hardware Checked';
      statusCode = 'processing';
      break;
    case 3:
      statusLabel = 'Dispatched — In Transit';
      statusCode = 'dispatched';
      break;
    case 4:
      statusLabel = 'Out for Delivery — Arriving Today';
      statusCode = 'out_for_delivery';
      break;
    case 5:
      statusLabel = 'Delivered & Verified';
      statusCode = 'delivered';
      break;
  }

  const destination = order.deliveryMethod === 'Motor Park Delivery'
    ? `${order.motorParkLocation || 'Central Motor Park'} Terminal, ${order.state}`
    : `${order.deliveryAddress || order.state}`;

  return {
    orderId: order.id,
    order,
    currentStep: step,
    statusLabel,
    statusCode,
    estimatedDelivery,
    courierName,
    waybillNumber,
    driverPhone,
    destination,
    timeline,
    isFromStorage: true,
    lastUpdated: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * Searches local storage first, then attempts server fallback, or generates a realistic simulated order
 */
export async function lookupOrder(orderQuery: string): Promise<TrackingResult> {
  const cleanId = orderQuery.trim().toUpperCase();
  if (!cleanId) {
    throw new Error('Please enter a valid order reference number (e.g., MC-2612345)');
  }

  // 1. Check local storage
  const stored = getStoredOrders();
  const matched = stored.find((o) => {
    const id = (o.id || '').toUpperCase().trim();
    return id === cleanId || id === `MC-${cleanId}` || cleanId === `MC-${id}`;
  });

  if (matched) {
    return generateTrackingStatus(matched);
  }

  // 2. Attempt server query if network is available
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.order) {
        saveOrderToStorage(data.order);
        return generateTrackingStatus(data.order);
      }
    }
  } catch (err) {
    console.warn('Backend order lookup skipped or failed, using simulated retrieval:', err);
  }

  // 3. Fallback: Generate a simulated order for this valid order number
  // Format check: if user entered numbers only e.g. "2656629", prefix with "MC-"
  const normalizedId = cleanId.startsWith('MC-') ? cleanId : `MC-${cleanId}`;

  // Deterministic seed from order string for consistent simulation
  const pseudoSeed = normalizedId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sampleStates = ['Lagos', 'Federal Capital Territory (Abuja)', 'Rivers', 'Oyo', 'Ogun', 'Delta', 'Anambra', 'Kano'];
  const state = sampleStates[pseudoSeed % sampleStates.length];
  const isLagos = state === 'Lagos';
  const qty = (pseudoSeed % 2) + 1;
  const unitPrice = 180000;
  const discount = qty > 1 ? (qty - 1) * 5000 : 0;
  const doorstepFee = isLagos ? 0 : 5000;
  const total = unitPrice * qty - discount + doorstepFee;

  const simulatedOrder: Order = {
    id: normalizedId,
    createdAt: new Date(Date.now() - ((pseudoSeed % 48) + 2) * 3600000).toISOString(),
    fullName: 'Valued Customer',
    phone: '09136827730',
    whatsapp: '09136827730',
    state,
    city: state,
    deliveryMethod: 'Doorstep Delivery',
    deliveryAddress: isLagos ? 'Victoria Island / Lekki Phase 1, Lagos' : `Central District, ${state}`,
    quantity: qty,
    unitPrice,
    subtotal: unitPrice * qty,
    discount,
    deliveryFee: doorstepFee,
    total,
    status: 'Confirmed',
    paymentMethod: 'Payment on Delivery'
  };

  saveOrderToStorage(simulatedOrder);
  const result = generateTrackingStatus(simulatedOrder);
  result.isFromStorage = false;
  return result;
}
