import React from 'react';
import { ShoppingBag, CheckCircle2, Shield, Eye, Smartphone, BatteryCharging, Sparkles, KeyRound, Phone, Lock } from 'lucide-react';

interface HeroProps {
  price: number;
  onOrderClick: () => void;
  heroImage: string;
}

export const Hero: React.FC<HeroProps> = ({ price, onOrderClick, heroImage }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 text-white border-b border-blue-900/40">
      {/* Background ambient lighting in cyber blue and emerald */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-blue-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & Order Trigger */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            {/* Header Kicker matching creative */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-extrabold uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>SLEEK DESIGN · ADVANCED PROTECTION</span>
              </span>
              <span className="text-xs text-emerald-400 font-bold hidden sm:inline">
                Built for reliability. Designed for you.
              </span>
            </div>

            {/* Model Badge */}
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-black tracking-wider border border-blue-400 font-mono">
                A-01
              </span>
              <span className="text-sm font-extrabold tracking-wider text-slate-300 uppercase">
                DEADBOLT TYPE SMART LOCK
              </span>
            </div>

            {/* Main Headline from poster */}
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.12] text-balance">
              SMART ACCESS.<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                SECURE EVERY DAY.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Advanced security meets modern convenience. Control access your way, anytime, anywhere with <strong className="text-white font-bold">3D Face Recognition</strong>, a vibrant <strong className="text-white font-bold">4.0-inch Interior Screen</strong>, 0.3s Semiconductor Fingerprint, and Tuya Smartphone App remote access.
            </p>

            {/* Price Presentation Card with 180k Unit Price & Highlight */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-900/90 border-2 border-blue-500/40 shadow-2xl shadow-blue-500/10 flex items-center justify-between gap-4 max-w-lg backdrop-blur-md">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                    Promo Offer Price
                  </span>
                  <span className="text-xs text-rose-400 line-through font-mono font-bold">
                    ₦200,000
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-['Outfit'] text-3xl sm:text-4xl font-extrabold text-emerald-400 tabular-nums">
                    ₦{price.toLocaleString()}
                  </span>
                  <span className="text-xs font-extrabold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-500/40">
                    Save ₦20,000
                  </span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-300 flex flex-col gap-1 shrink-0">
                <span className="inline-flex items-center justify-end gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  In Stock Nigeria
                </span>
                <span className="text-slate-400 text-[11px] font-medium">
                  Payment on Delivery
                </span>
              </div>
            </div>

            {/* Primary Action Button: GLOWING AND BLINKING */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-lg">
              <button
                onClick={onOrderClick}
                className="action-glow flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-extrabold text-base tracking-wide shadow-xl active:scale-[0.98] transition-all cursor-pointer border border-blue-400/40"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                <span>ORDER NOW — NATIONWIDE DELIVERY</span>
              </button>
            </div>

            {/* Phone & Trust Highlights with Green Accents */}
            <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-300 font-semibold">
              <a
                href="tel:08147778029"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Hotline: 08147778029</span>
              </a>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-bold">Pay on Delivery Nationwide</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Right Column: Master Product Showcase Image */}
          <div className="lg:col-span-6">
            <div className="relative group rounded-3xl overflow-hidden border-2 border-blue-500/40 bg-slate-900/80 shadow-2xl shadow-blue-900/30">
              <img
                src={heroImage}
                alt="A-01 Deadbolt Type Smart Lock with 3D Face Recognition & 4.0-inch Interior Screen"
                className="w-full h-auto aspect-square sm:aspect-[4/3] object-contain bg-slate-950 p-2 sm:p-4 transition-transform duration-700 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                loading="eager"
              />

              {/* Floating feature callout overlay with Cyber Blue & Emerald Accent */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-blue-400/40 text-left shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-white block">
                        Dual Panel: 3D Face Camera + 4.0" Screen
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">
                        Tuya App · Fingerprint · Passcode · IC Card · Physical Keys
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right shrink-0">
                    <span className="text-[11px] font-mono font-bold text-blue-300 bg-blue-950/80 px-2 py-1 rounded border border-blue-500/30">
                      Model A-01
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Feature Strip Below Hero Split matching Creative Details */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-blue-900/50">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/80 border border-blue-800/40 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-700/50">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">3D Face Recognition</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">Cat-eye infrared camera &lt;0.5s</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/80 border border-blue-800/40 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-700/50">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">4.0" Interior Screen</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Live HD view before opening</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/80 border border-blue-800/40 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-700/50">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">6 Access Methods</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">Face, Print, PIN, Card, App, Key</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/80 border border-blue-800/40 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-700/50">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Emergency Ready</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Type-C port + 2x Physical Keys</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
