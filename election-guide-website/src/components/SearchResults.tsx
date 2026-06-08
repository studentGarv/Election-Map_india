import React from 'react';
import { Link } from 'react-router-dom';
import { SearchResult } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No results found for your query.</p>
        <p className="text-gray-400 mt-2">Try searching for a state name, "Lok Sabha", or a party.</p>
      </div>
    );
  }

  // Group by type
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'step': return 'Guide Steps';
      case 'cm': return 'State Chief Ministers';
      case 'pm': return 'Prime Ministers';
      case 'president': return 'Presidents';
      case 'faq': return 'Frequently Asked Questions';
      default: return 'Other';
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{getTypeLabel(type)}</h2>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id}>
                <Link to={item.route} className="block group">
                  <h3 className="text-lg font-medium text-indigo-600 group-hover:text-indigo-800 group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{item.snippet}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
