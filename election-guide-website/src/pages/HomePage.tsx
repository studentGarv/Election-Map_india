import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { ElectionType } from '../types';
import { ElectionTimeline, ElectionTypeSwitcher } from '../components';
import { useAppData } from '../context/AppContext';

// ─── Type labels ──────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<ElectionType, string> = {
  lok_sabha: 'Lok Sabha',
  rajya_sabha: 'Rajya Sabha',
  state_assembly: 'State Assembly',
};

// ─── Feature highlights for homepage ──────────────────────────────────────────

const QUICK_FEATURES = [
  {
    title: 'Interactive State Map',
    desc: 'Visualize ruling parties and Chief Minister tenures across all 28 states & UTs.',
    icon: '🗺️',
    to: '/map',
    badge: 'Interactive',
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-700',
  },
  {
    title: 'Leadership Archive',
    desc: 'Chronological tenures of all Indian Prime Ministers and Presidents since 1947.',
    icon: '🏛️',
    to: '/pm-history',
    badge: 'Historical',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-700',
  },
  {
    title: 'Election Results Data',
    desc: 'Deep-dive into seat tallies, voter turnout percentages, and state party dominance.',
    icon: '📊',
    to: '/election-history',
    badge: 'Data Records',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700',
  },
  {
    title: 'Voter FAQ & Essentials',
    desc: 'Step-by-step guidance on voter ID, EVM usage, Model Code of Conduct, and rights.',
    icon: '❓',
    to: '/faq',
    badge: 'Civic Help',
    color: 'from-purple-500/10 to-pink-500/10 border-purple-200 text-purple-700',
  },
];

// ─── HomePage ─────────────────────────────────────────────────────────────────

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
    <main className="min-h-screen bg-slate-50/50">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-slate-50/60 border-b border-gray-200/80 py-12 md:py-16 px-4"
        aria-labelledby="hero-heading"
      >
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-orange-200/40 blur-3xl" />
          <div className="absolute top-12 right-1/4 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl" />
        </div>

        <div className="relative container mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-semibold mb-6 shadow-xs">
            <span>🇮🇳</span>
            <span>Citizen's Democratic Knowledge Portal</span>
          </div>

          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5"
          >
            India Election Guide
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Understand how India's elections work — from voter registration to government formation.
            Explore step-by-step timelines for Lok Sabha, Rajya Sabha, and State Assembly elections,
            browse historical results, and discover state ruling party tenures.
          </p>

          {/* Last Updated notice (Requirement 12.1) */}
          {lastUpdatedText && (
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-white/80 border border-gray-200/80 rounded-full px-3 py-1 text-xs text-gray-500 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Data last updated:</span>{' '}
                <time
                  dateTime={state.lastUpdated!.toISOString()}
                  className="font-semibold text-gray-700"
                >
                  {lastUpdatedText}
                </time>
              </div>
              {isStale && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-800 text-left max-w-lg shadow-xs"
                >
                  <span aria-hidden="true" className="text-base">⚠️</span>
                  <span>
                    This content was last updated more than 180 days ago. Please verify information with official sources such as{' '}
                    <a
                      href="https://eci.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-900 font-semibold"
                    >
                      eci.gov.in
                    </a>
                    .
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quick jump feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 text-left">
            {QUICK_FEATURES.map((feat) => (
              <Link
                key={feat.title}
                to={feat.to}
                className="group relative p-4 bg-white/90 hover:bg-white rounded-xl border border-gray-200/80 hover:border-orange-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl p-2 rounded-lg bg-gray-50 group-hover:bg-orange-50 transition-colors">
                      {feat.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-end text-xs font-semibold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                  Explore &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline Section ───────────────────────────────────────────────── */}
      <section
        className="container mx-auto px-4 py-10 max-w-6xl"
        aria-labelledby="timeline-heading"
      >
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                <span>⏱️ Step-by-Step Lifecycle</span>
              </div>
              <h2
                id="timeline-heading"
                className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight"
              >
                {TYPE_LABELS[selectedType]} Election Timeline
              </h2>
              <p className="text-gray-500 text-sm mt-1 max-w-xl">
                Explore the chronological phases of this election type. Click any stage to review its full procedures, key dates, and voter actions.
              </p>
            </div>

            {/* Election type switcher */}
            <div className="flex-shrink-0">
              <ElectionTypeSwitcher
                selectedType={selectedType}
                onChange={handleTypeChange}
              />
            </div>
          </div>

          {/* Timeline visualization */}
          <ElectionTimeline
            steps={filteredSteps}
            selectedStepId={null}
            visitedCount={0}
          />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
