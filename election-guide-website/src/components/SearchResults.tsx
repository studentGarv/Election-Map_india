import { Link } from 'react-router-dom';
import { SearchResult } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
        <span className="text-3xl block mb-2">🔍</span>
        <p className="text-gray-700 font-semibold text-base">No matching results found</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
          Try searching for a state name (e.g., "Maharashtra"), a national leader (e.g., "Nehru"), or an election term (e.g., "Lok Sabha").
        </p>
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'step':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cm':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pm':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'president':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'faq':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'step': return 'Guide Step';
      case 'cm': return 'Chief Minister';
      case 'pm': return 'Prime Minister';
      case 'president': return 'President';
      case 'faq': return 'FAQ Entry';
      default: return type.toUpperCase();
    }
  };

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <Link
          key={`${result.type}-${result.id}`}
          to={result.route}
          className="group block p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/80 hover:border-orange-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(result.type)}`}>
              {getTypeLabel(result.type)}
            </span>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
              {result.title}
            </h3>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{result.snippet}</p>
          <div className="mt-2 text-right">
            <span className="text-xs font-semibold text-orange-600 group-hover:translate-x-1 inline-block transition-transform">
              View Details &rarr;
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
