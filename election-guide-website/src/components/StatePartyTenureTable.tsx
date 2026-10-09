import { StatePartyTenure } from '../types';
import { getPartyColor } from '../utils/partyColors';

interface StatePartyTenureTableProps {
  tenures: StatePartyTenure[];
  state: string;
}

export function StatePartyTenureTable({ tenures, state }: StatePartyTenureTableProps) {
  if (!tenures || tenures.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl my-4 text-xs sm:text-sm text-amber-800 font-medium">
        No state party tenure data available for {state}.
      </div>
    );
  }

  // Sort descending by totalYears
  const sortedTenures = [...tenures].sort((a, b) => b.totalYears - a.totalYears);

  return (
    <div className="overflow-hidden bg-white rounded-2xl shadow-xs border border-gray-200/80 my-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Party Name
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Years in Power
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                First Term Year
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Most Recent Term Year
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {sortedTenures.map((item, idx) => {
              const partyColor = getPartyColor(item.party);
              return (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: partyColor }}
                      aria-hidden="true"
                    />
                    <span>{item.party}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-orange-600">
                    {item.totalYears.toFixed(1)} yrs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {item.firstYearInPower}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {item.lastYearInPower}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
