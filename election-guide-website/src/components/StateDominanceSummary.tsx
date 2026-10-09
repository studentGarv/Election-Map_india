import { StatePartyTenure } from '../types';
import { getPartyColor } from '../utils/partyColors';

interface StateDominanceSummaryProps {
  tenures: StatePartyTenure[];
  state: string;
}

export function StateDominanceSummary({ tenures, state }: StateDominanceSummaryProps) {
  if (!tenures || tenures.length === 0) return null;

  const dominantParty = tenures.reduce((max, current) => 
    (current.totalYears > max.totalYears) ? current : max
  , tenures[0]);

  const partyColor = getPartyColor(dominantParty.party);

  return (
    <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-xs my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: partyColor }} />
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Historical Governance Dominance
        </h3>
      </div>
      <p className="text-sm text-gray-800 leading-relaxed">
        In <strong className="text-gray-900">{state}</strong>, the{' '}
        <span className="inline-flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-900">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: partyColor }} />
          {dominantParty.party}
        </span>{' '}
        has held governance the longest, totaling{' '}
        <strong className="text-orange-600 font-bold">{dominantParty.totalYears.toFixed(1)} years</strong>.
      </p>
    </div>
  );
}
