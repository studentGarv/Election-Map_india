import React, { useState } from 'react';
import { useAppData } from '../context/AppContext';
import { getPartyColor } from '../utils/partyColors';
import { getPMTenureInfo } from '../data/pmTenureData';

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

  // Sort chronologically using record.startDate or known tenure sortKey or election year
  const sortedRecords = [...pmRecords].sort((a, b) => {
    if (a.startDate && b.startDate) {
      return a.startDate.getTime() - b.startDate.getTime();
    }
    const infoA = getPMTenureInfo(a.name, a.lokSabha, a.electionYear);
    const infoB = getPMTenureInfo(b.name, b.lokSabha, b.electionYear);
    const keyA = a.startDate ? a.startDate.getFullYear() : infoA?.sortKey ?? (parseInt(a.electionYear, 10) || 0);
    const keyB = b.startDate ? b.startDate.getFullYear() : infoB?.sortKey ?? (parseInt(b.electionYear, 10) || 0);
    return keyA - keyB;
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
              const tenureInfo = getPMTenureInfo(record.name, record.lokSabha, record.electionYear);

              const tenureDisplay = record.startDate
                ? `${record.startDate.getFullYear()} – ${record.endDate ? record.endDate.getFullYear() : 'Present'}`
                : (tenureInfo?.tenurePeriod ?? record.electionYear);

              const fullDates = record.startDate
                ? `${record.startDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} – ${record.endDate ? record.endDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Present'}`
                : (tenureInfo?.fullDates ?? tenureDisplay);

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
                    <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 font-medium">
                      {tenureDisplay}
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
                        <div className="p-4 bg-white rounded-xl border border-slate-200/70 text-xs sm:text-sm text-gray-700 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
                            <span className="font-bold text-gray-900">
                              🗓️ Exact Tenure Period: <span className="font-semibold text-orange-600">{fullDates}</span>
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              Term: {tenureDisplay}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed pt-1">
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
