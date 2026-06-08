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
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          type="search" 
          id="default-search" 
          className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Search topics, states, leaders..." 
          required 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
          }}
          aria-label="Search"
        />
        <button type="submit" className="text-white absolute right-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-md text-sm px-4 py-1.5">Search</button>
      </div>
      {error && <p className="absolute text-sm text-red-600 mt-1 left-1">{error}</p>}
    </form>
  );
}
