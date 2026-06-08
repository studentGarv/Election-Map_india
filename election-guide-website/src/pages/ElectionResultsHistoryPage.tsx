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
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Election Results History</h1>
      <p className="text-gray-600 mb-8">
        Explore the historical outcomes of Lok Sabha elections and state-level party tenures.
        Select a state to view its specific ruling party history.
      </p>

      <StateSelector selectedState={selectedState} onChange={setSelectedState} />

      {selectedState ? (
        <div className="mt-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
            {selectedState} Election History
          </h2>
          <StateDominanceSummary tenures={selectedStateTenures} state={selectedState} />
          <StatePartyTenureTable tenures={selectedStateTenures} state={selectedState} />
        </div>
      ) : (
        <div className="mt-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">National Election History</h2>
          <NationalDominanceSummary />
          <LokSabhaResultsTable records={lokSabhaRecords} pmRecords={pmRecords} />
        </div>
      )}
    </main>
  );
};

export default ElectionResultsHistoryPage;
