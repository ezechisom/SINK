import React from 'react';
import { ShoppingBag, CheckCircle2, Droplets, Gauge, Shield, Truck, Sparkles } from 'lucide-react';

interface HeroProps {
  price: number;
  onOrderClick: () => void;
  heroImage: string;
}

export const Hero: React.FC<HeroProps> = ({ price, onOrderClick, heroImage }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-blue-50/80 via-white to-emerald-50/30 border-b border-blue-100">
      {/* Background ambient lighting in soft blue and emerald */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-blue-400/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[280px] bg-emerald-400/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & Order Trigger */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-emerald-100 border border-emerald-300 text-xs font-extrabold text-emerald-900 mb-4 w-fit uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>SUS304 Nano Workstation · 75 × 45 cm</span>
            </div>

            <h1 className="font-['Outfit'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              UPGRADE YOUR KITCHEN WITH THE PREMIUM SMART PIANO SINK
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Experience a smarter, more elegant kitchen with a beautifully designed multifunctional workstation sink that combines modern style with everyday convenience.
            </p>

            {/* Price Presentation Card with Colorful Green & Blue Accents */}
            <div className="mt-6 p-5 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg shadow-emerald-500/5 flex items-center justify-between gap-4 max-w-lg">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                  Official Selling Price
                </span>
                <span className="font-['Outfit'] text-3xl sm:text-4xl font-extrabold text-blue-600 tabular-nums">
                  ₦{price.toLocaleString()}
                </span>
              </div>
              <div className="text-right text-xs text-slate-600 flex flex-col gap-1">
                <span className="inline-flex items-center justify-end gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  In Stock Nigeria
                </span>
                <span className="text-emerald-700 font-bold text-[11px]">
                  Includes Full Workstation Kit
                </span>
              </div>
            </div>

            {/* Primary Action Button: GLOWING AND BLINKING */}
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-lg">
              <button
                onClick={onOrderClick}
                className="action-glow flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-base tracking-wide shadow-xl active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                <span>ORDER YOUR SMART PIANO SINK NOW</span>
              </button>
            </div>

            {/* Quick Trust Highlights with Green Checkmarks */}
            <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-900 font-bold">Payment on Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7-Day Inspection Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard 1/2" Plumbing</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Resolution Real Product Photo */}
          <div className="lg:col-span-6">
            <div className="relative group rounded-3xl overflow-hidden border-2 border-emerald-200/90 bg-white shadow-2xl">
              <img
                src={heroImage}
                alt="Premium Smart Piano Kitchen Sink Installed in a Luxury Kitchen"
                className="w-full h-auto aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                loading="eager"
              />

              {/* Floating feature callout overlay with Green Accent */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200 text-left shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Flying Rain Waterfall + 360° Sprayer
                    </span>
                    <span className="text-[11px] text-emerald-600 font-extrabold">
                      4 Tactile Piano Keys · Glass Rinser
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Feature Strip Below Hero Split with Colorful Green Highlights */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-blue-100">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Hydroelectric LED</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Zero batteries or wiring</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-blue-100 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">4 Piano Keys</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Instant mode selection</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">SUS304 Honeycomb</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Anti-scratch nano coating</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-blue-100 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Nigeria Delivery</div>
              <div className="text-[11px] text-slate-500 mt-0.5">All 36 States + Abuja FCT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
