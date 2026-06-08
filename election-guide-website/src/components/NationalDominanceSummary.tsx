import React, { useMemo } from 'react';
import { useAppData } from '../context/AppContext';

export function NationalDominanceSummary() {
  const { state } = useAppData();
  const { lokSabhaRecords } = state;

  const partyTermCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    lokSabhaRecords.forEach((record) => {
      counts[record.partyInGovernment] = (counts[record.partyInGovernment] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [lokSabhaRecords]);

  if (!lokSabhaRecords || lokSabhaRecords.length === 0) return null;

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">National Dominance Summary</h2>
      <p className="text-sm text-gray-600 mb-4">Lok Sabha terms held by each party as government.</p>
      <div className="flex flex-wrap gap-4">
        {partyTermCounts.map(([party, count]) => (
          <div key={party} className="bg-white px-4 py-2 rounded-full border border-gray-300 shadow-sm flex items-center">
            <span className="font-semibold text-gray-800 mr-2">{party}:</span>
            <span className="text-indigo-600 font-bold">{count} {count === 1 ? 'term' : 'terms'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
