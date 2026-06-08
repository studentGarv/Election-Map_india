import React from 'react';
import { PresidentHistoryTable } from '../components/PresidentHistoryTable';

const PresidentHistoryPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Presidents of India</h1>
      <p className="text-gray-600 mb-8">
        A chronological record of all Presidents of India, their party affiliation (if applicable),
        and tenure dates. Click on any President to view details about their term.
      </p>

      <PresidentHistoryTable />
    </main>
  );
};

export default PresidentHistoryPage;
