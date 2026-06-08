import React from 'react';
import { Link } from 'react-router-dom';
import { LokSabhaRecord, PMRecord } from '../types';

interface LokSabhaResultsTableProps {
  records: LokSabhaRecord[];
  pmRecords: PMRecord[];
}

export function LokSabhaResultsTable({ records, pmRecords }: LokSabhaResultsTableProps) {
  if (!records || records.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <p className="text-sm text-yellow-700">
          No Lok Sabha data loaded. Please ask an administrator to upload the CSV file.
        </p>
      </div>
    );
  }

  // Parse election year string (e.g. "1951-52" -> 1951) for chronological sorting
  const parseStartYear = (yearStr: string) => {
    const match = yearStr.match(/^(\d{4})/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const sortedRecords = [...records].sort((a, b) => parseStartYear(a.electionYear) - parseStartYear(b.electionYear));

  // Helper to check if a PM string matches any PMRecord
  const isPMRecord = (pmName: string) => {
    return pmRecords.some(r => r.name === pmName);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Election Year</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lok Sabha Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party in Government</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats Won</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prime Minister</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRecords.map((record, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.electionYear}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.lokSabha}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.partyInGovernment}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.seatsWon !== null ? record.seatsWon : 'Unknown'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {isPMRecord(record.primeMinister) ? (
                  <Link to="/pm-history" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {record.primeMinister}
                  </Link>
                ) : (
                  record.primeMinister
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
