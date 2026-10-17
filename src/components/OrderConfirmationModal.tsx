import React from 'react';
import { CheckCircle2, MessageCircle, X, Printer, PackageCheck, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationModalProps {
  order: Order;
  whatsappNumber: string;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  whatsappNumber,
  onClose
}) => {
  // Clean phone number for WhatsApp link
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const prefilledWhatsappMsg = encodeURIComponent(
    `Hello! I just placed an order for the Smart Kitchen Piano Sink (75 × 45 cm).\n\n` +
    `*Order Reference:* ${order.id}\n` +
    `*Name:* ${order.fullName}\n` +
    `*Phone:* ${order.phone}\n` +
    `*Delivery State:* ${order.state}\n` +
    `*Address:* ${order.deliveryAddress}, ${order.city}\n` +
    `*Quantity:* ${order.quantity} unit(s)\n` +
    `*Total:* ₦${order.total.toLocaleString()}\n\n` +
    `Please confirm my order dispatch. Thank you!`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${prefilledWhatsappMsg}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-2 border-blue-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-left my-8">
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
          <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
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
        <div className="space-y-4 text-sm divide-y divide-slate-100 pb-2">
          <div className="pt-2 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Product:</span>
            <span className="text-slate-900 font-bold text-right">
              Smart Kitchen Piano Sink ({order.quantity} {order.quantity === 1 ? 'unit' : 'units'})
            </span>
          </div>

          <div className="pt-3 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Subtotal:</span>
            <span className="text-slate-900 font-mono font-bold tabular-nums">
              ₦{order.subtotal.toLocaleString()}
            </span>
          </div>

          <div className="pt-3 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Delivery Fee ({order.state}):</span>
            <span className="text-slate-900 font-mono font-bold tabular-nums">
              {order.deliveryFee !== null ? `₦${order.deliveryFee.toLocaleString()}` : 'To be confirmed'}
            </span>
          </div>

          <div className="pt-3 flex justify-between items-start gap-4 text-base">
            <span className="font-bold text-slate-900">Total Amount:</span>
            <span className="font-['Outfit'] font-extrabold text-blue-600 text-xl tabular-nums">
              ₦{order.total.toLocaleString()}
            </span>
          </div>

          <div className="pt-3 flex justify-between items-start gap-4">
            <span className="text-slate-500 font-medium">Delivery Address:</span>
            <span className="text-slate-900 text-right max-w-xs font-semibold">
              {order.deliveryAddress}, {order.city}, {order.state}
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
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all text-center"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>CONFIRM ON WHATSAPP NOW</span>
          </a>

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
