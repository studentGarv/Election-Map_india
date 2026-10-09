import React, { useState } from 'react';
import { useAppData } from '../context/AppContext';
import { LokSabhaResultsTable } from '../components/LokSabhaResultsTable';
import { NationalDominanceSummary } from '../components/NationalDominanceSummary';
import { StateSelector } from '../components/StateSelector';
import { StatePartyTenureTable } from '../components/StatePartyTenureTable';
import { StateDominanceSummary } from '../components/StateDominanceSummary';

const ElectionResultsHistoryPage: React.FC = () => {
  const { state } = useAppData();
  const { lokSabhaRecords, pmRecords, statePartyTenures } = state;
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const selectedStateTenures = selectedState
    ? statePartyTenures.filter((t) => t.state === selectedState)
    : [];

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
          <span>📊</span>
          <span>Historical Electoral Records</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Election Results &amp; Tenure History
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1 max-w-3xl leading-relaxed">
          Historical outcomes of India's general elections alongside longitudinal state party governance.
          Toggle between national Lok Sabha tallies and specific state tenure records.
        </p>
      </div>

      <StateSelector selectedState={selectedState} onChange={setSelectedState} />

      {selectedState ? (
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200/80">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {selectedState} Election History
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Chief Ministers and cumulative party tenures for {selectedState}
              </p>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
            >
              &larr; Back to National
            </button>
          </div>
          <StateDominanceSummary tenures={selectedStateTenures} state={selectedState} />
          <StatePartyTenureTable tenures={selectedStateTenures} state={selectedState} />
        </div>
      ) : (
        <div className="mt-8 animate-fade-in">
          <div className="pb-3 mb-4 border-b border-gray-200/80">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              National Election History
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              1st through 18th Lok Sabha general election results, ruling coalitions, and mandates
            </p>
          </div>
          <NationalDominanceSummary />
          <LokSabhaResultsTable records={lokSabhaRecords} pmRecords={pmRecords} />
        </div>
      )}
    </main>
  );
};

export default ElectionResultsHistoryPage;
