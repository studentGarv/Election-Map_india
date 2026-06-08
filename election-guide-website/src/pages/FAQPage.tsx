import React from 'react';
import { FAQAccordion } from '../components/FAQAccordion';

const FAQPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Browse common questions about India's election process. Find quick answers about voter registration,
        polling procedures, and election results.
      </p>

      <FAQAccordion />
    </main>
  );
};

export default FAQPage;
