import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ElectionType } from '../types';
import { ElectionTimeline, ElectionTypeSwitcher } from '../components';
import { useAppData } from '../context/AppContext';

// ─── Type labels ──────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<ElectionType, string> = {
  lok_sabha: 'Lok Sabha',
  rajya_sabha: 'Rajya Sabha',
  state_assembly: 'State Assembly',
};

// ─── HomePage ─────────────────────────────────────────────────────────────────

/**
 * HomePage
 *
 * Route: /
 *
 * Entry point for the India Election Guide website. Renders:
 * - Hero section with title and brief description
 * - ElectionTypeSwitcher — defaults to 'lok_sabha' (Requirement 1.2)
 * - ElectionTimeline filtered to the selected election type
 * - "Last Updated" date (Requirement 12.1)
 *
 * Switching the election type navigates to /timeline/:type so the URL stays
 * shareable, while the homepage pre-selects Lok Sabha as the default view.
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppData();

  // Default to Lok Sabha per spec
  const [selectedType, setSelectedType] = useState<ElectionType>('lok_sabha');

  // Filter steps to the currently selected election type
  const filteredSteps = useMemo(
    () => state.electionSteps.filter((step) => step.electionType === selectedType),
    [state.electionSteps, selectedType],
  );

  // Switching type navigates to the full TimelinePage for that type
  const handleTypeChange = (newType: ElectionType) => {
    setSelectedType(newType);
    navigate(`/timeline/${newType}`);
  };

  // Format lastUpdated for display (Requirement 12.1)
  const lastUpdatedText = state.lastUpdated
    ? state.lastUpdated.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Staleness check: warn if data is more than 180 days old
  const isStale =
    state.lastUpdated !== null &&
    Date.now() - state.lastUpdated.getTime() > 180 * 24 * 60 * 60 * 1000;

  return (
    <main>
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section
        className="bg-gradient-to-br from-orange-50 via-white to-orange-50 border-b border-orange-100 py-12 px-4"
        aria-labelledby="hero-heading"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <h1
            id="hero-heading"
            className="text-4xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            India Election Guide
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Understand how India's elections work — from voter registration to
            government formation. Explore step-by-step timelines for Lok Sabha,
            Rajya Sabha, and State Assembly elections, browse historical results,
            and find answers to common questions about India's democratic process.
          </p>

          {/* Last Updated notice (Requirement 12.1) */}
          {lastUpdatedText && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-gray-400">
                Data last updated:{' '}
                <time
                  dateTime={state.lastUpdated!.toISOString()}
                  className="font-medium text-gray-600"
                >
                  {lastUpdatedText}
                </time>
              </p>
              {isStale && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 text-left max-w-lg"
                >
                  <span aria-hidden="true">⚠️</span>
                  <span>
                    This content was last updated more than 180 days ago. Please
                    verify information with official sources such as{' '}
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
        </div>
      </section>

      {/* ── Timeline Section ───────────────────────────────────────────────── */}
      <section
        className="container mx-auto px-4 py-8"
        aria-labelledby="timeline-heading"
      >
        <div className="mb-6">
          <h2
            id="timeline-heading"
            className="text-2xl font-semibold text-gray-900 mb-1"
          >
            {TYPE_LABELS[selectedType]} Election Timeline
          </h2>
          <p className="text-gray-500 text-sm">
            Select an election type to explore its step-by-step process. Click
            any step to read full details.
          </p>
        </div>

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
      </section>
    </main>
  );
};

export default HomePage;
