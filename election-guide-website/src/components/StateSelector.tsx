import { useMemo } from 'react';
import { useAppData } from '../context/AppContext';

interface StateSelectorProps {
  selectedState: string | null;
  onChange: (state: string | null) => void;
}

export function StateSelector({ selectedState, onChange }: StateSelectorProps) {
  const { state } = useAppData();
  const { statePartyTenures } = state;

  const distinctStates = useMemo(() => {
    const states = Array.from(new Set(statePartyTenures.map(t => t.state)));
    return states.sort((a, b) => a.localeCompare(b));
  }, [statePartyTenures]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-200/80">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-sm">
          📍
        </span>
        <div>
          <label htmlFor="state-select" className="text-sm font-bold text-gray-800 block">
            Select State or National Overview
          </label>
          <span className="text-xs text-gray-500">
            View national Lok Sabha records or state-level party governance
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          id="state-select"
          value={selectedState || ''}
          onChange={(e) => onChange(e.target.value ? e.target.value : null)}
          className="w-full sm:w-72 border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-800 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
        >
          <option value="">🇮🇳 National Overview (All States)</option>
          {distinctStates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {selectedState && (
          <button
            onClick={() => onChange(null)}
            className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl border border-gray-200 transition-colors whitespace-nowrap"
            title="Reset to National"
          >
            ✕ Reset
          </button>
        )}
      </div>
    </div>
  );
}
