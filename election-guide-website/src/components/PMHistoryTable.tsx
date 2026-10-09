import React, { useState } from 'react';
import { useAppData } from '../context/AppContext';
import { getPartyColor } from '../utils/partyColors';

export function PMHistoryTable() {
  const { state } = useAppData();
  const { pmRecords } = state;
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!pmRecords || pmRecords.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-xs sm:text-sm text-amber-800 font-medium">
            No Prime Minister data currently loaded. Please upload the dataset in Admin.
          </p>
        </div>
      </div>
    );
  }

  // Sort chronologically
  const sortedRecords = [...pmRecords].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.getTime() - b.startDate.getTime();
  });

  return (
    <div className="overflow-hidden bg-white rounded-2xl shadow-xs border border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Prime Minister
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Party Affiliation
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tenure Period
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Lok Sabha Term
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {sortedRecords.map((record, idx) => {
              const partyColor = getPartyColor(record.party);
              const isExpanded = expandedRow === idx;
              return (
                <React.Fragment key={idx}>
                  <tr 
                    className={`cursor-pointer transition-colors ${
                      isExpanded ? 'bg-orange-50/50' : 'hover:bg-slate-50/80'
                    }`}
                    onClick={() => setExpandedRow(isExpanded ? null : idx)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
                        {record.name.charAt(0)}
                      </div>
                      <span>{record.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 border border-gray-200">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: partyColor }}
                          aria-hidden="true"
                        />
                        <span className="text-gray-700">{record.party}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-medium">
                      {record.startDate ? record.startDate.getFullYear() : 'Unknown'} &ndash; {record.endDate ? record.endDate.getFullYear() : 'Present'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-orange-600 font-semibold hover:text-orange-700">
                      <span>{record.lokSabha} ({record.electionYear})</span>
                      <svg
                        className={`inline w-4 h-4 ml-1.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-slate-50/90 border-t border-slate-200/80 animate-fade-in">
                        <div className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs sm:text-sm text-gray-700">
                          <span className="font-bold text-gray-900 block mb-1">
                            🗳️ Mandate &amp; Lok Sabha Details:
                          </span>
                          <p className="text-gray-600 leading-relaxed">
                            Elected to the <span className="font-semibold text-gray-800">{record.lokSabha} Lok Sabha</span> in the <span className="font-semibold text-gray-800">{record.electionYear}</span> general elections.
                            The ruling party won <span className="font-semibold text-gray-800">{record.seatsWon !== null ? `${record.seatsWon} seats` : 'an unknown number of seats'}</span>.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
