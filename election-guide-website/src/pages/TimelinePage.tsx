import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ElectionType } from '../types';
import { ElectionTimeline, ElectionTypeSwitcher } from '../components';
import { useAppData } from '../context/AppContext';

// ─── Valid election types ─────────────────────────────────────────────────────

const VALID_TYPES: ElectionType[] = ['lok_sabha', 'rajya_sabha', 'state_assembly'];

const TYPE_LABELS: Record<ElectionType, string> = {
  lok_sabha: 'Lok Sabha',
  rajya_sabha: 'Rajya Sabha',
  state_assembly: 'State Assembly',
};

function isValidElectionType(value: string | undefined): value is ElectionType {
  return VALID_TYPES.includes(value as ElectionType);
}

// ─── TimelinePage ─────────────────────────────────────────────────────────────

/**
 * TimelinePage
 *
 * Route: /timeline/:type
 *
 * Reads the `:type` URL param to set the initial election type.
 * Renders `ElectionTypeSwitcher` to let the user switch between types;
 * switching updates the URL via `useNavigate` to keep the address bar in sync.
 * Passes filtered `electionSteps` to `ElectionTimeline`.
 * Shows the "Last Updated" date (Requirement 12).
 */
const TimelinePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { state } = useAppData();

  // Derive the active election type from the URL param, defaulting to lok_sabha
  const selectedType: ElectionType = isValidElectionType(type) ? type : 'lok_sabha';

  // Filter steps to those matching the selected election type
  const filteredSteps = useMemo(
    () => state.electionSteps.filter((step) => step.electionType === selectedType),
    [state.electionSteps, selectedType],
  );

  // When the user switches type, update the URL to reflect the new selection
  const handleTypeChange = (newType: ElectionType) => {
    navigate(`/timeline/${newType}`, { replace: true });
  };

  // Format lastUpdated for display
  const lastUpdatedText = state.lastUpdated
    ? state.lastUpdated.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Staleness check: warn if last updated more than 180 days ago
  const isStale =
    state.lastUpdated !== null &&
    Date.now() - state.lastUpdated.getTime() > 180 * 24 * 60 * 60 * 1000;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {TYPE_LABELS[selectedType]} Election Timeline
        </h1>
        <p className="text-gray-600 text-sm">
          Chronological timeline of the {TYPE_LABELS[selectedType]} election process.
        </p>
      </div>

      {/* Last Updated notice (Requirement 12) */}
      {lastUpdatedText && (
        <div className="mb-4 flex flex-col gap-2">
          <p className="text-xs text-gray-500">
            Last updated:{' '}
            <time dateTime={state.lastUpdated!.toISOString()} className="font-medium text-gray-700">
              {lastUpdatedText}
            </time>
          </p>
          {isStale && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              <span aria-hidden="true">⚠️</span>
              <span>
                This content was last updated more than 180 days ago. Please verify
                information with official sources such as{' '}
                <a
                  href="https://eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-900 font-medium"
                >
                  eci.gov.in
                </a>
                .
              </span>
            </div>
          )}
        </div>
      )}

      {/* Election type switcher */}
      <div className="mb-6">
        <ElectionTypeSwitcher
          selectedType={selectedType}
          onChange={handleTypeChange}
        />
      </div>

      {/* Timeline */}
      <ElectionTimeline
        steps={filteredSteps}
        selectedStepId={null}
        visitedCount={0}
      />
    </main>
  );
};

export default TimelinePage;
