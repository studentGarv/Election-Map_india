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
      className="inline-flex rounded-lg border border-orange-200 bg-orange-50 p-1 gap-1"
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
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1
              ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-orange-700 hover:bg-orange-100 hover:text-orange-900'
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
