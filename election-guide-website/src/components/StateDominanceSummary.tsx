import React from 'react';
import { StatePartyTenure } from '../types';

interface StateDominanceSummaryProps {
  tenures: StatePartyTenure[];
  state: string;
}

export function StateDominanceSummary({ tenures, state }: StateDominanceSummaryProps) {
  if (!tenures || tenures.length === 0) return null;

  const dominantParty = tenures.reduce((max, current) => 
    (current.totalYears > max.totalYears) ? current : max
  , tenures[0]);

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 my-4">
      <p className="text-indigo-900 text-lg">
        <span className="font-bold">{dominantParty.party}</span> has held power in <span className="font-semibold">{state}</span> for the longest cumulative period (<span className="font-bold">{dominantParty.totalYears.toFixed(1)}</span> years).
      </p>
    </div>
  );
}
