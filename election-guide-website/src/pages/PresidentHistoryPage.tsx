import React from 'react';
import { PresidentHistoryTable } from '../components/PresidentHistoryTable';

const PresidentHistoryPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <span>🏛️</span>
          <span>Constitutional Head of State</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Presidents of India
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1 max-w-3xl leading-relaxed">
          Chronological record of the Presidents of the Republic of India since 1950,
          documenting their constitutional tenures, political backgrounds, and key national events.
        </p>
      </div>

      <PresidentHistoryTable />
    </main>
  );
};

export default PresidentHistoryPage;
