import React, { useState } from 'react';
import { ShoppingBag, AlertCircle, ShieldCheck, Truck, Check } from 'lucide-react';
import { Order, DeliveryFeesMap } from '../types';
import { submitOrder } from '../services/api';
import { trackEvent } from '../services/tracking';

interface OrderFormProps {
  price: number;
  deliveryFees: DeliveryFeesMap;
  nigerianStates: string[];
  onOrderSuccess: (order: Order) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  price,
  deliveryFees,
  nigerianStates,
  onOrderSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculations
  const subtotal = price * quantity;
  const deliveryFee = deliveryFees[state] !== undefined ? deliveryFees[state] : null;
  const total = subtotal + (deliveryFee !== null ? deliveryFee : 0);

  const handleFormInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      trackEvent('InitiateCheckout', {
        value: subtotal,
        currency: 'NGN',
        num_items: quantity
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid Nigerian telephone number (e.g., 08012345678).');
      return;
    }
    if (!state.trim()) {
      setErrorMessage('Please select your delivery state.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city or town.');
      return;
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
      setErrorMessage('Please enter your full, detailed street delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await submitOrder({
        fullName,
        phone,
        whatsapp: whatsapp.trim() || phone.trim(),
        state,
        city,
        deliveryAddress,
        quantity,
        notes
      });

      // Track confirmed purchase
      trackEvent('Purchase', {
        orderId: order.id,
        value: order.total,
        currency: 'NGN',
        num_items: order.quantity,
        content_name: 'Smart Kitchen Piano Sink'
      });

      onOrderSuccess(order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order. Please try again or message our WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="py-16 sm:py-24 bg-white border-b border-blue-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">
            <span>Fast Checkout</span>
            <span aria-hidden="true" className="text-blue-300">·</span>
            <span>Payment on Delivery</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            ORDER YOUR SMART PIANO SINK TODAY
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Fill the brief form below to reserve your sink. Our team will contact you to verify details before immediate dispatch.
          </p>
        </div>

        {/* Order Card Container */}
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-500/5 text-left">
          {/* Product Summary Header inside form */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-700 font-bold block">
                Selected Product
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Smart Kitchen Piano Sink (75 × 45 cm)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Complete Workstation Package (Includes Waterfall Faucet, Glass Rinser & Fittings)
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs text-slate-500 font-semibold block">Unit Price</span>
              <span className="font-['Outfit'] text-2xl font-extrabold text-blue-600 tabular-nums">
                ₦{price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} onFocus={handleFormInteraction} className="space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Row 1: Full Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Full Name <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Phone Number <span className="text-blue-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            {/* Row 2: WhatsApp Number (optional) & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  WhatsApp Number <span className="text-slate-500 font-normal lowercase">(optional, if different)</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0812 345 6789"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Delivery State (Nigeria) <span className="text-blue-600">*</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer"
                >
                  {nigerianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: City / Town & Quantity Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  City / Town / Area <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lekki, Ikeja, Maitama, GRA"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Quantity of Sinks
                </label>
                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-300 p-1 h-[48px]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-full rounded-lg bg-white hover:bg-blue-50 text-slate-800 font-bold text-base flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-slate-900 text-base font-mono tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-full rounded-lg bg-white hover:bg-blue-50 text-slate-800 font-bold text-base flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Row 4: Full Street Delivery Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Detailed Delivery Address <span className="text-blue-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="House number, street name, estate, nearest landmark..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors resize-none"
              />
            </div>

            {/* Row 5: Additional Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Additional Delivery Instructions <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Call before dispatch, gate security instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
              />
            </div>

            {/* Price Breakdown Calculation Card */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Product Subtotal ({quantity} {quantity === 1 ? 'unit' : 'units'}):</span>
                <span className="font-mono text-slate-900 font-bold tabular-nums">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Delivery Fee ({state}):</span>
                </span>
                <span className="font-mono text-slate-900 font-bold tabular-nums">
                  {deliveryFee !== null ? (
                    `₦${deliveryFee.toLocaleString()}`
                  ) : (
                    <span className="text-blue-600 text-xs italic font-semibold">Delivery fee to be confirmed</span>
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-base">Estimated Total Payable:</span>
                <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-blue-600 tabular-nums">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="action-glow w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-base tracking-wide shadow-xl active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span>{isSubmitting ? 'PROCESSING YOUR ORDER...' : 'ORDER NOW — ₦' + total.toLocaleString()}</span>
            </button>

            {/* Trust reassurance */}
            <div className="text-center text-xs text-slate-600 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 font-medium">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Payment on Delivery</span>
              </div>
              <span>·</span>
              <span>Inspect Upon Arrival</span>
              <span>·</span>
              <span>7-Day Replacement Guarantee</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
