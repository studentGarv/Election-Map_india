import React, { useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/map', label: 'Map' },
  { to: '/guide', label: 'Guide' },
  { to: '/pm-history', label: 'PM History' },
  { to: '/president-history', label: 'President History' },
  { to: '/election-history', label: 'Election History' },
  { to: '/faq', label: 'FAQ' },
  { to: '/search', label: 'Search' },
  { to: '/admin', label: 'Admin' },
];

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setMenuOpen(false);
    } else if (trimmed.length > 0) {
      // Focus the input to show the validation hint
      searchInputRef.current?.focus();
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 rounded px-1 py-0.5 ${
      isActive
        ? 'text-orange-600 underline underline-offset-4'
        : 'text-gray-700 hover:text-orange-600'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Site logo / brand */}
          <Link
            to="/"
            className="flex-shrink-0 text-lg font-bold text-orange-600 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
            aria-label="India Election Guide — Home"
          >
            🗳️ Election Guide
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-4 flex-wrap"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={navLinkClass} aria-label={label}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Search form (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2"
            role="search"
            aria-label="Site search"
          >
            <label htmlFor="navbar-search" className="sr-only">
              Search
            </label>
            <input
              id="navbar-search"
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              minLength={2}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              aria-label="Search the election guide"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1"
              aria-label="Submit search"
            >
              Go
            </button>
          </form>

          {/* ECI link (desktop) */}
          <a
            href="https://eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
            aria-label="Election Commission of India website (opens in new tab)"
          >
            ECI ↗
          </a>

          {/* Hamburger button (mobile) */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {/* Mobile search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2"
              role="search"
              aria-label="Site search (mobile)"
            >
              <label htmlFor="navbar-search-mobile" className="sr-only">
                Search
              </label>
              <input
                id="navbar-search-mobile"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                minLength={2}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                aria-label="Search the election guide"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Submit search"
              >
                Go
              </button>
            </form>

            {/* Mobile nav links */}
            <nav aria-label="Primary navigation (mobile)">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={navLinkClass}
                      aria-label={label}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile ECI link */}
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-700 hover:text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Election Commission of India website (opens in new tab)"
            >
              Election Commission of India ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
