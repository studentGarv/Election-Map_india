import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { buildSearchIndex, searchRecords } from '../utils/searchIndex';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';

const SearchPage: React.FC = () => {
  const { state } = useAppData();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const index = useMemo(() => buildSearchIndex(state), [state]);

  const { results, error } = useMemo(() => {
    return searchRecords(index, query);
  }, [index, query]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-3">
          <span>🔍</span>
          <span>Knowledge Base Search</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Search the Election Guide
        </h1>
        <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
          Query topics across election lifecycles, state leaders, historical results, and voter questions.
        </p>
        <SearchBar />
      </div>

      {query ? (
        <div className="mt-8">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200/80">
            <p className="text-sm text-gray-600">
              Showing results for: <span className="font-bold text-gray-900">"{query}"</span>
            </p>
            <span className="text-xs font-semibold text-gray-400">
              {results.length} {results.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          {error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 font-medium">
              {error}
            </div>
          ) : (
            <SearchResults results={results} />
          )}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-400 py-12 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
          <span className="text-4xl block mb-3 opacity-60">⌨️</span>
          <p className="text-sm font-medium text-gray-600">Type a keyword above to begin searching</p>
          <p className="text-xs text-gray-400 mt-1">E.g., "Model Code of Conduct", "Indira Gandhi", "Gujarat", "EVM"</p>
        </div>
      )}
    </main>
  );
};

export default SearchPage;
