import React from 'react';
import { Star, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { CustomerReview } from '../types';

interface ReviewsProps {
  reviews: CustomerReview[];
}

export const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  // Reduced to 2 top featured verified reviews for cleaner layout
  const featuredReviews = reviews.slice(0, 2);

  return (
    <section id="reviews" className="py-12 sm:py-16 bg-slate-50 border-b border-blue-100 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Nigerian Buyers</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified Homeowner Feedback
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Real installations in Lagos, Abuja, and Port Harcourt.
          </p>
        </div>

        {/* Streamlined, Reduced Review Cards with Green Accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all text-left flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Order
                  </span>
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <span className="font-bold text-slate-900 text-xs not-italic block">{rev.name}</span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span>{rev.location}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(rev.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
