import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, ShoppingBag, ShieldCheck, CheckCircle2, AlertCircle, Truck, MapPin, Building, Home, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Order, DeliveryFeesMap, PublicConfig } from '../types';
import { submitOrder } from '../services/api';
import { trackEvent } from '../services/tracking';
import { resolveImageUrl, handleImageFallback } from '../utils/imageHelper';
import {
  getMotorParksForState,
  isLagosState,
  calculateDoorstepFee,
  calculateMultiUnitDiscount
} from '../utils/delivery';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  nigerianStates: string[];
  deliveryFees?: DeliveryFeesMap;
  formspreeEndpoint?: string;
  images?: PublicConfig['galleryImages'];
  onOrderSuccess: (order: Order) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  price,
  nigerianStates,
  formspreeEndpoint = 'https://formspree.io/f/xbggbvjg',
  images = [],
  onOrderSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Lagos');
  const [deliveryMethod, setDeliveryMethod] = useState<'Motor Park Delivery' | 'Doorstep Delivery'>('Doorstep Delivery');
  const [motorParkLocation, setMotorParkLocation] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Slideshow state for Quick Order Form
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);

  // 15-second countdown timer when opened
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [isInteracting, setIsInteracting] = useState(false);
  const isFillingRef = useRef(false);

  // Fallback slides if none provided
  const modalSlides = images && images.length > 0 ? images : [
    { id: 'img-1', url: '/assets/aistudio/Neon_Smart_Lock_Security_Poster_0741352e.png', title: 'A-01 Smart Lock Master Presentation', subtitle: '₦180,000 Promo Price with 3D Face Recognition' },
    { id: 'img-2', url: '/assets/aistudio/image_42d449af.png', title: 'Multiple Unlocking Methods', subtitle: 'Palm Vein, 3D Face, Fingerprint, NFC & Passcode' },
    { id: 'img-3', url: '/assets/aistudio/image_d0f1a489.png', title: 'Video Intercom & 3D Face Scan', subtitle: 'Cat-eye infrared camera & Tuya App intercom' },
    { id: 'img-4', url: '/assets/aistudio/image_3e43ad8c.png', title: '0.5s Semiconductor Fingerprint', subtitle: '99.99% high-accuracy biometric unlock' }
  ];

  // Auto-advance slideshow every 3 seconds
  useEffect(() => {
    if (!isOpen || modalSlides.length <= 1 || !isSlideshowPlaying) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % modalSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, modalSlides.length, isSlideshowPlaying]);

  // Available motor parks for selected state
  const availableMotorParks = React.useMemo(() => getMotorParksForState(state), [state]);
  const isLagos = isLagosState(state);

  // Auto-switch to Doorstep Delivery when Lagos is selected (Park option removed for Lagos)
  useEffect(() => {
    if (isLagos && deliveryMethod === 'Motor Park Delivery') {
      setDeliveryMethod('Doorstep Delivery');
      setMotorParkLocation('');
    }
  }, [isLagos, deliveryMethod]);

  // Sync default motor park when state changes
  useEffect(() => {
    if (isLagos) {
      setDeliveryMethod('Doorstep Delivery');
      setMotorParkLocation('');
    } else if (availableMotorParks && availableMotorParks.length > 0) {
      if (!motorParkLocation || !availableMotorParks.includes(motorParkLocation)) {
        setMotorParkLocation(availableMotorParks[0]);
      }
    }
  }, [state, availableMotorParks, isLagos]);

  // Detect if customer has started filling the form
  const hasStartedFilling =
    isInteracting ||
    fullName.trim().length > 0 ||
    phone.trim().length > 0 ||
    deliveryAddress.trim().length > 0 ||
    notes.trim().length > 0;

  // Keep ref up to date without restarting interval
  useEffect(() => {
    isFillingRef.current = hasStartedFilling;
  }, [hasStartedFilling]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(15);
      setIsInteracting(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Handle countdown interval
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // Pause countdown if user is actively filling the form
      if (isFillingRef.current) return;

      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-close when countdown reaches 0 safely inside useEffect
  useEffect(() => {
    if (isOpen && secondsLeft === 0 && !hasStartedFilling) {
      onClose();
    }
  }, [isOpen, secondsLeft, hasStartedFilling, onClose]);

  // Track InitiateCheckout when modal opens
  useEffect(() => {
    if (isOpen) {
      trackEvent('InitiateCheckout', {
        content_name: 'A-01 Deadbolt Smart Lock (Quick Order Popup)',
        value: price,
        currency: 'NGN',
        num_items: 1
      });
    }
  }, [isOpen, price]);

  // Calculations
  const subtotal = price * quantity;
  const discount = calculateMultiUnitDiscount(quantity);
  const doorstepFee = calculateDoorstepFee(state, deliveryMethod);
  const total = subtotal - discount + doorstepFee;

  const handleInteraction = () => {
    if (!isInteracting) {
      setIsInteracting(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    const sanitizedPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!sanitizedPhone || sanitizedPhone.length < 8) {
      setErrorMessage('Please enter a valid Nigerian phone number');
      return;
    }

    const chosenTerminal = motorParkLocation || (availableMotorParks[0] || 'Central Motor Park Terminal');
    const effectiveDeliveryAddress = deliveryMethod === 'Motor Park Delivery'
      ? `${chosenTerminal} Motor Park Terminal, ${state}`
      : deliveryAddress.trim();

    if (deliveryMethod === 'Doorstep Delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide your complete doorstep delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await submitOrder({
        fullName: fullName.trim(),
        phone: sanitizedPhone,
        whatsapp: sanitizedPhone,
        state,
        deliveryMethod,
        motorParkLocation: deliveryMethod === 'Motor Park Delivery' ? chosenTerminal : undefined,
        deliveryAddress: effectiveDeliveryAddress,
        quantity,
        notes: notes.trim() ? notes.trim() : undefined
      });

      // Track confirmed purchase for Meta Pixel
      trackEvent(
        'Purchase',
        {
          orderId: order.id,
          value: order.total,
          currency: 'NGN',
          num_items: order.quantity,
          content_name: 'A-01 Deadbolt Type Smart Lock (Quick Order)'
        },
        { eventId: order.id }
      );

      // Dispatch secondary client Formspree notification to ensure email delivery
      fetch(formspreeEndpoint || 'https://formspree.io/f/xbggbvjg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `⚡ Quick Order #${order.id} - ₦${order.total.toLocaleString()} (${fullName.trim()})`,
          orderReference: order.id,
          customerName: fullName.trim(),
          phoneNumber: phone.trim(),
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
          orderSource: 'Quick Order Popup',
          orderTimestamp: new Date().toLocaleString()
        })
      }).catch((e) => console.log('Client Formspree dispatch:', e));

      onOrderSuccess(order);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit quick order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-order-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/70 rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-950/50 text-white overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top 15-second countdown banner & progress bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border-b border-emerald-500/30 p-2.5 sm:p-3 flex items-center justify-between gap-1.5 sm:gap-2 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1 font-bold truncate">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-emerald-300 uppercase tracking-wider text-[10px] sm:text-[11px] truncate">Quick Order</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {hasStartedFilling ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-bold border border-emerald-500/40">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Timer paused</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-[11px] font-bold border border-amber-500/40">
                <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                <span>Auto-closing {secondsLeft}s</span>
              </span>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Quick Order"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shrunk countdown visual bar */}
        {!hasStartedFilling && (
          <div className="w-full bg-slate-800 h-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-blue-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(secondsLeft / 15) * 100}%` }}
            />
          </div>
        )}

        {/* Form Body with embedded High-Definition Product Slideshow */}
        <div className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 max-h-[82vh] overflow-y-auto custom-scrollbar">
          {/* Compact Slideshow Component */}
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-emerald-500/40 shadow-md group">
            {/* Slide Stage with reduced height */}
            <div className="relative h-28 sm:h-36 w-full flex items-center justify-center bg-slate-950 p-1.5 overflow-hidden">
              <img
                src={resolveImageUrl(modalSlides[slideIndex]?.url)}
                alt={modalSlides[slideIndex]?.title || 'A-01 Smart Lock'}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={handleImageFallback}
              />

              {/* Prev / Next Carousel Controls */}
              <button
                type="button"
                onClick={() => setSlideIndex((prev) => (prev - 1 + modalSlides.length) % modalSlides.length)}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white border border-slate-700 transition-all cursor-pointer shadow-md opacity-80 hover:opacity-100"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setSlideIndex((prev) => (prev + 1) % modalSlides.length)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white border border-slate-700 transition-all cursor-pointer shadow-md opacity-80 hover:opacity-100"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Top status bar on slide: counter & play/pause */}
              <div className="absolute top-1.5 inset-x-2 flex items-center justify-between text-[9px] font-mono pointer-events-none">
                <span className="px-1.5 py-0.5 rounded bg-slate-900/90 text-emerald-300 font-bold border border-emerald-500/30 shadow-md">
                  Photo {slideIndex + 1}/{modalSlides.length}
                </span>

                <button
                  type="button"
                  onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                  className="pointer-events-auto px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-300 hover:text-white font-sans font-bold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer text-[9px]"
                  title={isSlideshowPlaying ? 'Pause Slideshow' : 'Resume Slideshow'}
                >
                  {isSlideshowPlaying ? (
                    <>
                      <Pause className="w-2.5 h-2.5 text-emerald-400" />
                      <span>ON</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 text-amber-400" />
                      <span>Paused</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom slide caption overlay */}
              <div className="absolute bottom-0 inset-x-0 px-2 py-1 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent text-left pointer-events-none">
                <span className="text-white text-[11px] font-bold block truncate">
                  {modalSlides[slideIndex]?.title}
                </span>
              </div>
            </div>

            {/* Slide Dot Indicators */}
            <div className="flex items-center justify-center gap-1 py-1 bg-slate-950/90 border-t border-slate-800">
              {modalSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSlideIndex(idx)}
                  className={`h-1 rounded-full transition-all cursor-pointer ${
                    idx === slideIndex
                      ? 'w-4 bg-emerald-400'
                      : 'w-1 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            onFocus={handleInteraction}
            onClick={handleInteraction}
            onKeyDown={handleInteraction}
            className="space-y-4"
          >
            <div className="text-left">
              <h3 id="quick-order-title" className="font-['Outfit'] text-lg sm:text-xl font-extrabold text-white flex items-center justify-between">
                <span>A-01 Deadbolt Smart Lock</span>
                <span className="text-emerald-400 tabular-nums">₦{price.toLocaleString()}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Includes Contactless Palm Vein, 3D Face Camera, 4.0" Screen, Fingerprint & Pay on Delivery nationwide.
              </p>
            </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Full Name & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Your Full Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  handleInteraction();
                }}
                placeholder="e.g. Adebayo Johnson"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Active Phone / WhatsApp <span className="text-emerald-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  handleInteraction();
                }}
                placeholder="e.g. 0801 234 5678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* State Selection */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Delivery State <span className="text-emerald-400">*</span>
            </label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                handleInteraction();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            >
              {nigerianStates.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Method Choice (Park option removed for Lagos per user instruction) */}
          <div className="text-left space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">
              {isLagos ? 'Delivery Method for Lagos' : 'Delivery Method Preference'} <span className="text-emerald-400">*</span>
            </label>
            {isLagos ? (
              <div className="p-3 rounded-xl border bg-emerald-950/40 border-emerald-500/60 flex items-start gap-2.5">
                <Home className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold text-white">Direct Doorstep Delivery</div>
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-700">
                      FREE in Lagos
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Orders in Lagos State are delivered straight to your home or office with ₦0 delivery fee!
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod('Motor Park Delivery');
                    handleInteraction();
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    deliveryMethod === 'Motor Park Delivery'
                      ? 'bg-blue-950/80 border-emerald-400 ring-1 ring-emerald-400 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-white">Motor Park Delivery</div>
                    <div className="text-[11px] text-emerald-400 font-bold">100% FREE Nationwide</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Pick up at transit park terminal</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod('Doorstep Delivery');
                    handleInteraction();
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    deliveryMethod === 'Doorstep Delivery'
                      ? 'bg-blue-950/80 border-emerald-400 ring-1 ring-emerald-400 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Home className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-white">Doorstep Home Delivery</div>
                    <div className="text-[11px] font-bold text-amber-300">+₦5,000 extra fee</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Delivered to your house / office</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Conditional Address or Motor Park Selector based on user rule:
              "IF SOMEONE PICKS A MOTOR PARK DELIVERY DONT GIVE THEM OPTION TO FILL ADDRESS AGAIN" */}
          {!isLagos && deliveryMethod === 'Motor Park Delivery' ? (
            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-left">
              <label className="block text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span>Select Motor Park Terminal in {state}</span>
              </label>
              <select
                value={motorParkLocation}
                onChange={(e) => {
                  setMotorParkLocation(e.target.value);
                  handleInteraction();
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
              >
                {availableMotorParks.map((park) => (
                  <option key={park} value={park} className="bg-slate-900 text-white">
                    {park} Terminal
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                ✓ No street address required. You inspect and pay upon receiving your package at the terminal.
              </p>
            </div>
          ) : (
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Doorstep Delivery Address <span className="text-emerald-400">*</span></span>
              </label>
              <textarea
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => {
                  setDeliveryAddress(e.target.value);
                  handleInteraction();
                }}
                placeholder="Street address, house/flat number, landmark, city"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>
          )}

          {/* Quantity Selector & Multi-Item Discount */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-left">
              <span className="text-xs font-bold text-white block">Quantity Needed</span>
              <span className="text-[11px] text-emerald-400 font-medium">
                {quantity > 1 ? `₦5,000 multi-item discount active!` : `Add 1 more to save ₦5,000`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuantity((q) => Math.max(1, q - 1));
                  handleInteraction();
                }}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => {
                  setQuantity((q) => q + 1);
                  handleInteraction();
                }}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Order Summary & Total */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-slate-950 to-blue-950 border border-slate-800 text-left space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal ({quantity} lock{quantity > 1 ? 's' : ''}):</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Multi-Item Discount:</span>
                <span>-₦{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Delivery Fee:</span>
              <span className={doorstepFee === 0 ? 'text-emerald-400 font-bold' : ''}>
                {doorstepFee === 0 ? 'FREE' : `₦${doorstepFee.toLocaleString()}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm">
              <span className="text-white">Total on Delivery:</span>
              <span className="font-['Outfit'] text-lg text-emerald-400">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="action-glow w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-blue-600 to-emerald-600 hover:from-emerald-600 hover:to-blue-700 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>
                {isSubmitting ? 'PROCESSING QUICK ORDER...' : `CONFIRM ORDER — ₦${total.toLocaleString()}`}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Pay on Delivery · 1-Year Warranty · Instant Confirmation</span>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
