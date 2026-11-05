import React from 'react';
import { CheckCircle2, Shield, Wrench, Package, Lock, KeyRound } from 'lucide-react';
import { SpecificationItem } from '../types';

interface SpecificationsProps {
  price: number;
  specifications: SpecificationItem[];
  includedItems: string[];
}

export const Specifications: React.FC<SpecificationsProps> = ({
  price,
  specifications,
  includedItems
}) => {
  return (
    <section id="specifications" className="py-16 sm:py-24 bg-white border-b border-blue-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-bold text-blue-800 uppercase tracking-widest mb-3">
            <span>Verified Technical Details</span>
            <span aria-hidden="true" className="text-blue-400">·</span>
            <span>Universal Nigerian Door Fit</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            PRODUCT DETAILS & TECHNICAL SPECIFICATIONS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Precision engineered from aerospace-grade aluminum and zinc alloy, fitted with 3D infrared cat-eye depth biometrics and sized for standard 40mm–100mm doors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Technical Specs Table */}
          <div className="lg:col-span-7 rounded-3xl bg-white border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Technical Specifications</h3>
                <span className="text-xs text-blue-600 font-semibold">Model: A-01 Deadbolt Type Smart Lock</span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase text-slate-500 block font-semibold">Unit Price</span>
                <span className="text-xl font-bold text-emerald-600 font-['Outfit'] tabular-nums">
                  ₦{price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {specifications.map((spec, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <span className="font-semibold text-slate-600 sm:w-2/5 shrink-0">
                    {spec.label}
                  </span>
                  <span className="text-slate-900 sm:w-3/5 font-bold text-left sm:text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Included Box Contents & Installation Notes */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Box Contents Card */}
            <div className="rounded-3xl bg-blue-50/70 border-2 border-blue-200 p-6 sm:p-7 text-left shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Complete Box Contents</h3>
                  <span className="text-xs text-blue-700 font-medium">Ready for immediate door mounting</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                {includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Installation & Door Compatibility Box */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 text-left shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Door Compatibility & Fast Setup</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Universal design engineered for door thicknesses between 40mm and 100mm. Fits left-opening and right-opening doors (handle direction is easily reversible during setup). Works smoothly on modern wooden doors, armored security doors, metal doors, and composite doors. Full English manual and 1:1 door drilling template included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
