import React, { useState } from 'react';
import { Eye, Smartphone, Fingerprint, Bell, ShieldAlert, KeyRound, CheckCircle2, ShoppingBag, Lock, Sliders, BatteryCharging, Shield, Sparkles } from 'lucide-react';

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
  videoTitle = 'A-01 Deadbolt Smart Lock Operational & Feature Showcase',
  videoDescription = 'Experience 3D Face Recognition, the 4.0-Inch Interior HD Screen, 0.3s Semiconductor Fingerprint, and Tuya Smart App in action.',
  price,
  onOrderClick,
  posterImage
}) => {
  const [activeTab, setActiveTab] = useState<'face' | 'screen' | 'fingerprint' | 'app' | 'doorbell' | 'emergency'>('face');

  const demoFeatures = [
    {
      id: 'face' as const,
      name: '3D Face Recognition',
      icon: Eye,
      image: '/public/assets/aistudio/image_d0f1a489.png',
      tag: '<0.5s Video Intercom Scan',
      headline: '3D Infrared Cat-Eye Camera & Active Video Intercom',
      description: 'Hands-free entry even when holding groceries. Uses dual infrared depth sensors to map 30,000 biometric facial coordinates. Works in complete darkness, resists photo/video spoofing, and includes active two-way video intercom with Tuya Smart App.',
      statusMsg: 'SCANNING... FACIAL MATCH 99.8% · ACCESS GRANTED'
    },
    {
      id: 'screen' as const,
      name: '4.0" Interior Screen',
      icon: Smartphone,
      image: '/public/assets/aistudio/image_2cf67039.png',
      tag: 'Long Endurance Lithium',
      headline: 'Long Endurance Rechargeable Battery & 4.0" Interior Monitor',
      description: 'Durable, assured quality built for peace of mind. The heavy-duty rechargeable lithium battery compartment lasts 3 to 5 months on a single full charge. The interior panel features a built-in HD display giving family members visual confirmation of visitors outside.',
      statusMsg: 'BATTERY NORMAL (3-5 MONTHS) · 4.0" HD SCREEN ACTIVE'
    },
    {
      id: 'fingerprint' as const,
      name: 'Semiconductor Fingerprint',
      icon: Fingerprint,
      image: '/public/assets/aistudio/image_3e43ad8c.png',
      tag: '0.5s Ultra-Fast Unlock',
      headline: 'Semiconductor Fingerprint 0.5 Seconds to Unlock (99.99%)',
      description: 'The 3D semiconductor fingerprint sensor is 21% higher than traditional fingerprint locks. Instant 0.5-second unlock speed with a 99.99% biometric recognition rate and an ultra-low 0.01% false rejection rate.',
      statusMsg: 'BIOMETRIC 0.5S UNLOCK · 99.99% MATCH · ACCESS GRANTED'
    },
    {
      id: 'app' as const,
      name: '6-in-1 Multi-Access',
      icon: Sliders,
      image: '/public/assets/aistudio/image_aa3a96c0.png',
      tag: 'Multi-Method Access',
      headline: '6-in-1 Multi-Access Methods & Tuya Smartphone Remote Unlock',
      description: 'Unlock your way: 3D Face Recognition, Semiconductor Fingerprint, Encrypted IC Card, Virtual Password, Concealed Mechanical Key, or Remote Unlock Request via Tuya Smartphone App from anywhere in the world.',
      statusMsg: 'TUYA SMART CONNECTED · 6-IN-1 ACCESS READY'
    },
    {
      id: 'doorbell' as const,
      name: 'Privacy Scramble Password',
      icon: Lock,
      image: '/public/assets/aistudio/image_59eea695.png',
      tag: 'Virtual Anti-Peep PIN',
      headline: 'Privacy Password Anti-Peep Keypad Technology',
      description: 'Defeat onlookers and shoulder-surfing completely. Type random fake numbers before or after your actual password (Fake-PIN + Real Password + Fake-PIN)—as long as a continuous correct sequence is entered, the door opens securely.',
      statusMsg: 'VIRTUAL FAKE PIN ACTIVE · PRIVACY SECURED'
    },
    {
      id: 'emergency' as const,
      name: 'Hardware Package & Backup',
      icon: KeyRound,
      image: '/public/assets/aistudio/image_1fd68c2a.png',
      tag: 'Complete Box Inclusions',
      headline: 'Complete Hardware Package, Emergency Keys & Dual Power',
      description: 'Every set arrives complete with front & rear panels, heavy-duty multi-bolt lock body, 2 laser-cut override keys, 2 magnetic IC cards, USB charging cable, screw fittings, and full cutout template. Never get locked out.',
      statusMsg: 'COMPLETE HARDWARE SET · 2X MANUAL KEYS INCLUDED'
    }
  ];

  const currentFeature = demoFeatures.find((f) => f.id === activeTab) || demoFeatures[0];

  // The 12 features directly transcribed from the user's uploaded poster
  const twelvePosterFeatures = [
    { title: 'FACE RECOGNITION', sub: 'Cat Eye Camera' },
    { title: '4.0-INCH', sub: 'Interior Screen' },
    { title: 'TOUCH FUNCTION', sub: 'Capacitive Key' },
    { title: 'ONE BUTTON', sub: 'Switch Lock' },
    { title: 'QUICK OPEN', sub: 'Safety Handle' },
    { title: 'ANTI-LOCK', sub: 'Privacy Knob' },
    { title: 'DISPLAY SCREEN', sub: 'Digital Feedback' },
    { title: 'PASSWORD SWIPE', sub: 'Virtual Scramble Area' },
    { title: 'SEMICONDUCTOR', sub: '0.3s Fingerprint' },
    { title: 'ONE-CLICK', sub: 'Smart Doorbell' },
    { title: 'MECHANICAL', sub: 'Concealed Keyhole' },
    { title: 'TYPE-C', sub: 'Emergency Interface' }
  ];

  return (
    <section id="demo" className="py-16 sm:py-24 bg-slate-950 text-white border-b border-blue-900/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-extrabold text-blue-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>A-01 SYSTEM ARCHITECTURE</span>
            <span aria-hidden="true" className="text-blue-500">·</span>
            <span>12 ADVANCED FEATURES</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            SEE THE A-01 DEADBOLT SMART LOCK IN ACTION
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            {videoDescription}
          </p>
        </div>

        {/* 12 Features Grid from Poster */}
        <div className="mb-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {twelvePosterFeatures.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-blue-800/40 hover:border-emerald-400/60 transition-all text-center flex flex-col justify-center items-center shadow-md group"
            >
              <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 flex items-center justify-center font-mono font-bold text-xs mb-2 transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="font-extrabold text-xs text-white uppercase tracking-tight">
                {item.title}
              </div>
              <div className="text-[11px] text-blue-300 font-medium mt-0.5">
                {item.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Showcase Box */}
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-blue-500/40 bg-slate-900 shadow-2xl shadow-blue-900/30">
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
              {/* Feature Mode Selector Tabs */}
              <div className="p-3 sm:p-4 bg-slate-950 border-b border-blue-900/50 flex flex-wrap items-center justify-center gap-2">
                {demoFeatures.map((feat) => {
                  const Icon = feat.icon;
                  const isActive = activeTab === feat.id;
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => setActiveTab(feat.id)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/50'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{feat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Visual Showcase Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Visual Canvas */}
                <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={currentFeature.image || posterImage}
                    alt={currentFeature.headline}
                    className="w-full h-full object-contain transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* High-Tech HUD Simulation Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 p-2 px-3 rounded-xl bg-blue-950/80 backdrop-blur-md border border-blue-500/40 text-white shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-300 uppercase tracking-wider font-bold">
                      {currentFeature.tag}
                    </span>
                  </div>

                  {/* Dynamic Status Ticker */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-left shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{currentFeature.statusMsg}</span>
                    </div>
                  </div>
                </div>

                {/* Feature Description Panel */}
                <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-900 flex flex-col justify-between text-left border-t lg:border-t-0 lg:border-l border-blue-900/50">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-1 block">
                      Feature Spotlight
                    </span>
                    <h3 className="font-['Outfit'] text-xl sm:text-2xl font-extrabold text-white mb-3">
                      {currentFeature.headline}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {currentFeature.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-slate-800 space-y-2.5 text-xs text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Fits standard wooden & armored security doors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Anti-Prying Tamper Alarm + Anti-Peep PIN</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Rechargeable Lithium Battery (6–8 Months runtime)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-bold block">Special Price</span>
                      <span className="font-['Outfit'] text-2xl font-extrabold text-emerald-400 tabular-nums">
                        ₦{price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={onOrderClick}
                      className="action-glow flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg active:scale-95 transition-all cursor-pointer border border-blue-400/40"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ORDER NOW</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
