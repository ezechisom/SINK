import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface MobileStickyBarProps {
  price: number;
  onOrderClick: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ price, onOrderClick }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-blue-200 p-2.5 px-3 shadow-2xl safe-area-pb">
      <button
        onClick={onOrderClick}
        className="action-glow w-full h-12 flex items-center justify-center gap-1.5 xs:gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 active:from-blue-700 active:to-emerald-700 text-white font-extrabold text-xs tracking-wide shadow-xl active:scale-[0.98] transition-all cursor-pointer px-2"
      >
        <ShoppingBag className="w-4 h-4 text-white shrink-0" />
        <span className="uppercase">ORDER NOW — ₦{price.toLocaleString()}</span>
        <span className="text-[10px] text-emerald-200 font-bold hidden xs:inline uppercase">(PAY ON DELIVERY)</span>
      </button>
    </div>
  );
};
