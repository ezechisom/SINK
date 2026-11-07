import React, { useState, useEffect } from 'react';
import { ShoppingBag, AlertCircle, ShieldCheck, Truck, MapPin, Building, Home, Tag, CheckCircle2 } from 'lucide-react';
import { Order, DeliveryFeesMap } from '../types';
import { submitOrder } from '../services/api';
import { trackEvent } from '../services/tracking';
import {
  getMotorParksForState,
  isLagosState,
  calculateDoorstepFee,
  calculateMultiUnitDiscount
} from '../utils/delivery';

interface OrderFormProps {
  price: number;
  deliveryFees: DeliveryFeesMap;
  nigerianStates: string[];
  onOrderSuccess: (order: Order) => void;
  onFormInteraction?: (isInteracting: boolean) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  price,
  nigerianStates,
  onOrderSuccess,
  onFormInteraction
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Lagos');
  const [deliveryMethod, setDeliveryMethod] = useState<'Motor Park Delivery' | 'Doorstep Delivery'>('Doorstep Delivery');
  const [motorParkLocation, setMotorParkLocation] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available motor parks for selected state
  const availableMotorParks = React.useMemo(() => getMotorParksForState(state), [state]);

  // Notify parent component that customer is filling out the main form
  const notifyFilling = () => {
    onFormInteraction?.(true);
  };

  // Auto-sync motor park when state changes
  useEffect(() => {
    if (availableMotorParks && availableMotorParks.length > 0) {
      if (!availableMotorParks.includes(motorParkLocation)) {
        setMotorParkLocation(availableMotorParks[0]);
      }
    }
  }, [state, availableMotorParks, motorParkLocation]);

  // Calculations
  const subtotal = price * quantity;
  const discount = calculateMultiUnitDiscount(quantity);
  const isLagos = isLagosState(state);
  const doorstepFee = calculateDoorstepFee(state, deliveryMethod);
  // Base delivery is 100% free nationwide
  const total = subtotal - discount + doorstepFee;

  // Auto-switch to Doorstep Delivery when Lagos is selected (Park option removed for Lagos)
  useEffect(() => {
    if (isLagos && deliveryMethod === 'Motor Park Delivery') {
      setDeliveryMethod('Doorstep Delivery');
      setMotorParkLocation('');
    }
  }, [isLagos, deliveryMethod]);

  const handleFormInteraction = () => {
    notifyFilling();
    if (!hasInteracted) {
      setHasInteracted(true);
      trackEvent('InitiateCheckout', {
        value: subtotal - discount,
        currency: 'NGN',
        num_items: quantity
      });
    }
  };

