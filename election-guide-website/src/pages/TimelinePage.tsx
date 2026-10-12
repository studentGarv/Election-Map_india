import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ElectionType } from '../types';
import { ElectionTimeline, ElectionTypeSwitcher } from '../components';
import { useAppData } from '../context/AppContext';
import { isStale, formatDate } from '../utils/dateUtils';

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
  const lastUpdatedText = formatDate(state.lastUpdated) || null;

  // Staleness check: warn if last updated more than 180 days ago
  const stale = isStale(state.lastUpdated);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page heading */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-semibold rounded-full mb-3">
          <span>🇮🇳 Process Timeline</span>
          <span>•</span>
          <span>Stage-by-Stage Roadmap</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {TYPE_LABELS[selectedType]} Election Timeline
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Chronological breakdown of key constitutional phases, regulatory milestones, polling dates, and counting procedures in the {TYPE_LABELS[selectedType]} electoral cycle.
        </p>
      </div>

      {/* Last Updated notice (Requirement 12) */}
      {lastUpdatedText && (
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Last updated:</span>{' '}
            <time dateTime={state.lastUpdated!.toISOString()} className="font-semibold text-slate-700">
              {lastUpdatedText}
            </time>
          </p>
          {stale && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800"
            >
              <span aria-hidden="true">⚠️</span>
              <span>
                This content was last updated more than 180 days ago. Please verify
                information with official sources such as{' '}
                <a
                  href="https://eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-950 font-bold"
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
      <div className="mb-8">
        <ElectionTypeSwitcher
          selectedType={selectedType}
          onChange={handleTypeChange}
        />
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <ElectionTimeline
          steps={filteredSteps}
          selectedStepId={null}
          visitedCount={0}
        />
      </div>
    </main>
  );
};

export default TimelinePage;
