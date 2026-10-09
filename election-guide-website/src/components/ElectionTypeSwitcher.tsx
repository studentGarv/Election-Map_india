import React from 'react';
import type { ElectionType } from '../types';

// ─── Tab configuration ────────────────────────────────────────────────────────

interface TabConfig {
  type: ElectionType;
  label: string;
}

const TABS: TabConfig[] = [
  { type: 'lok_sabha',      label: 'Lok Sabha'      },
  { type: 'rajya_sabha',    label: 'Rajya Sabha'    },
  { type: 'state_assembly', label: 'State Assembly' },
];

// ─── ElectionTypeSwitcher ─────────────────────────────────────────────────────

export interface ElectionTypeSwitcherProps {
  /** The currently selected election type. */
  selectedType: ElectionType;
  /** Called when the user selects a different election type. */
  onChange: (type: ElectionType) => void;
}

/**
 * ElectionTypeSwitcher
 *
 * Renders three accessible tabs — Lok Sabha, Rajya Sabha, State Assembly —
 * that let the user switch the active election type context.
 *
 * Accessibility:
 * - `role="tablist"` on the container.
 * - Each tab has `role="tab"` and `aria-selected`.
 * - Keyboard navigation: Arrow keys move focus between tabs; Enter/Space select.
 */
const ElectionTypeSwitcher: React.FC<ElectionTypeSwitcherProps> = ({
  selectedType,
  onChange,
}) => {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = TABS.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      onChange(TABS[nextIndex].type);
      // Move browser focus to the newly selected tab
      const tabList = (e.currentTarget as HTMLElement).closest('[role="tablist"]');
      if (tabList) {
        const buttons = tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        buttons[nextIndex]?.focus();
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Election type"
      className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 shadow-2xs gap-1"
    >
      {TABS.map(({ type, label }, index) => {
        const isSelected = type === selectedType;
        return (
          <button
            key={type}
            role="tab"
            id={`election-tab-${type}`}
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(type)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 whitespace-nowrap
              ${
                isSelected
                  ? 'bg-white text-orange-600 shadow-xs border border-gray-200/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-slate-200/50'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ElectionTypeSwitcher;
