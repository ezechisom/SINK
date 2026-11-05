import React from 'react';
import { Lock, Phone, Mail, MapPin, Waves } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onAdminClick }) => {
  return (
    <footer className="bg-[#0a192f] text-slate-300 py-12 sm:py-16 border-t border-blue-900/60 pb-24 sm:pb-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-bold">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="font-['Outfit'] font-extrabold text-lg text-white">
                A-01 Deadbolt Smart Lock
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Nigeria's premier supplier of advanced smart door locks. High-grade aerospace alloy with 3D face recognition, 4.0-inch interior screen, Tuya App, and payment on delivery across Nigeria.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              © {new Date().getFullYear()} Moonlight Crescent Smart Security. All rights reserved.
            </div>
          </div>

          {/* Quick Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-4">
              Customer Support
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.supportPhone || '08147778029'}`} className="hover:text-emerald-300 font-semibold">
                  {settings.supportPhone || '08147778029'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{settings.supportEmail || 'orders@smartlock.ng'}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.pickupOfficeAddress || 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos'}</span>
              </div>
            </div>
          </div>

          {/* Navigation & Admin Portal */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Product Showcase
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-white transition-colors">
                  Key Benefits
                </a>
              </li>
              <li>
                <a href="#specifications" className="hover:text-white transition-colors">
                  Technical Specifications
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={onAdminClick}
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Store Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
