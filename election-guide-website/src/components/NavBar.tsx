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
      searchInputRef.current?.focus();
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs xl:text-sm font-medium transition-all px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 whitespace-nowrap ${
      isActive
        ? 'bg-orange-50 text-orange-600 font-semibold shadow-xs border border-orange-200/60'
        : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center text-sm font-medium transition-all px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
      isActive
        ? 'bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500'
        : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50 shadow-xs">
      {/* Tricolor accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600" />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Site logo / brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg p-1"
            aria-label="India Election Guide — Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform text-lg">
              🗳️
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors tracking-tight">
                Election Guide
              </span>
              <span className="hidden sm:block text-[10px] text-gray-600 font-medium tracking-wider uppercase -mt-0.5">
                India Democratic Guide
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-1 justify-center max-w-4xl px-2"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={navLinkClass} aria-label={label}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Search form (desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center relative"
              role="search"
              aria-label="Site search"
            >
              <label htmlFor="navbar-search" className="sr-only">
                Search
              </label>
              <div className="relative flex items-center">
                <svg
                  className="w-4 h-4 text-gray-600 absolute left-2.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  id="navbar-search"
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guide…"
                  minLength={2}
                  className="w-36 lg:w-44 pl-8 pr-12 py-1.5 text-xs lg:text-sm bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:w-52"
                  aria-label="Search the election guide"
                />
                <button
                  type="submit"
                  className="absolute right-1 text-xs bg-orange-500 hover:bg-orange-600 text-white font-medium px-2 py-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-orange-400"
                  aria-label="Submit search"
                >
                  Go
                </button>
              </div>
            </form>

            {/* ECI link (desktop) */}
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 rounded-lg px-2.5 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Election Commission of India website (opens in new tab)"
            >
              <span>ECI</span>
              <span className="text-[10px]">↗</span>
            </a>

            {/* Hamburger button (mobile) */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-gray-200 bg-white shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
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
                placeholder="Search guide, leaders, states…"
                minLength={2}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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
                      className={mobileNavLinkClass}
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
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <a
                href="https://eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Election Commission of India website (opens in new tab)"
              >
                <span>Election Commission of India</span>
                <span>↗</span>
              </a>
              <span className="text-[11px] text-gray-600">Official Portal</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
