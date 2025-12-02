'use client';

import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is SkyScale and what do you specialize in?",
      answer:
        "SkyScale is a premium brand dedicated to the scale model industry, offering high-quality collectible models, custom-made replicas, and pre-order opportunities for car enthusiasts and hobbyists. We focus on precision, realism, and craftsmanship — bringing your favorite vehicles and designs to life in miniature form.",
    },
    {
      question: "What types of scale models does SkyScale offer?",
      answer:
        "We offer a wide range of automotive scale models — from 1:18 and 1:43 die-cast cars to custom resin builds, limited edition models, and concept designs. Whether you're into classic cars, supercars, or motorsport replicas, SkyScale has something for every collector.",
    },
    {
      question: "Can I request a custom or exclusive scale model?",
      answer:
        "Absolutely! SkyScale specializes in custom-built and pre-order models. You can share your reference images, brand, and scale preferences, and our design team will review and craft a bespoke model just for you.",
    },
    {
      question: "How does the pre-order process work at SkyScale?",
      answer:
        "It's simple — fill out our Pre-Order Form with your desired model details, scale, and quantity. Once received, our team will confirm feasibility, estimated delivery, and pricing before production begins. You'll receive regular updates throughout the process.",
    },
    {
      question: "What makes SkyScale different from other scale model brands?",
      answer:
        "SkyScale combines passion, precision, and personalization. Beyond selling models, we aim to redefine the collector experience — offering community engagement, collaborations, and exclusive limited releases that connect enthusiasts worldwide.",
    },
  ];

  return (
    <section id="faq" className="relative py-12 bg-gradient-to-b from-sky-50 via-white to-gray-100 overflow-hidden">
      {/* Enhanced background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-sky-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-full px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block mb-3 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold">
            FAQ
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about <span className="text-sky-600 font-semibold">SkyScale</span>.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl border border-sky-100/50 transition-all duration-300 group overflow-hidden"
            >
              {/* Top gradient accent */}
              <div className="h-1 bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-sky-50/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-base">{faq.question}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-sky-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-4 text-gray-700 text-base leading-relaxed border-t border-sky-100/50 bg-gradient-to-b from-sky-50/30 to-transparent">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

    
      </div>
    </section>
  );
};

export default FAQ;