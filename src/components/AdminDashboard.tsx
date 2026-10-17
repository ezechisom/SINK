import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  ShoppingBag,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  DollarSign,
  Settings,
  Image as ImageIcon,
  Star,
  RefreshCw,
  Search,
  Filter,
  Save,
  Plus
} from 'lucide-react';
import { Order, PublicConfig, StoreSettings, DeliveryFeesMap, CustomerReview, SpecificationItem } from '../types';
import {
  adminLogin,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminDeleteOrder,
  adminUpdateSettings,
  adminUpdateDeliveryFees,
  adminManageReviews,
  adminUpdateSpecifications,
  adminUpdateMedia
} from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  publicConfig: PublicConfig;
  onConfigUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  publicConfig,
  onConfigUpdated
}) => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('mc_admin_token'));
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'settings' | 'fees' | 'reviews' | 'media' | 'specs'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    dispatchedOrders: 0,
    deliveredOrders: 0
  });
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(publicConfig.settings);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  // Delivery Fees State
  const [deliveryFees, setDeliveryFees] = useState<DeliveryFeesMap>(publicConfig.deliveryFees);
  const [feesSuccess, setFeesSuccess] = useState<string | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>(publicConfig.reviews);
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: '',
    verified: true
  });
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  // Media State
  const [galleryImages, setGalleryImages] = useState(publicConfig.galleryImages);
  const [videoUrl, setVideoUrl] = useState(publicConfig.settings.videoEmbedUrl || '');
  const [videoTitle, setVideoTitle] = useState(publicConfig.settings.videoTitle || '');
  const [videoDesc, setVideoDesc] = useState(publicConfig.settings.videoDescription || '');
  const [mediaSuccess, setMediaSuccess] = useState<string | null>(null);

  // Specifications State
  const [specList, setSpecList] = useState<SpecificationItem[]>(publicConfig.specifications);
  const [inclusions, setInclusions] = useState<string[]>(publicConfig.includedItems);
  const [specsSuccess, setSpecsSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      const receivedToken = await adminLogin(passwordInput);
      setToken(receivedToken);
      sessionStorage.setItem('mc_admin_token', receivedToken);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('mc_admin_token');
  };

  const loadOrders = async () => {
    if (!token) return;
    setIsLoadingOrders(true);
    try {
      const data = await adminGetOrders(token);
      setOrders(data.orders);
      setStats(data.stats);
    } catch (err: any) {
      if (err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      await adminUpdateOrderStatus(token, orderId, newStatus);
      loadOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      await adminDeleteOrder(token, orderId);
      loadOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportCsv = () => {
    if (!token) return;
    // Download directly via API route
    window.open(`/api/admin/orders/export`, '_blank');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await adminUpdateSettings(token, storeSettings, newAdminPassword || undefined);
      setSettingsSuccess('Settings successfully updated!');
      setNewAdminPassword('');
      onConfigUpdated();
      setTimeout(() => setSettingsSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveDeliveryFees = async () => {
    if (!token) return;
    try {
      await adminUpdateDeliveryFees(token, deliveryFees);
      setFeesSuccess('Delivery fees updated!');
      onConfigUpdated();
      setTimeout(() => setFeesSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newReview.name || !newReview.comment) return;
    try {
      const updated = await adminManageReviews(token, { action: 'add', review: newReview });
      setReviews(updated);
      setNewReview({ name: '', location: '', rating: 5, comment: '', verified: true });
      setReviewSuccess('Review added successfully!');
      onConfigUpdated();
      setTimeout(() => setReviewSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!token) return;
    if (!window.confirm('Delete this review?')) return;
    try {
      const updated = await adminManageReviews(token, { action: 'delete', reviewId });
      setReviews(updated);
      onConfigUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveMedia = async () => {
    if (!token) return;
    try {
      await adminUpdateMedia(token, {
        galleryImages,
        videoEmbedUrl: videoUrl,
        videoTitle,
        videoDescription: videoDesc
      });
      setMediaSuccess('Gallery and video settings saved!');
      onConfigUpdated();
      setTimeout(() => setMediaSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveSpecs = async () => {
    if (!token) return;
    try {
      await adminUpdateSpecifications(token, specList, inclusions);
      setSpecsSuccess('Specifications and package items saved!');
      onConfigUpdated();
      setTimeout(() => setSpecsSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isOpen) return null;

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = statusFilter === 'ALL' || o.status === statusFilter;
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.fullName.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.state.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#0f111a] border border-white/15 rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl text-left">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#141724] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Smart Kitchen Workstation Store Administration
              </h2>
              <span className="text-xs text-slate-400">
                Order fulfillment, price control, delivery settings & catalog
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!token ? (
          /* Authentication Form */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#171a29] border border-white/10 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white text-center">Store Manager Access</h3>
              <p className="text-xs text-slate-400 text-center mt-1 mb-6">
                Enter your administrative key to view live customer orders and update prices.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    {authError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password (default: moonlight2026)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-md transition-all disabled:opacity-50"
                >
                  {isLoggingIn ? 'Verifying...' : 'Unlock Dashboard'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard Layout */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-[#131623] border-b md:border-b-0 md:border-r border-white/10 p-3 sm:p-4 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap ${
                  activeTab === 'orders' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap ${
                  activeTab === 'settings' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Pricing & Store</span>
              </button>

              <button
                onClick={() => setActiveTab('fees')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap ${
                  activeTab === 'fees' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Truck className="w-4 h-4 shrink-0" />
                <span>Delivery Fees</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap ${
                  activeTab === 'reviews' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Star className="w-4 h-4 shrink-0" />
                <span>Customer Reviews</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap ${
                  activeTab === 'media' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Gallery & Video</span>
              </button>

              <button
                onClick={() => setActiveTab('specs')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors whitespace-nowrap ${
                  activeTab === 'specs' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <DollarSign className="w-4 h-4 shrink-0" />
                <span>Specs & Package</span>
              </button>
            </div>

            {/* Main Tab Panel */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* KPI Statistics Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#171a29] border border-white/10">
                      <span className="text-xs text-slate-400 block">Total Orders</span>
                      <span className="text-2xl font-bold text-white font-mono">{stats.totalOrders}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#171a29] border border-white/10">
                      <span className="text-xs text-slate-400 block">Total Revenue</span>
                      <span className="text-xl font-bold text-amber-400 font-mono">
                        ₦{stats.totalRevenue.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#171a29] border border-white/10">
                      <span className="text-xs text-slate-400 block">Pending Verification</span>
                      <span className="text-2xl font-bold text-amber-300 font-mono">{stats.pendingOrders}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#171a29] border border-white/10">
                      <span className="text-xs text-slate-400 block">Delivered Orders</span>
                      <span className="text-2xl font-bold text-emerald-400 font-mono">{stats.deliveredOrders}</span>
                    </div>
                  </div>

                  {/* Filter & Action Toolbar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#141724] p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by order ID, name, phone, city..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={loadOrders}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Refresh orders"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={handleExportCsv}
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-[#141724] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-[#1a1d2e] text-slate-400 font-semibold border-b border-white/10">
                          <tr>
                            <th className="p-3.5">Reference</th>
                            <th className="p-3.5">Customer & Phone</th>
                            <th className="p-3.5">Location & Address</th>
                            <th className="p-3.5">Qty / Total</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-500">
                                No orders matching the current filter or search criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((ord) => (
                              <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-3.5 font-mono text-amber-300 font-bold whitespace-nowrap">
                                  {ord.id}
                                  <div className="text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                                    {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <div className="font-semibold text-white">{ord.fullName}</div>
                                  <div className="text-slate-400 font-mono mt-0.5">{ord.phone}</div>
                                  {ord.whatsapp && ord.whatsapp !== ord.phone && (
                                    <div className="text-[10px] text-emerald-400 font-mono">WA: {ord.whatsapp}</div>
                                  )}
                                </td>

                                <td className="p-3.5 max-w-xs">
                                  <div className="font-medium text-slate-200">{ord.city}, {ord.state}</div>
                                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{ord.deliveryAddress}</div>
                                  {ord.notes && (
                                    <div className="text-[10px] text-amber-400/80 italic mt-0.5">"{ord.notes}"</div>
                                  )}
                                </td>

                                <td className="p-3.5 whitespace-nowrap">
                                  <div className="font-mono text-white font-semibold">
                                    {ord.quantity} × ₦{ord.unitPrice.toLocaleString()}
                                  </div>
                                  <div className="text-amber-400 font-bold font-['Outfit'] text-sm tabular-nums mt-0.5">
                                    Total: ₦{ord.total.toLocaleString()}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    Fee: {ord.deliveryFee !== null ? `₦${ord.deliveryFee.toLocaleString()}` : 'TBC'}
                                  </div>
                                </td>

                                <td className="p-3.5 whitespace-nowrap">
                                  <select
                                    value={ord.status}
                                    onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                                    className={`px-2 py-1 rounded text-xs font-semibold focus:outline-none border ${
                                      ord.status === 'Delivered'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : ord.status === 'Dispatched'
                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                        : ord.status === 'Confirmed'
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                        : ord.status === 'Cancelled'
                                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    }`}
                                  >
                                    <option value="Pending" className="bg-[#12141f] text-white">Pending</option>
                                    <option value="Confirmed" className="bg-[#12141f] text-white">Confirmed</option>
                                    <option value="Dispatched" className="bg-[#12141f] text-white">Dispatched</option>
                                    <option value="Delivered" className="bg-[#12141f] text-white">Delivered</option>
                                    <option value="Cancelled" className="bg-[#12141f] text-white">Cancelled</option>
                                  </select>
                                </td>

                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => handleDeleteOrder(ord.id)}
                                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                    title="Delete order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STORE SETTINGS & PRICING */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Store Details & Pricing</h3>
                    {settingsSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold">{settingsSuccess}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Product Selling Price (NGN)
                      </label>
                      <input
                        type="number"
                        value={storeSettings.sellingPrice}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, sellingPrice: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-amber-400 font-bold font-mono text-base focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp Contact Phone (For Floating Button & Prefilled Orders)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +2348148902341"
                      value={storeSettings.whatsappNumber}
                      onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Support Telephone
                      </label>
                      <input
                        type="text"
                        value={storeSettings.supportPhone}
                        onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={storeSettings.supportEmail}
                        onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Tracking Pixels Configuration */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white">Marketing & Conversion Tracking Pixels</h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Meta (Facebook) Pixel ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 123456789012345"
                        value={storeSettings.pixels?.metaPixelId || ''}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            pixels: { ...storeSettings.pixels, metaPixelId: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        TikTok Pixel ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CXXXXXXXXXXXXXX"
                        value={storeSettings.pixels?.tikTokPixelId || ''}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            pixels: { ...storeSettings.pixels, tikTokPixelId: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Google Analytics Measurement ID (GA4)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. G-XXXXXXXXXX"
                        value={storeSettings.pixels?.googleAnalyticsId || ''}
                        onChange={(e) =>
                          setStoreSettings({
                            ...storeSettings,
                            pixels: { ...storeSettings.pixels, googleAnalyticsId: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Change Admin Password */}
                  <div className="pt-4 border-t border-white/10">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Change Admin Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </button>
                </form>
              )}

              {/* TAB 3: DELIVERY FEES */}
              {activeTab === 'fees' && (
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Delivery Fees by Nigerian State</h3>
                      <p className="text-xs text-slate-400">
                        Enter fee in Naira (₦), or clear the box to mark as "Delivery fee to be confirmed".
                      </p>
                    </div>
                    {feesSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold">{feesSuccess}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {publicConfig.nigerianStates ? (
                      Object.keys(deliveryFees).sort().map((stateName) => {
                        const fee = deliveryFees[stateName];
                        return (
                          <div key={stateName} className="p-3 rounded-xl bg-[#141724] border border-white/10 flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-slate-200 truncate">{stateName}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-xs text-slate-500">₦</span>
                              <input
                                type="number"
                                placeholder="TBC"
                                value={fee === null ? '' : fee}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                                  setDeliveryFees({ ...deliveryFees, [stateName]: val });
                                }}
                                className="w-24 px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-white text-xs font-mono tabular-nums text-right focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : null}
                  </div>

                  <button
                    onClick={handleSaveDeliveryFees}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Delivery Fees</span>
                  </button>
                </div>
              )}

              {/* TAB 4: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Manage Customer Reviews</h3>
                      <p className="text-xs text-slate-400">
                        Add verified reviews from real Nigerian customers who have installed the sink.
                      </p>
                    </div>
                    {reviewSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold">{reviewSuccess}</span>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="p-4 rounded-xl bg-[#141724] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Add Genuine Customer Review</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Customer Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chief Kenneth Nnamdi"
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Victoria Island, Lagos"
                          value={newReview.location}
                          onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Rating</label>
                        <select
                          value={newReview.rating}
                          onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Customer Feedback Description</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Detailed feedback regarding the waterfall faucet, glass rinser, installation, etc."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newReview.verified}
                          onChange={(e) => setNewReview({ ...newReview, verified: e.target.checked })}
                          className="rounded text-amber-500"
                        />
                        <span>Mark as Verified Purchase</span>
                      </label>

                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Review</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Reviews List */}
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl bg-[#141724] border border-white/10 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{rev.name}</span>
                            <span className="text-xs text-slate-400">· {rev.location}</span>
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Verified</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1 italic">"{rev.comment}"</p>
                          <span className="text-[10px] text-slate-500 block mt-1">Date: {rev.date}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors shrink-0"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: GALLERY & VIDEO */}
              {activeTab === 'media' && (
                <div className="space-y-6 text-left max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Product Gallery & Demonstration Video</h3>
                      <p className="text-xs text-slate-400">
                        Configure the images shown in the product showcase and set custom product demonstration video.
                      </p>
                    </div>
                    {mediaSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold">{mediaSuccess}</span>
                    )}
                  </div>

                  {/* Demonstration Video Settings */}
                  <div className="p-4 rounded-xl bg-[#141724] border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Product Demonstration Video</h4>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Video Embed URL (YouTube embed, Vimeo, or direct MP4 link; leave blank for built-in interactive showcase)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. https://www.youtube.com/embed/YOUR_VIDEO_ID"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Video Title</label>
                        <input
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Video Description</label>
                        <input
                          type="text"
                          value={videoDesc}
                          onChange={(e) => setVideoDesc(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gallery Items */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Product Angles & Photographs</h4>
                    {galleryImages.map((img, idx) => (
                      <div key={img.id} className="p-4 rounded-xl bg-[#141724] border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-2">
                          <img src={img.url} alt={img.title} className="w-16 h-14 rounded-lg object-cover" />
                        </div>
                        <div className="sm:col-span-10 space-y-2">
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={img.url}
                            onChange={(e) => {
                              const updated = [...galleryImages];
                              updated[idx].url = e.target.value;
                              setGalleryImages(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs font-mono"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Title"
                              value={img.title}
                              onChange={(e) => {
                                const updated = [...galleryImages];
                                updated[idx].title = e.target.value;
                                setGalleryImages(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Subtitle"
                              value={img.subtitle}
                              onChange={(e) => {
                                const updated = [...galleryImages];
                                updated[idx].subtitle = e.target.value;
                                setGalleryImages(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveMedia}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Gallery & Video Settings</span>
                  </button>
                </div>
              )}

              {/* TAB 6: SPECIFICATIONS & PACKAGE */}
              {activeTab === 'specs' && (
                <div className="space-y-6 text-left max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Technical Specifications & Box Package</h3>
                      <p className="text-xs text-slate-400">
                        Customize dimensions, materials, and package items.
                      </p>
                    </div>
                    {specsSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold">{specsSuccess}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Specifications Table</h4>
                    {specList.map((spec, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-[#141724] p-2.5 rounded-lg border border-white/5">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => {
                            const updated = [...specList];
                            updated[idx].label = e.target.value;
                            setSpecList(updated);
                          }}
                          className="sm:col-span-4 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs font-medium"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const updated = [...specList];
                            updated[idx].value = e.target.value;
                            setSpecList(updated);
                          }}
                          className="sm:col-span-8 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Included Package Contents</h4>
                    {inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const updated = [...inclusions];
                            updated[idx] = e.target.value;
                            setInclusions(updated);
                          }}
                          className="flex-1 px-3 py-2 rounded-lg bg-[#141724] border border-white/15 text-white text-xs"
                        />
                        <button
                          onClick={() => setInclusions(inclusions.filter((_, i) => i !== idx))}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setInclusions([...inclusions, 'New package item'])}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Box Item</span>
                    </button>
                  </div>

                  <button
                    onClick={handleSaveSpecs}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Specifications</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
