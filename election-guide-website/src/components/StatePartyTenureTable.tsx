import React from 'react';
import { StatePartyTenure } from '../types';

interface StatePartyTenureTableProps {
  tenures: StatePartyTenure[];
  state: string;
}

export function StatePartyTenureTable({ tenures, state }: StatePartyTenureTableProps) {
  if (!tenures || tenures.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md my-4">
        <p className="text-sm text-yellow-700">No data available for {state}.</p>
      </div>
    );
  }

  const sortedTenures = [...tenures].sort((a, b) => b.totalYears - a.totalYears);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Years in Power</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Year in Power</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Year in Power</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTenures.map((tenure, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tenure.party}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenure.totalYears.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenure.firstYearInPower}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenure.lastYearInPower}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
