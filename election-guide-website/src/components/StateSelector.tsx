import React, { useMemo } from 'react';
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
    <div className="mb-6">
      <label htmlFor="state-selector" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by State
      </label>
      <select
        id="state-selector"
        value={selectedState || ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
        className="block w-full sm:max-w-xs p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
      >
        <option value="">Select a state...</option>
        {distinctStates.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
    </div>
  );
}
