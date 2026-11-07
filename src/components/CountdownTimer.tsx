import React, { useState, useEffect } from 'react';
import { Clock, Flame, Zap, ShieldCheck, ArrowRight, Tag } from 'lucide-react';

interface CountdownTimerProps {
  variant?: 'banner' | 'card' | 'inline';
  onOrderClick?: () => void;
  price?: number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

const STORAGE_KEY = 'mc_promo_14days_end_timestamp';
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  variant = 'card',
  onOrderClick,
  price = 180000
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 14,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: FOURTEEN_DAYS_MS
  });

  useEffect(() => {
    // Retrieve or initialize the 14-day deadline timestamp
    const getTargetTime = (): number => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const timestamp = parseInt(stored, 10);
          if (!isNaN(timestamp) && timestamp > Date.now()) {
            return timestamp;
          }
        }
      } catch (e) {
        // Fallback for SSR/localStorage restricted environments
      }

      // Initialize 14 days from right now
      const newDeadline = Date.now() + FOURTEEN_DAYS_MS;
      try {
        localStorage.setItem(STORAGE_KEY, newDeadline.toString());
      } catch (e) {
        // Ignore storage errors
      }
      return newDeadline;
    };

    let targetTime = getTargetTime();

    const calculateRemaining = () => {
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        // Reset 14 days if expired to keep urgency continuous
        targetTime = Date.now() + FOURTEEN_DAYS_MS;
        try {
          localStorage.setItem(STORAGE_KEY, targetTime.toString());
        } catch (e) {}
      }

      const safeDiff = Math.max(0, targetTime - Date.now());
      const seconds = Math.floor((safeDiff / 1000) % 60);
      const minutes = Math.floor((safeDiff / (1000 * 60)) % 60);
      const hours = Math.floor((safeDiff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(safeDiff / (1000 * 60 * 60 * 24));

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalMs: safeDiff
      });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigit = (num: number) => num.toString().padStart(2, '0');

  // Variant 1: Sticky or Top Bar Urgency Banner
  if (variant === 'banner') {
    return (
      <div className="w-full bg-gradient-to-r from-blue-950 via-slate-950 to-blue-900 border-b border-blue-500/30 text-white py-2 px-2.5 sm:px-6 shadow-md relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          {/* Urgency Badge & Message */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-bold flex-wrap justify-center sm:justify-start text-center sm:text-left">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider animate-pulse">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>14-DAY FLASH PROMO</span>
            </span>
            <span className="text-slate-200 text-[11px] sm:text-xs">
              Discount Price <strong className="text-emerald-400 font-extrabold">₦{price.toLocaleString()}</strong> ends in:
            </span>
          </div>

          {/* 4-Digit Timer Display */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1 font-mono font-black">
              {/* Days */}
              <div className="flex flex-col items-center">
                <span className="bg-slate-900 px-1.5 sm:px-2 py-0.5 rounded-md border border-blue-500/40 text-blue-300 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px] text-center tabular-nums">
                  {formatDigit(timeLeft.days)}
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-sans">Days</span>
              </div>
              <span className="text-blue-400 font-bold pb-2 text-xs">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <span className="bg-slate-900 px-1.5 sm:px-2 py-0.5 rounded-md border border-blue-500/40 text-blue-300 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px] text-center tabular-nums">
                  {formatDigit(timeLeft.hours)}
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-sans">Hours</span>
              </div>
              <span className="text-blue-400 font-bold pb-2 text-xs">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="bg-slate-900 px-1.5 sm:px-2 py-0.5 rounded-md border border-blue-500/40 text-blue-300 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px] text-center tabular-nums">
                  {formatDigit(timeLeft.minutes)}
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-sans">Mins</span>
              </div>
              <span className="text-blue-400 font-bold pb-2 text-xs">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="bg-emerald-950 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-500/50 text-emerald-400 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px] text-center tabular-nums animate-pulse">
                  {formatDigit(timeLeft.seconds)}
                </span>
                <span className="text-[8px] sm:text-[9px] text-emerald-400 uppercase font-sans">Secs</span>
              </div>
            </div>

            {onOrderClick && (
              <button
                onClick={onOrderClick}
                className="hidden md:inline-flex items-center gap-1 ml-3 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] transition-all cursor-pointer shadow-sm"
              >
                <span>Claim Offer</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Variant 2: Card Display (Hero & Order Form)
  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border-2 border-emerald-500/40 p-3.5 sm:p-5 shadow-2xl shadow-emerald-500/10 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 sm:p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
          </span>
          <div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-400 block">
              14-DAY LIMITED PROMO TIMER
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium line-clamp-1 sm:line-clamp-none">
              Reserve at ₦{price.toLocaleString()} before price reverts to ₦200,000
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600/20 border border-rose-500/40 text-rose-300 text-[10px] font-extrabold uppercase tracking-wider shrink-0">
          <Flame className="w-3 h-3 text-rose-400" />
          Only 9 Units Left
        </span>
      </div>

      {/* Countdown Grid (Days, Hours, Minutes, Seconds) - Responsive for tiny 320px screens */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 text-center my-2.5 sm:my-3">
        {/* Days */}
        <div className="rounded-xl bg-slate-950/90 border border-blue-500/40 p-1.5 sm:p-3 flex flex-col items-center shadow-inner min-w-0">
          <span className="font-mono text-lg sm:text-3xl font-black text-white tabular-nums">
            {formatDigit(timeLeft.days)}
          </span>
          <span className="text-[9px] sm:text-xs text-blue-300 uppercase font-bold mt-0.5 tracking-wider truncate">
            Days
          </span>
        </div>

        {/* Hours */}
        <div className="rounded-xl bg-slate-950/90 border border-blue-500/40 p-1.5 sm:p-3 flex flex-col items-center shadow-inner min-w-0">
          <span className="font-mono text-lg sm:text-3xl font-black text-white tabular-nums">
            {formatDigit(timeLeft.hours)}
          </span>
          <span className="text-[9px] sm:text-xs text-blue-300 uppercase font-bold mt-0.5 tracking-wider truncate">
            Hours
          </span>
        </div>

        {/* Minutes */}
        <div className="rounded-xl bg-slate-950/90 border border-blue-500/40 p-1.5 sm:p-3 flex flex-col items-center shadow-inner min-w-0">
          <span className="font-mono text-lg sm:text-3xl font-black text-white tabular-nums">
            {formatDigit(timeLeft.minutes)}
          </span>
          <span className="text-[9px] sm:text-xs text-blue-300 uppercase font-bold mt-0.5 tracking-wider truncate">
            Mins
          </span>
        </div>

        {/* Seconds */}
        <div className="rounded-xl bg-emerald-950/80 border-2 border-emerald-500/60 p-1.5 sm:p-3 flex flex-col items-center shadow-inner min-w-0">
          <span className="font-mono text-lg sm:text-3xl font-black text-emerald-400 tabular-nums animate-pulse">
            {formatDigit(timeLeft.seconds)}
          </span>
          <span className="text-[9px] sm:text-xs text-emerald-400 uppercase font-extrabold mt-0.5 tracking-wider truncate">
            Secs
          </span>
        </div>
      </div>

      {/* Stock Urgency Progress Indicator */}
      <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold mb-1.5">
          <span className="text-slate-300 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Promo Allocation:</span>
          </span>
          <span className="text-emerald-400 font-mono font-bold">
            91% Claimed
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
            style={{ width: '91%' }}
          />
        </div>
      </div>
    </div>
  );
};
