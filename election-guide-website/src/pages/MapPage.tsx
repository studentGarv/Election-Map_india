import React, { useState, useCallback } from 'react';
import { IndiaMap, StateHistoryPanel } from '../components';
import { useAppData } from '../context/AppContext';

/**
 * MapPage — `/map` route
 *
 * Composes IndiaMap and StateHistoryPanel with state-selection management.
 * Clicking a state sets `selectedState`, which:
 *  - highlights the region (handled inside IndiaMap)
 *  - opens the StateHistoryPanel with CM history and party tenure data
 *
 * Requirements: 2.3 — clicking a state on the India Map displays the
 * State Election History panel for the selected state.
 */
const FEATURED_STATES = [
  'Uttar Pradesh',
  'Maharashtra',
  'West Bengal',
  'Tamil Nadu',
  'Bihar',
  'Karnataka',
  'Gujarat',
  'Rajasthan',
];

const MapPage: React.FC = () => {
  const { state } = useAppData();
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleStateClick = useCallback((stateName: string) => {
    // Toggle off if the same state is clicked again
    setSelectedState((prev) => (prev === stateName ? null : stateName));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <span>🗺️</span>
          <span>Territorial Governance Explorer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Interactive India Map
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1 max-w-3xl leading-relaxed">
          Explore political governance across India's 28 states and 8 union territories.
          Switch between administrative boundaries and ruling party views, or click any territory to review its historical Chief Ministers.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Map panel */}
        <div className="flex-1 w-full min-w-0">
          <IndiaMap
            stateData={state.statePartyTenures}
            onStateClick={handleStateClick}
            selectedState={selectedState}
          />
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-96 flex-shrink-0">
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
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl mb-4 text-orange-600">
                📍
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                State Election History
              </h3>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                Click any region on the map to display its complete timeline of Chief Ministers, party tenure breakdown, and dominance rankings.
              </p>

              <div className="pt-4 border-t border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
                  Quick State Selector
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FEATURED_STATES.map((stateName) => (
                    <button
                      key={stateName}
                      onClick={() => handleStateClick(stateName)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200/80 hover:border-orange-300 transition-colors"
                    >
                      {stateName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Tip:</span> Hover over any state on the map to see its current administration.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MapPage;
