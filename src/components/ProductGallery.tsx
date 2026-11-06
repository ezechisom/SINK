import React, { useState, useEffect } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Sparkles, LayoutGrid, Eye, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PublicConfig } from '../types';

interface ProductGalleryProps {
  images: PublicConfig['galleryImages'];
}

type GalleryCategory = 'all' | 'overview' | 'biometric' | 'smart' | 'hardware';

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'spotlight'>('grid');

  // Assign category tags to images
  const getCategoryForImage = (id: string, title: string): GalleryCategory => {
    const lower = (id + ' ' + title).toLowerCase();
    if (lower.includes('poster') || lower.includes('price') || lower.includes('master')) return 'overview';
    if (lower.includes('fingerprint') || lower.includes('password') || lower.includes('pin') || lower.includes('biometric')) return 'biometric';
    if (lower.includes('intercom') || lower.includes('app') || lower.includes('multi-access') || lower.includes('face')) return 'smart';
    return 'hardware';
  };

  const categorizedImages = images.map((img) => ({
    ...img,
    category: getCategoryForImage(img.id, img.title)
  }));

  const filteredImages = activeFilter === 'all'
    ? categorizedImages
    : categorizedImages.filter((img) => img.category === activeFilter);

  const activeImage = images[selectedIndex] || images[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightboxForImage = (indexInAllImages: number) => {
    setSelectedIndex(indexInAllImages);
    setIsLightboxOpen(true);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-blue-900/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-xs font-extrabold text-blue-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>OFFICIAL PRODUCT PHOTOGRAPHY</span>
            <span aria-hidden="true" className="text-blue-500">·</span>
            <span>{images.length} HIGH-DEFINITION SHOTS</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            A-01 SMART LOCK PHOTO GALLERY &amp; LOOKBOOK
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Examine high-definition photos of the ₦180,000 master presentation, 3D face camera with video intercom, 0.5s semiconductor fingerprint sensor, anti-peep keypad, 3200mAh battery, hardware anatomy, package inclusions, and 24*240 mm mortise dimensions.
          </p>
        </div>

        {/* Controls Toolbar: Categories Filter & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all' as const, label: `All Photos (${images.length})` },
              { id: 'overview' as const, label: 'Master & Price' },
              { id: 'smart' as const, label: 'Video Intercom & App' },
              { id: 'biometric' as const, label: 'Fingerprint & PIN' },
              { id: 'hardware' as const, label: 'Hardware & Mortise' }
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Grid vs Spotlight */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Full Grid</span>
            </button>
            <button
              onClick={() => setViewMode('spotlight')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'spotlight'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Spotlight</span>
            </button>
          </div>
        </div>

        {/* VIEW MODE 1: FULL RESPONSIVE PHOTO GRID */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredImages.map((img) => {
              const originalIndex = images.findIndex((i) => i.id === img.id);
              const isMaster = img.id === 'img-master-poster';

              return (
                <div
                  key={img.id}
                  className={`group relative rounded-3xl overflow-hidden bg-slate-950 border-2 transition-all duration-300 flex flex-col text-left shadow-xl ${
                    isMaster
                      ? 'border-emerald-500/60 shadow-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-blue-900/40 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/30'
                  }`}
                >
                  {/* Photo Display Container - Pure untouched uncropped object-contain */}
                  <div className="relative aspect-square sm:aspect-[4/3] bg-slate-950 overflow-hidden flex items-center justify-center p-3 sm:p-5">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Badge top-left */}
                    <div className="absolute top-3 left-3">
                      {isMaster ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Promo ₦180,000</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/90 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold uppercase shadow-md">
                          Photo #{originalIndex + 1}
                        </span>
                      )}
                    </div>

                    {/* Tap to Zoom Button overlay */}
                    <button
                      onClick={() => openLightboxForImage(originalIndex)}
                      className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-600 text-white border border-slate-700/60 transition-all opacity-85 group-hover:opacity-100 shadow-md cursor-pointer"
                      title="View Full Resolution"
                      aria-label="Enlarge Photo"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Description & Quick Action */}
                  <div className="p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-t border-slate-800 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {img.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        {img.subtitle}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <button
                        onClick={() => openLightboxForImage(originalIndex)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-800 hover:border-blue-500 transition-all cursor-pointer"
                      >
                        <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect Full Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MODE 2: SPOTLIGHT INSPECTOR WITH THUMBNAIL FILMSTRIP */}
        {viewMode === 'spotlight' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Stage Large Viewer */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-blue-500/50 shadow-2xl shadow-blue-950/40 aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center p-4 sm:p-6 group">
                <img
                  src={activeImage.url}
                  alt={activeImage.title}
                  className="w-full h-full object-contain transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Enlarge trigger */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-600 text-white border border-blue-400/30 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-lg"
                  title="Open Fullscreen Lightbox"
                >
                  <ZoomIn className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Tap to Zoom</span>
                </button>

                {/* Left / Right Carousel Controls */}
                <button
                  onClick={handlePrev}
                  aria-label="Previous Image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white shadow-lg border border-slate-700 transition-all opacity-85 hover:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next Image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white shadow-lg border border-slate-700 transition-all opacity-85 hover:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Spotlight Overlay Caption */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col justify-end text-left">
                  <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                    Photo {selectedIndex + 1} of {images.length} · A-01 Genuine Capture
                  </span>
                  <h3 className="text-base sm:text-xl font-bold text-white mt-1">
                    {activeImage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    {activeImage.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Column */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span className="text-xs uppercase font-extrabold text-blue-400 tracking-wider text-left">
                Select Photo to Inspect ({images.length} Available):
              </span>
              <div className="max-h-[500px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                {images.map((img, idx) => {
                  const isCurrent = idx === selectedIndex;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-950/80 border-2 border-emerald-400 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-950 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-900'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-16 h-14 rounded-xl object-contain bg-slate-900 p-1 shrink-0 border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col min-w-0 pr-1">
                        <span className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-emerald-300' : 'text-white'}`}>
                          {img.title}
                        </span>
                        <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {img.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* High-Definition Inspection Note */}
              <div className="mt-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-left">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                    High-Definition Product Photography
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Tap any photo or zoom to inspect lock craftsmanship
                  </span>
                </div>
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enlarge</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-950/80 border border-blue-900/40 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                Authentic High-Security Hardware Guaranteed
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Every photo represents the actual physical A-01 lockset delivered to your doorstep or transit park.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold">
              ✓ Free Nationwide Delivery
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              ✓ Pay on Delivery
            </span>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Lightbox Top Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-emerald-400 font-bold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                Photo {selectedIndex + 1} of {images.length}
              </span>
              <span className="hidden sm:inline text-xs text-slate-300 font-semibold truncate max-w-md">
                {activeImage.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Stage */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2 overflow-hidden">
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-blue-500/30"
              referrerPolicy="no-referrer"
            />

            {/* Prev / Next Buttons */}
            <button
              onClick={handlePrev}
              aria-label="Previous Image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white shadow-2xl border border-slate-700 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white shadow-2xl border border-slate-700 transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Bottom Caption Bar */}
          <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
            <h4 className="text-base sm:text-lg font-bold text-white">
              {activeImage.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {activeImage.subtitle}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
