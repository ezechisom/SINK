import React, { useState } from 'react';
import { Play, Volume2, ShoppingBag, Droplets, Gauge, Sparkles, CheckCircle2 } from 'lucide-react';

interface DemonstrationProps {
  videoEmbedUrl?: string;
  videoTitle?: string;
  videoDescription?: string;
  price: number;
  onOrderClick: () => void;
  posterImage: string;
}

export const Demonstration: React.FC<DemonstrationProps> = ({
  videoEmbedUrl,
  videoTitle = 'Smart Piano Kitchen Sink Operational Showcase',
  videoDescription = 'Experience the 4-mode piano keys, flying rain waterfall flow, high-pressure glass rinser, and hydroelectric LED temperature display in action.',
  price,
  onOrderClick,
  posterImage
}) => {
  const [activeMode, setActiveMode] = useState<'waterfall' | 'faucet' | 'rinser' | 'display'>('waterfall');
  const [tempValue, setTempValue] = useState(38);

  const modes = [
    {
      id: 'waterfall',
      name: 'Flying Rain Waterfall',
      subtitle: 'Gentle cascading rainfall sheet for fresh vegetables, fruits, and delicate glassware without splashing.'
    },
    {
      id: 'faucet',
      name: '360° Pull-Out Sprayer',
      subtitle: 'High-pressure blade sweep for stubborn grease, aerated soft bubble stream, and wide shower rinse.'
    },
    {
      id: 'rinser',
      name: 'High-Pressure Glass Rinser',
      subtitle: 'Inverted multi-hole high-pressure spray for baby bottles, wine glasses, and mugs in under 2 seconds.'
    },
    {
      id: 'display',
      name: 'Hydroelectric LED Display',
      subtitle: 'Digital real-time temperature screen powered 100% by internal water flow. Zero electricity or batteries needed.'
    }
  ];

  return (
    <section id="demo" className="py-16 sm:py-24 bg-slate-50 border-b border-blue-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">
            <span>Real Operational Showcase</span>
            <span aria-hidden="true" className="text-blue-300">·</span>
            <span>4 Water Modes</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            SEE THE SMART PIANO SINK IN ACTION
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {videoDescription}
          </p>
        </div>

        {/* Video / Showcase Presentation Box */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-blue-200 bg-white shadow-2xl">
          {videoEmbedUrl && videoEmbedUrl.trim() ? (
            <div className="relative aspect-video w-full">
              <iframe
                src={videoEmbedUrl}
                title={videoTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Interactive Visual Showcase */}
              <div className="relative aspect-[16/10] sm:aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={posterImage}
                  alt={videoTitle}
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />

                {/* Ambient Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />

                {/* Simulated Real-Time Control Overlay */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2.5 p-2 px-3.5 rounded-xl bg-blue-900/80 backdrop-blur-md border border-blue-400/40 text-white shadow-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-mono text-blue-200 uppercase tracking-wider font-bold">
                    Active Mode: {activeMode.toUpperCase()}
                  </span>
                </div>

                {/* Hydroelectric Digital Temperature Gauge Badge */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 px-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-blue-400/50 text-right shadow-xl">
                  <div className="text-[10px] text-blue-300 uppercase tracking-widest font-mono">
                    Hydroelectric Flow Temp
                  </div>
                  <div className="text-xl font-bold font-mono text-white tabular-nums">
                    {tempValue}°C <span className="text-xs text-blue-300 font-sans">/ {(tempValue * 1.8 + 32).toFixed(1)}°F</span>
                  </div>
                </div>

                {/* Center visual caption */}
                <div className="absolute bottom-6 inset-x-6 text-left">
                  <div className="inline-block p-1.5 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold mb-2 shadow-md">
                    {modes.find((m) => m.id === activeMode)?.name}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white max-w-xl">
                    {videoTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
                    {modes.find((m) => m.id === activeMode)?.subtitle}
                  </p>
                </div>
              </div>

              {/* Mode Selector Piano Key Tabs */}
              <div className="p-4 sm:p-6 bg-white border-t border-blue-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-left">
                  Click a piano-key mode to inspect its water flow in real-time:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {modes.map((m) => {
                    const isSelected = activeMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveMode(m.id as any);
                          if (m.id === 'display') setTempValue(42);
                          else if (m.id === 'rinser') setTempValue(24);
                          else setTempValue(38);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Droplets className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                          <span className="text-xs font-bold truncate">{m.name}</span>
                        </div>
                        <div className={`text-[11px] line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {isSelected ? 'Active & Flowing' : 'Tap to test'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Under-video Call to Action Bar */}
          <div className="p-6 bg-blue-50/70 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs uppercase tracking-wider text-slate-600 block font-bold">
                Complete Premium Smart Piano Sink Workstation (75 × 45 cm)
              </span>
              <span className="font-['Outfit'] text-2xl font-extrabold text-blue-700 tabular-nums">
                ₦{price.toLocaleString()}
              </span>
            </div>

            <button
              onClick={onOrderClick}
              className="action-glow w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>ORDER YOUR SMART PIANO SINK NOW</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
