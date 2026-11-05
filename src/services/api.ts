import { Order, PublicConfig, StoreSettings, DeliveryFeesMap, CustomerReview, SpecificationItem } from '../types';

export async function fetchPublicConfig(): Promise<PublicConfig> {
  const res = await fetch('/api/public-config');
  if (!res.ok) {
    throw new Error('Failed to load store configuration');
  }
  return res.json();
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
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit order');
  }
  return data.order;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Order not found');
  }
  return data.order;
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
