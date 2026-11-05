import React from 'react';
import { KeyRound, Smartphone, ShieldCheck, Wrench, BatteryCharging, Award, Home, Lock } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: KeyRound,
      title: 'Multiple Access Methods',
      tagline: 'Choose the way that’s most convenient for you',
      description: 'Unlock seamlessly with 3D Face Recognition (<0.5s), 360° Semiconductor Fingerprint (0.3s), Anti-Peep Passcode, Encrypted RFID IC Card, Tuya App, or Concealed Mechanical Keys.'
    },
    {
      icon: Smartphone,
      title: 'Smart Remote App Control',
      tagline: 'Manage and monitor access remotely with Tuya App',
      description: 'Generate one-time or time-limited guest codes for cleaners and visitors, approve remote unlock requests, and review instant push alerts and full date-stamped access history logs.'
    },
    {
      icon: ShieldCheck,
      title: 'Reliable Advanced Security',
      tagline: 'Advanced features to keep your home & loved ones safe',
      description: 'Equipped with automatic deadbolt locking, loud anti-prying tamper alarm, 5-time failed attempt lockout, and virtual fake digits to prevent onlookers from guessing your passcode.'
    },
    {
      icon: Wrench,
      title: 'Easy Universal Installation',
      tagline: 'Designed for quick, hassle-free installation',
      description: 'Compatible with standard 40mm – 100mm doors across Nigeria: wooden entrance doors, steel armored doors, security doors, and composite doors. Full drilling template and mortise included.'
    },
    {
      icon: BatteryCharging,
      title: 'Emergency Ready & Fail-Safe',
      tagline: 'Emergency power port ensures access even in low battery',
      description: 'High-capacity rechargeable lithium battery lasts 6–8 months with voice low-battery alerts. External Type-C jumpstart port plus 2x physical mechanical bypass keys ensure zero lockouts.'
    },
    {
      icon: Award,
      title: 'Quality You Can Trust',
      tagline: 'Built with high-quality materials for long-term durability',
      description: 'Crafted from reinforced aerospace-grade aluminum alloy and solid zinc alloy with anti-scratch and weather-resistant black finish. Backed by a full 1-Year replacement warranty.'
    }
  ];

  return (
    <section id="benefits" className="py-16 sm:py-24 bg-white border-b border-blue-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-extrabold text-blue-800 uppercase tracking-widest mb-3">
            <span>A-01 DEADBOLT SMART ACCESS</span>
            <span aria-hidden="true" className="text-blue-400">·</span>
            <span>NATIONWIDE SECURITY</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            WHY THE A-01 SMART LOCK IS THE RIGHT CHOICE FOR YOUR HOME
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Engineered for Nigerian residential homes, luxury apartments, Airbnb rentals, and executive offices. Experience ultimate keyless convenience without compromising security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col text-left shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-wide mb-1">
                  {item.tagline}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Suitable For Banner matching poster ("PERFECT FOR homes, apartments, and offices") */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Perfect Application
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-white">
                Ideal for Homes, Apartments, Airbnb & Executive Offices
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Keep unauthorized visitors out while giving your family, tenants, and staff effortless access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              ✓ Fits 40mm–100mm Doors
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold">
              ✓ Pay on Delivery
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
