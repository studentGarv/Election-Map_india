import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
      {query ? (
        <p className="text-gray-600">
          Showing results for: <span className="font-semibold text-gray-900">"{query}"</span>
        </p>
      ) : (
        <p className="text-gray-600">Enter a search term to find election information.</p>
      )}
      <p className="mt-4 text-sm text-orange-600 font-medium">Coming Soon — Full search functionality will be available shortly.</p>
    </main>
  );
};

export default SearchPage;
