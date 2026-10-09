import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ElectionStep } from '../types';
import { sortElectionSteps } from '../utils/electionUtils';

// ─── ProgressTracker ─────────────────────────────────────────────────────────

interface ProgressTrackerProps {
  /** Number of steps the user has visited this session. */
  visited: number;
  /** Total number of steps in the current election type. */
  total: number;
}

/**
 * ProgressTracker — shows visited / total steps for the current election type.
 */
export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ visited, total }) => {
  const allDone = total > 0 && visited >= total;
  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;

  return (
    <div
      className="flex flex-col gap-1.5 bg-amber-50/70 border border-amber-200/80 rounded-xl px-4 py-3 shadow-sm text-sm"
      aria-label={`Progress: ${visited} of ${total} steps visited`}
      role="status"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-slate-800 text-xs">
          Completed {visited} of {total} Key Steps
        </span>
        <span className="text-amber-800 font-bold text-xs bg-amber-100 px-2 py-0.5 rounded-full">{pct}%</span>
      </div>
      {/* Progress bar */}
      <div
        className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={visited}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {allDone && (
        <p className="text-emerald-700 text-xs font-semibold mt-0.5 flex items-center gap-1">
          <span>✓</span>
          <span>You've reviewed the full election cycle!</span>
        </p>
      )}
    </div>
  );
};

// ─── ElectionTimeline ─────────────────────────────────────────────────────────

export interface ElectionTimelineProps {
  /**
   * Pre-filtered steps for the desired election type.
   * The component will sort them by `order` ascending.
   */
  steps: ElectionStep[];
  /**
   * The `id` of the currently selected / active step, or `null` when
   * no step is highlighted.
   */
  selectedStepId: string | null;
  /**
   * Number of steps visited this session (forwarded to ProgressTracker).
   */
  visitedCount?: number;
}

/**
 * ElectionTimeline
 *
 * Renders an ordered list of election steps with:
 * - Horizontal layout on desktop (md+), vertical layout on mobile.
 * - Each step node navigates to `/guide/:stepId` on click.
 * - The step matching `selectedStepId` is visually highlighted.
 * - An overlaid `ProgressTracker` shows visited / total progress.
 */
const ElectionTimeline: React.FC<ElectionTimelineProps> = ({
  steps,
  selectedStepId,
  visitedCount = 0,
}) => {
  const navigate = useNavigate();
  const sorted = sortElectionSteps(steps);

  const handleStepClick = (stepId: string) => {
    navigate(`/guide/${stepId}`);
  };

  const handleStepKeyDown = (e: React.KeyboardEvent, stepId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/guide/${stepId}`);
    }
  };

  if (sorted.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 font-medium">
        No steps available for this election type.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Tracker — overlaid above the timeline */}
      <div className="mb-6">
        <ProgressTracker visited={visitedCount} total={sorted.length} />
      </div>

      {/* Timeline track */}
      <div
        className="relative flex flex-col md:flex-row md:items-start md:overflow-x-auto gap-0 md:gap-0 pb-2"
        role="list"
        aria-label="Election process timeline"
      >
        {sorted.map((step, index) => {
          const isSelected = step.id === selectedStepId;
          const isLast = index === sorted.length - 1;

          return (
            <div
              key={step.id}
              role="listitem"
              className={`
                relative flex
                /* Mobile: vertical — step node left, content right */
                flex-row items-start gap-4
                /* Desktop: vertical stack within horizontal track — node on top, content below */
                md:flex-col md:items-center md:gap-2
                /* Horizontal sizing on desktop */
                md:flex-1 md:min-w-[130px] md:max-w-[210px]
                pb-8 md:pb-0
              `}
            >
              {/* Connector line */}
              {!isLast && (
                <>
                  {/* Mobile vertical connector */}
                  <div
                    className="
                      absolute left-[19px] top-[40px] w-0.5 h-full -z-0
                      bg-amber-200
                      md:hidden
                    "
                    aria-hidden="true"
                  />
                  {/* Desktop horizontal connector */}
                  <div
                    className="
                      hidden md:block
                      absolute top-[20px] left-1/2 w-full h-0.5
                      bg-amber-200 -z-0
                    "
                    aria-hidden="true"
                  />
                </>
              )}

              {/* Step node (circle) */}
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                onKeyDown={(e) => handleStepKeyDown(e, step.id)}
                aria-label={`Step ${step.order}: ${step.title}${isSelected ? ' (current)' : ''}`}
                aria-current={isSelected ? 'step' : undefined}
                className={`
                  relative z-10 flex-shrink-0 flex items-center justify-center
                  w-10 h-10 rounded-full border-2 text-sm font-bold
                  transition-all duration-200 cursor-pointer shadow-xs
                  focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
                  ${
                    isSelected
                      ? 'bg-amber-600 border-amber-700 text-white shadow-md scale-110'
                      : 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-500 hover:scale-105'
                  }
                `}
              >
                {step.order}
              </button>

              {/* Step label */}
              <div
                className={`
                  flex-1 md:flex-none
                  md:text-center
                  cursor-pointer
                  ${isSelected ? 'text-amber-800' : 'text-slate-700'}
                `}
                onClick={() => handleStepClick(step.id)}
                aria-hidden="true"
              >
                <p
                  className={`
                    text-xs font-semibold leading-snug
                    ${isSelected ? 'text-amber-700' : 'text-slate-800'}
                    hover:text-amber-600 transition-colors
                    md:mt-1
                  `}
                >
                  {step.title}
                </p>
                <p
                  className={`
                    text-xs mt-0.5 leading-tight
                    ${isSelected ? 'text-amber-600 font-medium' : 'text-slate-400'}
                    hidden md:block
                  `}
                >
                  {step.dateRange.length > 40
                    ? step.dateRange.substring(0, 38) + '…'
                    : step.dateRange}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElectionTimeline;
