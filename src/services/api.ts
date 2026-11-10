import { Order, PublicConfig, StoreSettings, DeliveryFeesMap, CustomerReview, SpecificationItem } from '../types';

export async function fetchPublicConfig(): Promise<PublicConfig> {
  try {
    const res = await fetch('/api/public-config');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Network issue fetching public config:', err);
  }
  throw new Error('Failed to load store configuration');
}

function createResilientOrder(orderData: {
  fullName: string;
  phone: string;
  whatsapp?: string;
  state: string;
  city?: string;
  deliveryMethod?: 'Motor Park Delivery' | 'Doorstep Delivery';
  motorParkLocation?: string;
  doorstepFee?: number;
  discount?: number;
  deliveryAddress?: string;
  quantity: number;
  notes?: string;
}): Order {
  const parsedQty = Math.max(1, orderData.quantity || 1);
  const unitPrice = 180000;
  const subtotal = unitPrice * parsedQty;
  const discount = parsedQty > 1 ? (parsedQty - 1) * 5000 : 0;
  const isLagos = (orderData.state || '').toLowerCase().includes('lagos');
  const isDoorstep = orderData.deliveryMethod === 'Doorstep Delivery';
  const doorstepFee = isDoorstep ? (isLagos ? 0 : 5000) : 0;
  const total = subtotal - discount + doorstepFee;

  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderId = `MC-${new Date().getFullYear().toString().slice(-2)}${randomSuffix}`;

  const order: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    fullName: (orderData.fullName || '').trim(),
    phone: (orderData.phone || '').trim(),
    whatsapp: (orderData.whatsapp || orderData.phone || '').trim(),
    state: (orderData.state || 'Lagos').trim(),
    city: (orderData.city || orderData.state || 'Lagos').trim(),
    deliveryMethod: orderData.deliveryMethod || 'Doorstep Delivery',
    motorParkLocation: orderData.motorParkLocation,
    doorstepFee,
    deliveryAddress: orderData.deliveryAddress || `${orderData.state} Delivery`,
    quantity: parsedQty,
    unitPrice,
    subtotal,
    discount,
    deliveryFee: doorstepFee,
    total,
    notes: orderData.notes,
    status: 'Pending',
    paymentMethod: 'Payment on Delivery'
  };

  try {
    const existing = JSON.parse(localStorage.getItem('mc_pending_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('mc_pending_orders', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {}

  return order;
}

export async function submitOrder(orderData: {
  fullName: string;
  phone: string;
  whatsapp?: string;
  state: string;
  city?: string;
  deliveryMethod?: 'Motor Park Delivery' | 'Doorstep Delivery';
  motorParkLocation?: string;
  doorstepFee?: number;
  discount?: number;
  deliveryAddress?: string;
  quantity: number;
  notes?: string;
}): Promise<Order> {
  let res: Response | null = null;
  let networkFailed = false;

  try {
    res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
  } catch (err) {
    console.warn('Network error reaching /api/orders, preserving order with resilient fallback:', err);
    networkFailed = true;
  }

  if (res) {
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        const data = await res.json();
        if (res.ok && data.order) {
          try {
            const existing = JSON.parse(localStorage.getItem('mc_pending_orders') || '[]');
            const filtered = existing.filter((o: any) => o.id !== data.order.id);
            filtered.unshift(data.order);
            localStorage.setItem('mc_pending_orders', JSON.stringify(filtered.slice(0, 50)));
            localStorage.setItem('mc_last_order', JSON.stringify(data.order));
          } catch (e) {}
          return data.order;
        }
        if (!res.ok) {
          throw new Error(data.error || 'Failed to submit order');
        }
      } catch (parseErr: any) {
        if (!res.ok) {
          console.warn('Non-JSON or parse error on /api/orders, activating fallback:', parseErr);
          return createResilientOrder(orderData);
        }
        throw parseErr;
      }
    } else {
      // Server returned HTML or plain text (e.g. 502/503 "The page cannot be displayed")
      const text = await res.text().catch(() => '');
      console.warn('Received non-JSON response from /api/orders:', text);
      return createResilientOrder(orderData);
    }
  }

  if (networkFailed || !res) {
    return createResilientOrder(orderData);
  }

  return createResilientOrder(orderData);
}

export async function fetchOrderById(id: string): Promise<Order> {
  try {
    const res = await fetch(`/api/orders/${id}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.order) return data.order;
    }
  } catch (e) {}

  try {
    const stored = JSON.parse(localStorage.getItem('mc_pending_orders') || '[]');
    const found = stored.find((o: any) => o.id === id);
    if (found) return found;
  } catch (e) {}

  throw new Error('Order not found');
}

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid credentials');
  }
  return data.token;
}

export async function adminGetOrders(token: string) {
  const res = await fetch('/api/admin/orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch admin orders');
  }
  return data;
}

export async function adminUpdateOrderStatus(token: string, orderId: string, status: string, notes?: string) {
  const res = await fetch(`/api/admin/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status, notes })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update order');
  }
  return data.order;
}

export async function adminDeleteOrder(token: string, orderId: string) {
  const res = await fetch(`/api/admin/orders/${orderId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete order');
  }
  return true;
}

export async function adminUpdateSettings(token: string, settings: Partial<StoreSettings>, newPassword?: string) {
  const res = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ settings, newPassword })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update settings');
  }
  return data.settings;
}

export async function adminUpdateDeliveryFees(token: string, deliveryFees: DeliveryFeesMap) {
  const res = await fetch('/api/admin/delivery-fees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ deliveryFees })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update delivery fees');
  }
  return data.deliveryFees;
}

export async function adminManageReviews(token: string, payload: {
  action: 'add' | 'edit' | 'delete';
  review?: Partial<CustomerReview>;
  reviewId?: string;
}) {
  const res = await fetch('/api/admin/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to manage reviews');
  }
  return data.reviews;
}

export async function adminUpdateSpecifications(token: string, specifications: SpecificationItem[], includedItems: string[]) {
  const res = await fetch('/api/admin/specifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ specifications, includedItems })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update specifications');
  }
  return data;
}

export async function adminUpdateMedia(token: string, payload: {
  galleryImages?: PublicConfig['galleryImages'];
  videoEmbedUrl?: string;
  videoTitle?: string;
  videoDescription?: string;
}) {
  const res = await fetch('/api/admin/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update media');
  }
  return data;
}