  const handleStateChange = (newState: string) => {
    notifyFilling();
    setState(newState);
    if (isLagosState(newState)) {
      setDeliveryMethod('Doorstep Delivery');
      setMotorParkLocation('');
    } else {
      const parks = getMotorParksForState(newState);
      if (parks && parks.length > 0) {
        setMotorParkLocation(parks[0]);
      } else {
        setMotorParkLocation('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    notifyFilling();

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const sanitizedPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!sanitizedPhone || sanitizedPhone.length < 8) {
      setErrorMessage('Please enter a valid Nigerian telephone number (e.g., 08012345678).');
      return;
    }

    if (!state.trim()) {
      setErrorMessage('Please select your delivery state.');
      return;
    }

    if (deliveryMethod === 'Motor Park Delivery' && availableMotorParks && availableMotorParks.length > 0 && !motorParkLocation) {
      setMotorParkLocation(availableMotorParks[0]);
    }

    // Street address is required when Doorstep Delivery is chosen
    if (deliveryMethod === 'Doorstep Delivery') {
      if (!deliveryAddress.trim() || deliveryAddress.trim().length < 3) {
        setErrorMessage(`Please enter your complete doorstep delivery address in ${state}.`);
        return;
      }
    }

    setIsSubmitting(true);

    const chosenTerminal = motorParkLocation || (availableMotorParks && availableMotorParks[0]) || `${state} Commercial Central Park`;
    const effectiveDeliveryAddress = deliveryMethod === 'Doorstep Delivery'
      ? deliveryAddress.trim()
      : `${chosenTerminal} Terminal, ${state}`;

    try {
      const order = await submitOrder({
        fullName: fullName.trim(),
        phone: sanitizedPhone,
        whatsapp: sanitizedPhone,
        state: state.trim(),
        deliveryMethod,
        motorParkLocation: deliveryMethod === 'Motor Park Delivery' ? chosenTerminal : undefined,
        doorstepFee,
        discount,
        deliveryAddress: effectiveDeliveryAddress,
        quantity,
        notes: notes.trim() ? notes.trim() : undefined
      });

      // Track confirmed purchase with eventID for Meta CAPI deduplication
      trackEvent(
        'Purchase',
        {
          orderId: order.id,
          value: order.total,
          currency: 'NGN',
          num_items: order.quantity,
          content_name: 'A-01 Deadbolt Type Smart Lock'
        },
        { eventId: order.id }
      );

      // Dispatch email notification to Formspree
      fetch('https://formspree.io/f/xbggbvjg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New A-01 Smart Lock Order #${order.id} - ₦${order.total.toLocaleString()} (${fullName})`,
          orderReference: order.id,
          customerName: fullName,
          phoneNumber: phone,
          deliveryMethod,
          pickupTerminal: deliveryMethod === 'Motor Park Delivery' ? chosenTerminal : 'N/A',
          doorstepDeliveryAddress: effectiveDeliveryAddress,
          deliveryState: state,
          quantity: `${quantity} unit(s)`,
          unitPrice: `₦${order.unitPrice.toLocaleString()}`,
          subtotal: `₦${order.subtotal.toLocaleString()}`,
          discount: order.discount ? `-₦${order.discount.toLocaleString()}` : '₦0',
          doorstepSurcharge: doorstepFee ? `₦${doorstepFee.toLocaleString()}` : '₦0 (FREE in Lagos / Motor Park)',
          totalPayableOnDelivery: `₦${order.total.toLocaleString()}`,
          customerNotes: notes.trim() || 'None',
          orderTimestamp: new Date().toLocaleString()
        })
      }).catch((e) => console.log('Client Formspree dispatch:', e));

      onOrderSuccess(order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="py-16 sm:py-24 bg-white border-b border-blue-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-3 border border-emerald-300 shadow-xs">
            <span>Free Nationwide Delivery</span>
            <span aria-hidden="true" className="text-emerald-400">·</span>
            <span>Pay on Delivery</span>
            <span aria-hidden="true" className="text-emerald-400">·</span>
            <span>₦5,000 Multi-Unit Discount</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            ORDER YOUR A-01 SMART LOCK TODAY
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Fill the brief form below to reserve your A-01 Deadbolt Smart Lock. Zero upfront payment required. Enjoy nationwide delivery, fast dispatch, and instant ₦5,000 discount when you order more than 1 unit!
          </p>
        </div>

        {/* Order Card Container */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-xl shadow-blue-500/5 text-left">
          {/* Product Summary Header inside form */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-700 font-bold block">
                Selected Product
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                A-01 Deadbolt Type Smart Lock
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Complete Front & Interior Panels (3D Face Camera, 4.0" Screen, Fingerprint, Deadbolt Mortise & Smart Accessories)
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
                  onChange={(e) => {
                    notifyFilling();
                    setFullName(e.target.value);
                  }}
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
                  onChange={(e) => {
                    notifyFilling();
                    setPhone(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Delivery State & Quantity Stepper with Multi-Unit Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Delivery State (Nigeria) <span className="text-blue-600">*</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer"
                >
                  {nigerianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {isLagos ? (
                  <p className="mt-1.5 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Lagos State: FREE Doorstep Delivery eligible!</span>
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Nationwide delivery to {state} via Motor Park or Doorstep.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Quantity of Smart Locks
                  </label>
                  {quantity > 1 ? (
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ₦{discount.toLocaleString()} Discount Applied!
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-blue-700">
                      Save ₦5,000 on 2+ units
                    </span>
                  )}
                </div>

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
                    {quantity} {quantity === 1 ? 'unit' : 'units'}
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

                {/* Quick package buttons for 1, 2, or 3 locks */}
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(1)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                      quantity === 1
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    1 Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(2)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border relative ${
                      quantity === 2
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
                    }`}
                  >
                    2 Units
                    <span className="block text-[10px] font-extrabold opacity-90">-₦5k OFF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(3)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border relative ${
                      quantity === 3
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
                    }`}
                  >
                    3 Units
                    <span className="block text-[10px] font-extrabold opacity-90">-₦10k OFF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Multi-unit discount banner when quantity > 1 */}
            {quantity > 1 && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between gap-3 text-emerald-900 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm block">
                      Multi-Unit Purchase Discount Unlocked!
                    </span>
                    <span className="text-xs text-emerald-700">
                      You are getting an instant discount of ₦{discount.toLocaleString()} for ordering {quantity} locks (₦5,000 OFF each additional lock).
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-base font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    -₦{discount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Row 3: Delivery Method (Park option removed for Lagos per user instruction) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  {isLagos ? 'Delivery Method for Lagos' : 'Choose Delivery Method'} <span className="text-blue-600">*</span>
                </label>
                <span className="text-xs text-emerald-700 font-bold">
                  {isLagos ? 'Doorstep Delivery is 100% FREE in Lagos' : 'Base Delivery is 100% FREE'}
                </span>
              </div>

              {isLagos ? (
                /* For Lagos: Park option is REMOVED! Doorstep delivery is standard & 100% FREE */
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/80 shadow-xs flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                        <span>Direct Doorstep Delivery</span>
                      </span>
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                        100% FREE in Lagos
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">
                      All orders in Lagos State are delivered straight to your home, office, or project site with <strong>zero delivery charge</strong>! Simply input your address below.
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-200/70 border border-emerald-300 text-emerald-900 text-xs font-bold">
                      <span>✓ Free Direct Home Delivery · Payment on Delivery Available</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* For states outside Lagos: Allow choosing Motor Park (Free) or Doorstep (+₦5,000) */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Motor Park Delivery */}
                  <label
                    onClick={() => setDeliveryMethod('Motor Park Delivery')}
                    className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'Motor Park Delivery'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="Motor Park Delivery"
                      checked={deliveryMethod === 'Motor Park Delivery'}
                      onChange={() => setDeliveryMethod('Motor Park Delivery')}
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Motor Park Delivery</span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                          FREE
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Safe pickup from designated major transit park/terminal in {state}.
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-800 text-[11px] font-semibold">
                        <span>✓ Standard Terminal Dispatch</span>
                      </div>
                    </div>
                  </label>

                  {/* Doorstep Delivery */}
                  <label
                    onClick={() => setDeliveryMethod('Doorstep Delivery')}
                    className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'Doorstep Delivery'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="Doorstep Delivery"
                      checked={deliveryMethod === 'Doorstep Delivery'}
                      onChange={() => setDeliveryMethod('Doorstep Delivery')}
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                          <Home className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Doorstep Delivery</span>
                        </span>
                        <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                          +₦5,000 Extra
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Direct delivery right to your residential home, office, or building construction site.
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-bold shadow-xs">
                        <span>⚠️ Attracts extra fee of ₦5,000</span>
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Motor Park Specific Options when Motor Park Delivery is selected (non-Lagos only) */}
            {!isLagos && deliveryMethod === 'Motor Park Delivery' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border-2 border-blue-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>Select Motor Park Terminal in {state}:</span>
                    <span className="text-blue-600">*</span>
                  </label>
                  <span className="text-[11px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    Official Transit Park
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                  {availableMotorParks.map((park) => {
                    const isSelected = motorParkLocation === park;
                    return (
                      <button
                        key={park}
                        type="button"
                        onClick={() => setMotorParkLocation(park)}
                        className={`p-3 rounded-xl border-2 text-left font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <span className="text-sm">{park}</span>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-extrabold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Park
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Confirmation notice for Motor Park pickup — No address input needed */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-emerald-900 text-xs sm:text-sm">
                      No Street Address Needed!
                    </span>
                    <p className="mt-0.5 text-emerald-800 leading-relaxed">
                      Your smart lock will be safely dispatched directly to <strong className="text-emerald-950">{motorParkLocation || availableMotorParks[0]} Park Terminal</strong> in {state}. Our driver/dispatch will call and text your phone with the waybill slip for quick collection.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Row 4: Detailed Doorstep Delivery Address (ONLY shown for Doorstep Delivery) */}
            {deliveryMethod === 'Doorstep Delivery' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Detailed Doorstep Delivery Address in {state} <span className="text-blue-600">*</span>
                  </label>
                  {isLagos && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      FREE Lagos Home Delivery
                    </span>
                  )}
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder={`House/flat number, street name, estate, nearest landmark in ${state}...`}
                  value={deliveryAddress}
                  onChange={(e) => {
                    notifyFilling();
                    setDeliveryAddress(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors resize-none"
                />
              </div>
            )}

            {/* Row 5: Additional Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Additional Delivery Instructions <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Call before dispatch, alternative phone number or plumber details..."
                value={notes}
                onChange={(e) => {
                  notifyFilling();
                  setNotes(e.target.value);
                }}
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

              {/* Multi-unit discount line */}
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <span className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Multi-Unit Purchase Discount ({quantity} locks):</span>
                  </span>
                  <span className="font-mono font-extrabold tabular-nums text-emerald-700">
                    -₦{discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Base Nationwide Delivery ({state}):</span>
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs uppercase">
                  FREE
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Delivery Method:</span>
                </span>
                <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {deliveryMethod === 'Motor Park Delivery' ? (
                    <span>
                      Motor Park Delivery {motorParkLocation ? `(${motorParkLocation})` : ''} — <strong className="text-emerald-700">FREE</strong>
                    </span>
                  ) : (
                    <span>
                      Doorstep Delivery {isLagos ? <strong className="text-emerald-700">(FREE in Lagos)</strong> : '(+₦5,000 Surcharge)'}
                    </span>
                  )}
                </span>
              </div>

              {deliveryMethod === 'Doorstep Delivery' && !isLagos && (
                <div className="flex items-center justify-between text-amber-900 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                  <span className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>Doorstep Delivery Surcharge (Extra Fee):</span>
                  </span>
                  <span className="font-mono font-extrabold tabular-nums">+₦5,000</span>
                </div>
              )}

              {deliveryMethod === 'Doorstep Delivery' && isLagos && (
                <div className="flex items-center justify-between text-emerald-900 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <span className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>Lagos Doorstep Delivery Waiver:</span>
                  </span>
                  <span className="font-mono font-extrabold tabular-nums text-emerald-700">FREE (₦0)</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">Estimated Total Payable on Delivery:</span>
                <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-blue-600 tabular-nums">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button with NATIONWIDE DELIVERY & Glowing/Blinking effect */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="action-glow w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <ShoppingBag className="w-5 h-5 text-white shrink-0" />
              <span>
                {isSubmitting
                  ? 'PROCESSING YOUR ORDER...'
                  : `ORDER NOW — NATIONWIDE DELIVERY (₦${total.toLocaleString()})`}
              </span>
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
              <span>·</span>
              <span className="text-emerald-700 font-bold">Free Nationwide Delivery</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
