import React, { useState, useCallback } from 'react';
import { IndiaMap, StateHistoryPanel } from '../components';
import { useAppData } from '../context/AppContext';

/**
 * MapPage — `/map` route
 *
 * Composes IndiaMap and StateHistoryPanel with state-selection management.
 * Clicking a state sets `selectedState`, which:
 *  - highlights the region in #1E40AF blue (handled inside IndiaMap)
 *  - opens the StateHistoryPanel with CM history and party tenure data
 *
 * Requirements: 2.3 — clicking a state on the India Map displays the
 * State Election History panel for the selected state.
 */
const MapPage: React.FC = () => {
  const { state } = useAppData();
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleStateClick = useCallback((stateName: string) => {
    // Toggle off if the same state is clicked again
    setSelectedState((prev) => (prev === stateName ? null : stateName));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive India Map</h1>
      <p className="text-gray-600 mb-6">
        Explore India's states and union territories. Click on any state to view its
        election history, ruling parties, and Chief Ministers over time.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map panel */}
        <div className="flex-1 min-w-0">
          <IndiaMap
            stateData={state.statePartyTenures}
            onStateClick={handleStateClick}
            selectedState={selectedState}
          />
        </div>

        {/* Side panel */}
        <div className="lg:w-96">
          {selectedState ? (
            <StateHistoryPanel
              state={selectedState}
              cmHistory={state.cmRecords.filter(
                (cm) => cm.state.toLowerCase() === selectedState.toLowerCase()
              )}
              partyTenure={state.statePartyTenures.filter(
                (t) => t.state.toLowerCase() === selectedState.toLowerCase()
              )}
              onClose={() => setSelectedState(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-48 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm text-center px-4">
              Click on a state to view its election history
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MapPage;
