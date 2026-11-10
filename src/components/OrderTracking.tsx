import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  lookupOrder,
  generateTrackingStatus,
  getStoredOrders,
  formatTrackingDate,
  TrackingResult
} from '../utils/orderTracking';
import { Order } from '../types';

interface OrderTrackingProps {
  initialOrderId?: string;
  onOrderClick?: () => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  initialOrderId = '',
  onOrderClick,
  isOpenAsModal = false,
  onCloseModal
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedWaybill, setCopiedWaybill] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load recent orders from localStorage
  useEffect(() => {
    const stored = getStoredOrders();
    setRecentOrders(stored.slice(0, 4));

    // If initialOrderId provided or exactly 1 order in storage and no query, auto-load
    if (initialOrderId) {
      handleSearch(initialOrderId);
    } else if (stored.length > 0 && !trackingResult) {
      // Auto-load most recent order for convenience
      handleSearch(stored[0].id);
    }
  }, [initialOrderId]);

  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || orderQuery).trim();
    if (!q) {
      setErrorMsg('Please enter your order reference number (e.g. MC-2612345)');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      // Small artificial latency (250ms) to feel like a real network/storage prober
      await new Promise((r) => setTimeout(r, 250));
      const result = await lookupOrder(q);
      setTrackingResult(result);
      setOrderQuery(result.orderId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not find tracking details for this order number');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!trackingResult) return;
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 400));
    const refreshed = generateTrackingStatus(trackingResult.order);
    setTrackingResult(refreshed);
    setIsRefreshing(false);
  };

  const handleSimulateNextStep = () => {
    if (!trackingResult) return;
    const nextStep = trackingResult.currentStep >= 5 ? 1 : trackingResult.currentStep + 1;
    const updated = generateTrackingStatus(trackingResult.order, nextStep);
    setTrackingResult(updated);
  };

  const copyToClipboard = (text: string, type: 'order' | 'waybill') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } else {
      setCopiedWaybill(true);
      setTimeout(() => setCopiedWaybill(false), 2000);
    }
  };

  const whatsappInquiryUrl = trackingResult
    ? `https://wa.me/2349136827730?text=${encodeURIComponent(
        `Hello Moonlight Crescent Logistics! I am tracking my order ${trackingResult.orderId} for the A-01 Smart Lock.\n\nCurrent Status: ${trackingResult.statusLabel}\nRecipient: ${trackingResult.order.fullName}\nDestination: ${trackingResult.destination}\n\nPlease share the latest delivery update. Thank you!`
      )}`
    : 'https://wa.me/2349136827730';

  const content = (
    <div className="w-full text-left">
      {/* Search Bar & Instructions */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 mb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Real-Time Order Tracking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Track Your Smart Lock Dispatch & Delivery
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Enter your order reference number to see real-time transit status, quality inspection results, and courier updates.
          </p>
        </div>

        {/* Input & Search Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="mt-5 flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => {
                setOrderQuery(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Enter Order Number e.g. MC-2656629"
              className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all uppercase tracking-wide font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-70"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Search className="w-4 h-4 text-white" />
            )}
            <span>{loading ? 'Searching...' : 'Track Order'}</span>
          </button>
        </form>

        {/* Recent Orders Quick Select Chips */}
        {recentOrders.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Recent Orders in this browser:</span>
            {recentOrders.map((ro) => (
              <button
                key={ro.id}
                type="button"
                onClick={() => {
                  setOrderQuery(ro.id);
                  handleSearch(ro.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  trackingResult?.orderId === ro.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
                }`}
              >
                {ro.id}
              </button>
            ))}
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Results View */}
      {trackingResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Status Header Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-blue-200/80 shadow-md p-5 sm:p-7 relative overflow-hidden">
            {/* Background accent glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 via-emerald-500/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                  <span>Order Reference</span>
                  <span aria-hidden="true">·</span>
                  <span>Placed {formatTrackingDate(trackingResult.order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-['Outfit'] font-mono text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-wider">
                    {trackingResult.orderId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(trackingResult.orderId, 'order')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Copy Order ID"
                    aria-label="Copy Order ID"
                  >
                    {copiedOrderId ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status Badge & Stage Simulator */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-extrabold tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{trackingResult.statusLabel}</span>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Ping courier network for live status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>

                {/* Simulated Progression Button */}
                <button
                  onClick={handleSimulateNextStep}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Simulate dispatch progressing to the next stage"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Advance Stage ({trackingResult.currentStep}/5)</span>
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="pt-6 sm:pt-8">
              <div className="relative">
                {/* Horizontal progress track (Desktop) */}
                <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full z-0">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${((trackingResult.currentStep - 1) / 4) * 100}%`
                    }}
                  />
                </div>

                {/* Stepper Nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                  {[
                    { step: 1, label: 'Order Logged', icon: Package },
                    { step: 2, label: 'Quality Checked', icon: ShieldCheck },
                    { step: 3, label: 'Dispatched', icon: Truck },
                    { step: 4, label: 'Out for Delivery', icon: Clock },
                    { step: 5, label: 'Delivered', icon: CheckCircle2 }
                  ].map((node) => {
                    const isDone = node.step <= trackingResult.currentStep;
                    const isCurrent = node.step === trackingResult.currentStep;
                    const IconComponent = node.icon;

                    return (
                      <div
                        key={node.step}
                        className={`flex flex-col items-center text-center p-3 sm:p-2 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-blue-50/80 border border-blue-200 sm:border-transparent sm:bg-transparent'
                            : ''
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-300 ${
                            isCurrent
                              ? 'bg-gradient-to-br from-blue-600 to-emerald-600 text-white ring-4 ring-blue-100 scale-110'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border-2 border-slate-200 text-slate-400'
                          }`}
                        >
                          {isDone ? (
                            <IconComponent className="w-5 h-5 text-white" />
                          ) : (
                            <span className="font-mono">{node.step}</span>
                          )}
                        </div>
                        <span
                          className={`mt-2 text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-blue-700 font-extrabold'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {node.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 font-medium block">Estimated Delivery</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {trackingResult.estimatedDelivery}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 font-medium block">Assigned Dispatch Fleet</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
                  {trackingResult.courierName}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 font-medium block">Tracking Waybill #</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {trackingResult.waybillNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(trackingResult.waybillNumber, 'waybill')}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] underline ml-2"
                  >
                    {copiedWaybill ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Split: Milestone Activity Log & Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Milestone Activity Timeline */}
            <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Dispatch & Delivery Timeline</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {trackingResult.timeline.map((event) => {
                  const isDone = event.completed;
                  const isCurrent = event.current;

                  return (
                    <div key={event.step} className="relative text-left">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[27px] sm:-left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCurrent
                            ? 'bg-blue-600 border-white ring-4 ring-blue-100 text-white'
                            : isDone
                            ? 'bg-emerald-600 border-white text-white'
                            : 'bg-white border-slate-300 text-slate-300'
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                      </div>

                      <div
                        className={`p-4 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-blue-50/60 border-blue-200 shadow-sm'
                            : isDone
                            ? 'bg-white border-slate-200/80'
                            : 'bg-slate-50/50 border-dashed border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <span
                            className={`font-bold text-sm ${
                              isCurrent ? 'text-blue-900' : isDone ? 'text-slate-900' : 'text-slate-500'
                            }`}
                          >
                            {event.title}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            {event.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Recipient & Order Breakdown */}
            <div className="space-y-6">
              {/* Order Item Details */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-3">
                  Consignment Contents
                </h4>

                <div className="space-y-3 text-xs divide-y divide-slate-100">
                  <div className="pt-1 flex justify-between items-start gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">
                        A-01 Deadbolt Smart Lock
                      </span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        3D Face Recognition · Palm Vein · 4.0" Interior Screen
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      x{trackingResult.order.quantity}
                    </span>
                  </div>

                  <div className="pt-2.5 flex justify-between">
                    <span className="text-slate-500">Delivery State:</span>
                    <span className="font-bold text-slate-900">{trackingResult.order.state}</span>
                  </div>

                  <div className="pt-2.5 flex justify-between">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-bold text-slate-900 text-right">
                      {trackingResult.order.deliveryMethod || 'Doorstep Delivery'}
                    </span>
                  </div>

                  <div className="pt-2.5 flex justify-between">
                    <span className="text-slate-500">Recipient:</span>
                    <span className="font-bold text-slate-900">{trackingResult.order.fullName}</span>
                  </div>

                  <div className="pt-2.5 flex justify-between">
                    <span className="text-slate-500">Destination:</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[170px] truncate">
                      {trackingResult.destination}
                    </span>
                  </div>

                  <div className="pt-2.5 flex justify-between items-center text-sm font-extrabold">
                    <span className="text-slate-900">Total Due on Delivery:</span>
                    <span className="text-blue-700 font-mono text-base tabular-nums">
                      ₦{trackingResult.order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Payment on Delivery: Inspect lock, screen, and keys with courier before payment.
                  </span>
                </div>
              </div>

              {/* Direct Help & Support Links */}
              <div className="bg-gradient-to-br from-[#0a192f] to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md">
                <h4 className="text-xs uppercase tracking-widest text-blue-400 font-extrabold mb-2">
                  Delivery Inquiries & Support
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Have questions about your arrival time or wish to reschedule delivery?
                </p>

                <div className="space-y-2.5">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Dispatch Desk</span>
                  </a>

                  <a
                    href="tel:09136827730"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call Support: 09136827730</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-slate-50 border-2 border-blue-200 rounded-3xl p-4 sm:p-8 shadow-2xl my-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              <h3 className="font-['Outfit'] text-xl font-extrabold text-slate-900">
                Order Tracking
              </h3>
            </div>
            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="tracking" className="py-14 sm:py-20 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
};
