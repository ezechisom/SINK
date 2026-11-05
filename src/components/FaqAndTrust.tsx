import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, FileText, PhoneCall, HelpCircle } from 'lucide-react';
import { StoreSettings } from '../types';

interface FaqAndTrustProps {
  settings: StoreSettings;
}

export const FaqAndTrust: React.FC<FaqAndTrustProps> = ({ settings }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'returns' | null>(null);

  const faqs = settings.policyText?.faqText || [];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-b border-blue-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">
            <span>Help & Assurance</span>
            <span aria-hidden="true" className="text-blue-300">·</span>
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Everything you need to know about purchasing, inspecting, delivering, and installing your A-01 Smart Lock in Nigeria.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-blue-50/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Policy Access Badges */}
        <div className="mt-14 pt-10 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setActivePolicyModal('privacy')}
            className="hover:text-blue-600 underline underline-offset-4 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>·</span>
          <button
            onClick={() => setActivePolicyModal('terms')}
            className="hover:text-blue-600 underline underline-offset-4 transition-colors cursor-pointer"
          >
            Terms & Conditions
          </button>
          <span>·</span>
          <button
            onClick={() => setActivePolicyModal('returns')}
            className="hover:text-blue-600 underline underline-offset-4 transition-colors cursor-pointer"
          >
            Returns & Inspection Guarantee
          </button>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-blue-200 rounded-3xl max-w-xl w-full p-6 text-left shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 mb-3 capitalize">
              {activePolicyModal === 'privacy' && 'Customer Privacy Policy'}
              {activePolicyModal === 'terms' && 'Terms and Conditions'}
              {activePolicyModal === 'returns' && 'Returns & Inspection Policy'}
            </h3>

            <div className="text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              {activePolicyModal === 'privacy' && (
                <p>{settings.policyText?.privacyPolicy}</p>
              )}
              {activePolicyModal === 'terms' && (
                <p>{settings.policyText?.termsAndConditions}</p>
              )}
              {activePolicyModal === 'returns' && (
                <p>{settings.policyText?.returnsPolicy}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
