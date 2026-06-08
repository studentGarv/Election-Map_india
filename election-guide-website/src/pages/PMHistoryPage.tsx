import React, { useMemo } from 'react';
import { useAppData } from '../context/AppContext';
import { PMHistoryTable } from '../components/PMHistoryTable';

const PMHistoryPage: React.FC = () => {
  const { state } = useAppData();
  const { pmRecords } = state;

  const partyTermCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    pmRecords.forEach((record) => {
      counts[record.party] = (counts[record.party] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [pmRecords]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Prime Ministers of India</h1>
      <p className="text-gray-600 mb-8">
        A chronological record of all Prime Ministers of India, their party affiliation,
        Lok Sabha number, election year, and tenure dates.
      </p>

      {pmRecords.length > 0 && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Prime Ministerial Terms by Party</h2>
          <div className="flex flex-wrap gap-4">
            {partyTermCounts.map(([party, count]) => (
              <div key={party} className="bg-white px-4 py-2 rounded-full border border-gray-300 shadow-sm flex items-center">
                <span className="font-semibold text-gray-800 mr-2">{party}:</span>
                <span className="text-indigo-600 font-bold">{count} {count === 1 ? 'term' : 'terms'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <PMHistoryTable />
    </main>
  );
};

export default PMHistoryPage;
