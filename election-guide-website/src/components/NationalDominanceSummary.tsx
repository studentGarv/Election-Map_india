import { useMemo } from 'react';
import { useAppData } from '../context/AppContext';
import { getPartyColor } from '../utils/partyColors';

export function NationalDominanceSummary() {
  const { state } = useAppData();
  const { lokSabhaRecords } = state;

  const partyTermCounts = useMemo(() => {
    const counts: Record<string, number> = Object.create(null);
    lokSabhaRecords.forEach((record) => {
      if (record.partyInGovernment) {
        counts[record.partyInGovernment] = (counts[record.partyInGovernment] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [lokSabhaRecords]);

  if (!lokSabhaRecords || lokSabhaRecords.length === 0) return null;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-200/80 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Lok Sabha Ruling Government Dominance
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Distribution of general election terms won by ruling parties
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60">
          {lokSabhaRecords.length} Total Elections
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {partyTermCounts.map(([party, count]) => {
          const color = getPartyColor(party);
          return (
            <div
              key={party}
              className="bg-slate-50 hover:bg-slate-100/70 p-3.5 rounded-xl border border-gray-200/70 flex justify-between items-center transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                  {party}
                </span>
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60 whitespace-nowrap">
                {count} {count === 1 ? 'term' : 'terms'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
