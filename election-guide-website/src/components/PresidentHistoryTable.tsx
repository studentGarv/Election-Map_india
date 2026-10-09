import React, { useState } from 'react';
import { useAppData } from '../context/AppContext';

export function PresidentHistoryTable() {
  const { state } = useAppData();
  const { presidentRecords } = state;
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!presidentRecords || presidentRecords.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-xs sm:text-sm text-amber-800 font-medium">
            No President data currently loaded.
          </p>
        </div>
      </div>
    );
  }

  // Sort chronologically
  const sortedRecords = [...presidentRecords].sort((a, b) => {
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
                President
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Party / Background
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tenure Period
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {sortedRecords.map((record, idx) => {
              const isExpanded = expandedRow === idx;
              return (
                <React.Fragment key={idx}>
                  <tr 
                    className={`cursor-pointer transition-colors ${
                      isExpanded ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'
                    }`}
                    onClick={() => setExpandedRow(isExpanded ? null : idx)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                          {record.name.charAt(0)}
                        </div>
                        <span>{record.name}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-400 ml-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
                        {record.party || 'Independent / Non-partisan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-medium">
                      {record.startDate ? record.startDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Unknown'} &ndash; {record.endDate ? record.endDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Present'}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 bg-slate-50/90 border-t border-slate-200/80 animate-fade-in">
                        <div className="p-4 bg-white rounded-xl border border-slate-200/70 text-xs sm:text-sm text-gray-700">
                          <strong className="text-gray-900 block mb-1">Term Description:</strong> 
                          <p className="text-gray-600 leading-relaxed">
                            {record.description}
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
