import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, X, CheckCircle, MapPin } from 'lucide-react';
import { CustomerReview } from '../types';

interface FloatingReviewProps {
  reviews: CustomerReview[];
}

export const FloatingReview: React.FC<FloatingReviewProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (reviews.length <= 1 || isDismissed) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
        setIsVisible(true);
      }, 400);
    }, 7000);

    return () => clearInterval(interval);
  }, [reviews.length, isDismissed]);

  if (isDismissed || reviews.length === 0) return null;

  const current = reviews[currentIndex];

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-sm transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border-2 border-emerald-300 rounded-2xl p-3.5 shadow-2xl shadow-emerald-950/15 text-left relative flex items-start gap-3">
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-300 shadow-sm transition-colors cursor-pointer"
          title="Dismiss review popup"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Green Verified Icon */}
        <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="font-bold text-xs text-slate-900 truncate">
              {current.name}
            </span>
            <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
              {Array.from({ length: current.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mb-1">
            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{current.location}</span>
            <span className="text-slate-400 font-normal">·</span>
            <span className="text-emerald-700 font-semibold text-[10px]">Verified Buyer</span>
          </div>

          <p className="text-[11px] text-slate-600 line-clamp-2 italic leading-snug">
            "{current.comment}"
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Installed & Verified in Nigeria</span>
          </div>
        </div>
      </div>
    </div>
  );
};
