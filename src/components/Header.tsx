import React from 'react';
import { ShoppingBag, Lock, Waves, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface HeaderProps {
  price: number;
  onOrderClick: () => void;
  onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ price, onOrderClick, onAdminClick }) => {
  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar with Green & Blue Highlights */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 font-semibold">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-emerald-400/40">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              Verified In Stock
            </span>
            <span className="hidden sm:inline text-blue-100">
              Nationwide Delivery across Nigeria · Pay on Delivery Available
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-[11px]">
            <a
              href="#faq"
              className="flex items-center gap-1 text-white hover:text-emerald-200 transition-colors underline underline-offset-2"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>Have Questions? Read FAQ</span>
            </a>
            <button
              onClick={onOrderClick}
              className="hidden md:inline-flex items-center gap-1 bg-white text-blue-700 hover:bg-emerald-50 px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
            >
              Order Now ₦{price.toLocaleString()}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Header Navigation */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Modern Product & Workstation Wordmark */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 text-left group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white shadow-md shadow-blue-500/20 flex items-center justify-center transition-transform group-hover:scale-105">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Outfit'] font-extrabold text-base sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Smart Piano Sink
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-wider uppercase text-emerald-600 font-bold">
                Workstation (75 × 45 cm)
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#gallery" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
              Showcase
            </a>
            <a href="#benefits" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
              Benefits
            </a>
            <a href="#demo" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
              Operation
            </a>
            <a href="#specifications" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
              Specifications
            </a>
            <a
              href="#faq"
              className="flex items-center gap-1.5 text-blue-700 hover:text-emerald-600 font-bold transition-colors whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>FAQ</span>
            </a>
          </nav>

          {/* Zone 3: FAQ Link + Glowing Blinking ORDER NOW Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Direct FAQ Link at top */}
            <a
              href="#faq"
              className="flex items-center gap-1 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl bg-blue-50 hover:bg-emerald-50 text-blue-700 hover:text-emerald-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>FAQ</span>
            </a>

            {/* Glowing & Blinking Primary Action Button */}
            <button
              onClick={onOrderClick}
              className="action-glow flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white shrink-0" />
              <span>ORDER NOW — ₦{price.toLocaleString()}</span>
            </button>

            {/* Admin Key */}
            <button
              onClick={onAdminClick}
              aria-label="Admin Portal"
              className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              title="Store Administration"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
