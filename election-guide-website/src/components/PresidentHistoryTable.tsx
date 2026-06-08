import React, { useState } from 'react';
import { useAppData } from '../context/AppContext';

export function PresidentHistoryTable() {
  const { state } = useAppData();
  const { presidentRecords } = state;
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!presidentRecords || presidentRecords.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              No President data loaded. Please ask an administrator to upload the CSV file.
            </p>
          </div>
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
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">President</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party / Background</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRecords.map((record, idx) => (
            <React.Fragment key={idx}>
              <tr 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center justify-between">
                  {record.name}
                  <svg className={`inline w-4 h-4 ml-2 text-gray-400 transition-transform ${expandedRow === idx ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.party || 'Independent'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.startDate ? record.startDate.toLocaleDateString() : 'Unknown'} - {record.endDate ? record.endDate.toLocaleDateString() : 'Present'}
                </td>
              </tr>
              {expandedRow === idx && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="text-sm text-gray-800 leading-relaxed max-w-4xl">
                      <strong>Term Description:</strong> 
                      <p className="mt-2 text-gray-600">
                        {record.description}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
