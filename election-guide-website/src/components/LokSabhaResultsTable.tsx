import { Link } from 'react-router-dom';
import { LokSabhaRecord, PMRecord } from '../types';
import { getPartyColor } from '../utils/partyColors';

interface LokSabhaResultsTableProps {
  records: LokSabhaRecord[];
  pmRecords: PMRecord[];
}

export function LokSabhaResultsTable({ records, pmRecords }: LokSabhaResultsTableProps) {
  if (!records || records.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-xs mt-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-xs sm:text-sm text-amber-800 font-medium">
            No Lok Sabha data loaded. Please ask an administrator to upload the CSV file.
          </p>
        </div>
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
    <div className="overflow-hidden bg-white rounded-2xl shadow-xs border border-gray-200/80 mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Election Year
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Lok Sabha Term
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ruling Government
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Seats Won
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Prime Minister
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {sortedRecords.map((record, idx) => {
              const partyColor = getPartyColor(record.partyInGovernment);
              return (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                    {record.electionYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                    {record.lokSabha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 border border-gray-200">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: partyColor }}
                        aria-hidden="true"
                      />
                      <span className="text-gray-700">{record.partyInGovernment}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-orange-600">
                    {record.seatsWon !== null ? `${record.seatsWon}` : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                    {isPMRecord(record.primeMinister) ? (
                      <Link
                        to="/pm-history"
                        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold hover:underline"
                      >
                        <span>{record.primeMinister}</span>
                        <span className="text-[10px]">↗</span>
                      </Link>
                    ) : (
                      record.primeMinister
                    )}
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
