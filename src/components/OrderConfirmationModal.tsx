import React from 'react';
import { CheckCircle2, MessageCircle, X, Printer, MapPin, Building, Home, Tag, Package, Truck } from 'lucide-react';
import { Order } from '../types';
import { isLagosState } from '../utils/delivery';

interface OrderConfirmationModalProps {
  order: Order;
  whatsappNumber: string;
  onClose: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  whatsappNumber,
  onClose,
  onTrackOrder
}) => {
  // Clean phone number for WhatsApp link
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const isLagos = isLagosState(order.state);

  const deliveryMethodDisplay =
    order.deliveryMethod === 'Motor Park Delivery'
      ? `Motor Park Delivery${order.motorParkLocation ? ` (${order.motorParkLocation} Terminal)` : ''} — FREE`
      : `Doorstep Delivery ${isLagos ? '(FREE in Lagos)' : '(+₦5,000 Surcharge)'}`;

  const prefilledWhatsappMsg = encodeURIComponent(
    `Hello! I just placed an order for the A-01 Deadbolt Type Smart Lock.\n\n` +
    `*Order Reference:* ${order.id}\n` +
    `*Name:* ${order.fullName}\n` +
    `*Phone:* ${order.phone}\n` +
    `*Delivery Method:* ${order.deliveryMethod || 'Motor Park Delivery'}\n` +
    `*Delivery State:* ${order.state}\n` +
    (order.deliveryMethod === 'Motor Park Delivery'
      ? `*Pickup Terminal:* ${order.motorParkLocation || 'Central Commercial Park'} Terminal, ${order.state}\n`
      : `*Doorstep Address:* ${order.deliveryAddress}\n`) +
    `*Quantity:* ${order.quantity} unit(s)\n` +
    (order.discount && order.discount > 0 ? `*Multi-Unit Discount:* -₦${order.discount.toLocaleString()}\n` : '') +
    `*Total Payable on Delivery:* ₦${order.total.toLocaleString()}\n\n` +
    `Please confirm my order dispatch. Thank you!`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${prefilledWhatsappMsg}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl text-left my-4 sm:my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Order Received Successfully
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Thank You, {order.fullName}!
            </h2>
          </div>
        </div>

        {/* Order Reference Strip */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs uppercase text-blue-800 font-bold block">
              Your Unique Order Reference
            </span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-blue-700 tracking-wider">
              {order.id}
            </span>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-sm">
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Order Receipt Details */}
        <div className="space-y-3.5 text-sm divide-y divide-slate-100 pb-2">
          <div className="pt-2 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Product:</span>
            <span className="text-slate-900 font-bold text-right">
              A-01 Deadbolt Type Smart Lock ({order.quantity} {order.quantity === 1 ? 'unit' : 'units'})
            </span>
          </div>

          <div className="pt-3 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Subtotal:</span>
            <span className="text-slate-900 font-mono font-bold tabular-nums">
              ₦{order.subtotal.toLocaleString()}
            </span>
          </div>

          {/* Multi-unit discount row */}
          {order.discount && order.discount > 0 && (
            <div className="pt-3 flex justify-between items-start gap-4 text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
              <span className="font-bold flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Multi-Unit Purchase Discount:</span>
              </span>
              <span className="font-mono font-extrabold tabular-nums">
                -₦{order.discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="pt-3 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Delivery Method:</span>
            <span className="text-slate-900 text-right font-bold text-xs sm:text-sm">
              {deliveryMethodDisplay}
            </span>
          </div>

          {order.deliveryMethod === 'Motor Park Delivery' ? (
            <div className="pt-3 flex justify-between items-start gap-4">
              <span className="text-slate-500 font-medium">Pickup Terminal:</span>
              <span className="text-blue-700 text-right font-bold text-xs sm:text-sm bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {order.motorParkLocation || 'Commercial Motor Park'} Terminal ({order.state})
              </span>
            </div>
          ) : (
            <div className="pt-3 flex justify-between items-start gap-4">
              <span className="text-slate-500 font-medium">Doorstep Address:</span>
              <span className="text-slate-900 text-right max-w-xs font-semibold">
                {order.deliveryAddress}, {order.state}
              </span>
            </div>
          )}

          <div className="pt-3 flex justify-between items-start gap-4 text-base">
            <span className="font-bold text-slate-900">Total Payable on Delivery:</span>
            <span className="font-['Outfit'] font-extrabold text-blue-600 text-xl tabular-nums">
              ₦{order.total.toLocaleString()}
            </span>
          </div>

          <div className="pt-3 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Contact Telephone:</span>
            <span className="text-slate-900 font-mono font-bold">{order.phone}</span>
          </div>

          <div className="pt-3 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Payment Method:</span>
            <span className="text-blue-700 font-bold">{order.paymentMethod}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* WhatsApp Direct Confirmation */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                window.fbq('track', 'Contact', {
                  content_name: 'A-01 Deadbolt Type Smart Lock',
                  order_id: order.id,
                  value: order.total,
                  currency: 'NGN'
                });
              }
            }}
            className="action-glow flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all text-center cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>CONFIRM ON WHATSAPP NOW</span>
          </a>

          {/* Track Live Status Button */}
          {onTrackOrder && (
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.id);
              }}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Package className="w-4 h-4 text-blue-600" />
              <span>Track Live Status</span>
            </button>
          )}

          {/* Print/Save Receipt */}
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Receipt</span>
          </button>
        </div>

        <div className="mt-5 text-center text-xs text-slate-500 font-medium">
          Our fulfillment team will call or message you shortly to verify your delivery time and location.
        </div>
      </div>
    </div>
  );
};
