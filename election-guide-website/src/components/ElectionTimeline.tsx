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
 *
 * Reads from `useGuideProgress` when that hook is fully wired; for now it
 * accepts counts as props so the parent can pass sessionStorage-derived values
 * or defaults (0 visited until the hook is ready).
 */
export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ visited, total }) => {
  const allDone = total > 0 && visited >= total;
  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;

  return (
    <div
      className="flex flex-col gap-1 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-lg px-4 py-2 shadow-sm text-sm"
      aria-label={`Progress: ${visited} of ${total} steps visited`}
      role="status"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-gray-700">
          {visited} / {total} steps
        </span>
        <span className="text-orange-600 font-semibold">{pct}%</span>
      </div>
      {/* Progress bar */}
      <div
        className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={visited}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {allDone && (
        <p className="text-green-700 font-medium mt-0.5">
          ✓ You've reviewed the full election process!
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
   * Defaults to 0 — callers should wire this to `useGuideProgress` once
   * that hook is available.
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
      <div className="text-center py-8 text-gray-500">
        No steps available for this election type.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Tracker — overlaid above the timeline */}
      <div className="mb-4">
        <ProgressTracker visited={visitedCount} total={sorted.length} />
      </div>

      {/*
        Timeline wrapper
        - Mobile (default): vertical flex column, steps stacked top-to-bottom.
        - Desktop (md+): horizontal flex row, steps arranged left-to-right.
      */}
      <div
        className="relative flex flex-col md:flex-row md:items-start md:overflow-x-auto gap-0 md:gap-0"
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
                flex-row items-start gap-3
                /* Desktop: vertical stack within horizontal track — node on top, content below */
                md:flex-col md:items-center md:gap-2
                /* Horizontal sizing on desktop */
                md:flex-1 md:min-w-[120px] md:max-w-[200px]
                pb-6 md:pb-0
              `}
            >
              {/* ── Connector line ─────────────────────────────────────────
                Mobile: a vertical line running from the node down to the
                next item (left edge, centred under the circle).
                Desktop: a horizontal line running right from this node to
                the next node (hidden on last item).
              ─────────────────────────────────────────────────────────── */}
              {!isLast && (
                <>
                  {/* Mobile vertical connector */}
                  <div
                    className="
                      absolute left-[18px] top-[36px] w-0.5 h-full -z-0
                      bg-orange-200
                      md:hidden
                    "
                    aria-hidden="true"
                  />
                  {/* Desktop horizontal connector */}
                  <div
                    className="
                      hidden md:block
                      absolute top-[18px] left-1/2 w-full h-0.5
                      bg-orange-200 -z-0
                    "
                    aria-hidden="true"
                  />
                </>
              )}

              {/* ── Step node (circle) ──────────────────────────────────── */}
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                onKeyDown={(e) => handleStepKeyDown(e, step.id)}
                aria-label={`Step ${step.order}: ${step.title}${isSelected ? ' (current)' : ''}`}
                aria-current={isSelected ? 'step' : undefined}
                className={`
                  relative z-10 flex-shrink-0 flex items-center justify-center
                  w-9 h-9 rounded-full border-2 text-sm font-bold
                  transition-all duration-200 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                  ${
                    isSelected
                      ? 'bg-orange-500 border-orange-600 text-white shadow-md scale-110'
                      : 'bg-white border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-500 hover:scale-105'
                  }
                `}
              >
                {step.order}
              </button>

              {/* ── Step label ──────────────────────────────────────────── */}
              <div
                className={`
                  flex-1 md:flex-none
                  md:text-center
                  cursor-pointer
                  ${isSelected ? 'text-orange-700' : 'text-gray-700'}
                `}
                onClick={() => handleStepClick(step.id)}
                aria-hidden="true"
              >
                <p
                  className={`
                    text-xs leading-snug font-medium
                    ${isSelected ? 'text-orange-700' : 'text-gray-700'}
                    hover:text-orange-600 transition-colors
                    md:mt-1
                  `}
                >
                  {step.title}
                </p>
                <p
                  className={`
                    text-xs mt-0.5 leading-tight
                    ${isSelected ? 'text-orange-500' : 'text-gray-400'}
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
