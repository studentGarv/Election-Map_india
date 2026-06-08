/**
 * StateHistoryPanel Component
 *
 * Slide-in panel showing CM history and party tenure summary for a selected
 * Indian state. Satisfies Requirements 2.3, 2.4, 2.5, 2.6.
 *
 * Features:
 *  - Header with state name + close button (X icon)
 *  - CM History section: chronological list (ascending by startDate)
 *  - Party Tenure Summary: sorted by totalYears descending
 *  - Empty-state handling when no CM records exist
 *  - Full ARIA accessibility with appropriate headings
 */

import React from 'react';
import type { CMRecord, StatePartyTenure } from '../types';
import { getPartyColor } from '../utils/partyColors';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StateHistoryPanelProps {
  /** Name of the selected state */
  state: string;
  /** All CM records for the selected state */
  cmHistory: CMRecord[];
  /** Party tenure summary records for the selected state */
  partyTenure: StatePartyTenure[];
  /** Called when the close button is activated */
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats a Date as "MMM YYYY" (e.g. "Jan 1972").
 * Returns "—" when the date is null.
 */
function formatDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

/**
 * Returns a tenure range string: "Jan 1972 – Mar 1975" or "Jan 2020 – present".
 */
function tenureRange(startDate: Date | null, endDate: Date | null): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'present';
  return `${start} – ${end}`;
}

/**
 * Sorts CM records chronologically (ascending by startDate).
 * Records with null startDate are placed at the end.
 */
function sortCMChronological(records: CMRecord[]): CMRecord[] {
  return [...records].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.getTime() - b.startDate.getTime();
  });
}

/**
 * Sorts party tenure records by totalYears descending.
 */
function sortTenureDescending(tenures: StatePartyTenure[]): StatePartyTenure[] {
  return [...tenures].sort((a, b) => b.totalYears - a.totalYears);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PartyBadgeProps {
  party: string;
}

/** Inline colored badge showing party name. */
const PartyBadge: React.FC<PartyBadgeProps> = ({ party }) => {
  const color = getPartyColor(party);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
      style={{ backgroundColor: color }}
      title={party}
    >
      {party}
    </span>
  );
};

// ─── StateHistoryPanel ────────────────────────────────────────────────────────

/**
 * Panel component that displays the Chief Minister history and party tenure
 * summary for the selected Indian state.
 */
const StateHistoryPanel: React.FC<StateHistoryPanelProps> = ({
  state,
  cmHistory,
  partyTenure,
  onClose,
}) => {
  const sortedCMs = sortCMChronological(cmHistory);
  const sortedTenures = sortTenureDescending(partyTenure);

  return (
    <aside
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
      aria-label={`${state} history panel`}
      role="complementary"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 truncate pr-4">{state}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${state} history panel`}
          className="flex-shrink-0 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {/* X icon */}
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

      {/* ── Body (scrollable) ── */}
      <div className="overflow-y-auto flex-1 divide-y divide-gray-100">

        {/* ── CM History Section ── */}
        <section className="px-5 py-4" aria-labelledby="cm-history-heading">
          <h3
            id="cm-history-heading"
            className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3"
          >
            Chief Minister History
          </h3>

          {sortedCMs.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No Chief Minister records available for {state}
            </p>
          ) : (
            <ol className="space-y-3" aria-label={`Chief Ministers of ${state}`}>
              {sortedCMs.map((cm, index) => (
                <li
                  key={`${cm.name}-${cm.startDate?.toISOString() ?? index}`}
                  className="flex flex-col gap-1 py-2 px-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-800">
                      {cm.name}
                    </span>
                    <PartyBadge party={cm.party} />
                  </div>
                  <span className="text-xs text-gray-500">
                    {tenureRange(cm.startDate, cm.endDate)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* ── Party Tenure Summary Section ── */}
        {sortedTenures.length > 0 && (
          <section className="px-5 py-4" aria-labelledby="party-tenure-heading">
            <h3
              id="party-tenure-heading"
              className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3"
            >
              Party Tenure Summary
            </h3>

            <ul
              className="space-y-2"
              aria-label={`Party tenure summary for ${state}`}
            >
              {sortedTenures.map((tenure) => {
                const color = getPartyColor(tenure.party);
                return (
                  <li
                    key={tenure.party}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    {/* Color swatch */}
                    <span
                      className="flex-shrink-0 w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {tenure.party}
                        </span>
                        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                          {tenure.totalYears.toFixed(1)} yrs
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {tenure.firstYearInPower} – {tenure.lastYearInPower}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );
};

export default StateHistoryPanel;
