import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync input with URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
    } else {
      setQuery('');
    }
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setError('Please enter a valid search term.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Search query must be at least 2 characters long.');
      return;
    }
    setError(null);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
          <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          type="search" 
          id="default-search" 
          className="block w-full py-3.5 pl-11 pr-24 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-white shadow-xs focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
          placeholder="Search processes, leaders, states, or FAQs..." 
          required 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
          }}
          aria-label="Search"
        />
        <button
          type="submit"
          className="absolute right-2 text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-semibold rounded-xl text-xs sm:text-sm px-4 py-2 transition-all shadow-xs"
        >
          Search
        </button>
      </div>
      {error && <p className="text-xs text-red-600 font-medium mt-1.5 ml-2">{error}</p>}
    </form>
  );
}
