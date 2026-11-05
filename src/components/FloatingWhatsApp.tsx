import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  price: number;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber, price }) => {
  if (!whatsappNumber) return null;

  // Sanitize number for URL
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const prefilledMessage = encodeURIComponent(
    `Hello, I'm interested in ordering the A-01 Deadbolt Type Smart Lock priced at ₦${price.toLocaleString()}. Please provide more details.`
  );

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${prefilledMessage}`;

  return (
    <aside aria-label="Customer Support" className="fixed bottom-20 sm:bottom-6 right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/30 group"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 fill-current" />
        </div>
        <span className="text-xs font-bold tracking-wide hidden sm:inline whitespace-nowrap">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  );
};
