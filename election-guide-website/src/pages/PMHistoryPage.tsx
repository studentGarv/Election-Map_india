import React, { useMemo } from 'react';
import { useAppData } from '../context/AppContext';
import { PMHistoryTable } from '../components/PMHistoryTable';
import { getPartyColor } from '../utils/partyColors';

const PMHistoryPage: React.FC = () => {
  const { state } = useAppData();
  const { pmRecords } = state;

  const partyTermCounts = useMemo(() => {
    const counts: Record<string, number> = Object.create(null);
    pmRecords.forEach((record) => {
      counts[record.party] = (counts[record.party] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [pmRecords]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-2">
          <span>🏛️</span>
          <span>National Executive Leadership</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Prime Ministers of India
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1 max-w-3xl leading-relaxed">
          Chronological record of India's Prime Ministers since independence (1947),
          documenting governing political parties, Lok Sabha terms, and election mandates.
        </p>
      </div>

      {pmRecords.length > 0 && (
        <div className="mb-8 p-5 sm:p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
            Prime Ministerial Terms by Governing Party
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {partyTermCounts.map(([party, count]) => {
              const color = getPartyColor(party);
              return (
                <div
                  key={party}
                  className="bg-slate-50 hover:bg-slate-100/80 px-3.5 py-1.5 rounded-xl border border-gray-200/80 flex items-center gap-2 transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm">{party}:</span>
                  <span className="text-orange-600 font-bold text-xs sm:text-sm">
                    {count} {count === 1 ? 'term' : 'terms'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PMHistoryTable />
    </main>
  );
};

export default PMHistoryPage;
