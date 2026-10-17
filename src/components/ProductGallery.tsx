import React, { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { PublicConfig } from '../types';

interface ProductGalleryProps {
  images: PublicConfig['galleryImages'];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const activeImage = images[selectedIndex] || images[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-slate-50 border-b border-blue-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">
            <span>High-Definition Photography</span>
            <span aria-hidden="true" className="text-blue-300">·</span>
            <span>75 × 45 cm Standard Fit</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            High-Definition Product Showcase
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Inspect every angle: the 4 piano water keys, internal hydroelectric LED display, flying rain dual waterfall, and complete multi-level workstation accessories.
          </p>
        </div>

        {/* Gallery Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Large Viewer */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative rounded-3xl overflow-hidden bg-white border-2 border-blue-200 shadow-xl group aspect-[4/3] sm:aspect-[16/10]">
              <img
                src={activeImage.url}
                alt={activeImage.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-blue-200 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-lg"
                title="Tap to zoom"
              >
                <ZoomIn className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Tap to Zoom</span>
              </button>

              {/* Prev / Next navigation */}
              <button
                onClick={handlePrev}
                aria-label="Previous Image"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md border border-blue-200 transition-all opacity-85 hover:opacity-100 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Image"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md border border-blue-200 transition-all opacity-85 hover:opacity-100 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </button>

              {/* Caption Bar */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col justify-end text-left">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Angle {selectedIndex + 1} of {images.length} · 750 × 450 mm
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {activeImage.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                  {activeImage.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Thumbnails & Detail Callout Column */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider text-left">
              Select Product Angle:
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {images.map((img, idx) => {
                const isCurrent = idx === selectedIndex;
                return (
                  <button
                    key={img.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-md shadow-blue-500/10'
                        : 'bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-blue-700' : 'text-slate-900'}`}>
                        {img.title}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {img.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* In-box accessories badge */}
            <div className="mt-4 p-5 rounded-2xl bg-white border border-blue-200 shadow-sm text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Complete Workstation Kit Included</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every unit arrives complete with the solid wood cutting board, stainless colander, triangular prep basin, high-pressure glass rinser, and all standard Nigerian 1/2" plumbing drain fittings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tap-to-Zoom Fullscreen Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Zoom View"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-blue-400/40"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center">
              <h4 className="text-lg font-bold text-white">{activeImage.title}</h4>
              <p className="text-sm text-slate-300 mt-1">{activeImage.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
