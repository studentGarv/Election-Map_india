import React from 'react';
import { FAQAccordion } from '../components/FAQAccordion';

const FAQPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
          <span>❓</span>
          <span>Electoral Knowledge &amp; Guidance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
          Comprehensive answers to common questions about voter registration, EVM/VVPAT voting procedures,
          qualification rules, and official electoral authorities.
        </p>
      </div>

      <FAQAccordion />
    </main>
  );
};

export default FAQPage;
