import React from 'react';
import { CheckCircle2, Shield, Wrench, Package } from 'lucide-react';
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">
            <span>Verified Technical Details</span>
            <span aria-hidden="true" className="text-blue-300">·</span>
            <span>Standard Nigerian Fit</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            PRODUCT DETAILS & SPECIFICATIONS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Engineered with high-tensile SUS304 honeycomb nano stainless steel and sized for standard Nigerian residential and commercial countertops.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Technical Specs Table */}
          <div className="lg:col-span-7 rounded-3xl bg-white border-2 border-blue-100 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-blue-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Technical Specifications</h3>
                <span className="text-xs text-blue-600 font-semibold">Model: Smart Kitchen Piano Sink (75 × 45 cm)</span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase text-slate-500 block font-semibold">Standard Price</span>
                <span className="text-xl font-bold text-blue-600 font-['Outfit'] tabular-nums">
                  ₦{price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="divide-y divide-blue-50">
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

          {/* Right Column: Included Accessories & Care Guidelines */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Box Contents Card */}
            <div className="rounded-3xl bg-blue-50/60 border-2 border-blue-200/80 p-6 sm:p-7 text-left shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Complete Box Contents</h3>
                  <span className="text-xs text-blue-700 font-medium">Ready for immediate installation</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Installation & Care Box */}
            <div className="rounded-3xl bg-white border border-blue-100 p-6 text-left shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Standard Nigerian Plumbing & Care</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects directly to standard Nigerian 1/2-inch cold and hot plumbing valves without proprietary adaptors. Fits standard 700 × 400 mm cutouts. To maintain the nano finish, wipe clean with warm water and a soft cloth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
