import React from 'react';
import { Sparkles, Layers, Sliders, Brush, Award, UtensilsCrossed } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: 'Elegant Modern Kitchen Design',
      description: 'The deep titanium finish, mechanical piano keys, and ambient LED temperature display bring five-star culinary luxury to your kitchen.'
    },
    {
      icon: Sliders,
      title: 'Convenient Multifunctional Station',
      description: 'Switch effortlessly between flying rain waterfall, 3-mode pull-out spray, and high-pressure glass rinser with 4 dedicated piano keys.'
    },
    {
      icon: Layers,
      title: 'Efficient Kitchen Workspace',
      description: 'Double-track sliding ledges support the solid wood cutting board and prep basin directly over the sink, doubling your counter space.'
    },
    {
      icon: Brush,
      title: 'Easy Everyday Cleaning',
      description: 'Advanced Honeycomb Nano-PVD coating repels grease and water spots. Wipe clean in seconds with zero stubborn food stains.'
    },
    {
      icon: Award,
      title: 'Premium-Looking Finishing',
      description: 'Heavyweight SUS304 commercial-grade stainless steel with anti-scratch embossing that resists dents, high heat, and corrosion.'
    },
    {
      icon: UtensilsCrossed,
      title: 'Organized Food Prep & Washing',
      description: 'Rinse fresh vegetables under the gentle waterfall cascade while peeling or chopping on the custom solid walnut board over the basin.'
    }
  ];

  return (
    <section id="benefits" className="py-16 sm:py-24 bg-white border-b border-blue-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">
            <span>Engineering Excellence</span>
            <span aria-hidden="true" className="text-blue-300">·</span>
            <span>Everyday Convenience</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            WHY EVERY MODERN KITCHEN NEEDS A SMART PIANO SINK
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            More than just a sink—it is a complete, high-efficiency culinary station engineered for Nigerian homes and modern lifestyles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 sm:p-7 rounded-3xl bg-white border border-blue-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col text-left shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
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
      </div>
    </section>
  );
};
