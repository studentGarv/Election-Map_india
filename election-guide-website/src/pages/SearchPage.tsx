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
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Search Election Guide</h1>
        <SearchBar />
      </div>

      {query ? (
        <div className="mt-8">
          <p className="text-gray-600 mb-6">
            Showing results for: <span className="font-semibold text-gray-900">"{query}"</span>
          </p>
          {error ? (
            <p className="text-red-600 bg-red-50 p-4 rounded-md border border-red-200">{error}</p>
          ) : (
            <SearchResults results={results} />
          )}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500 py-12">
          Enter a keyword above to find election information, states, or leaders.
        </div>
      )}
    </main>
  );
};

export default SearchPage;
