import React, { useState, useCallback } from 'react';
import { IndiaMap } from '../components';
import { useAppData } from '../context/AppContext';

/**
 * MapPage — `/map` route
 *
 * Composes the IndiaMap with state-selection management.
 * Clicking a state sets `selectedState`, which:
 *  - highlights the region in #1E40AF blue (handled inside IndiaMap)
 *  - will open the StateHistoryPanel (task 6.7/6.8)
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

        {/* Side panel — StateHistoryPanel will be composed here in task 6.8 */}
        {selectedState && (
          <div className="lg:w-80 xl:w-96">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">{selectedState}</h2>
                <button
                  type="button"
                  onClick={() => setSelectedState(null)}
                  className="text-gray-400 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  aria-label={`Close ${selectedState} history panel`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Election history for <strong>{selectedState}</strong> will be displayed here
                once the StateHistoryPanel component is implemented (task 6.7).
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MapPage;
