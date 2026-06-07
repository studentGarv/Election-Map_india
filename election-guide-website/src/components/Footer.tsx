import React from 'react';
import { useAppData } from '../context/AppContext';
import { isStale, formatDate } from '../utils/dateUtils';

const Footer: React.FC = () => {
  const { state } = useAppData();
  const { lastUpdated } = state;

  const stale = isStale(lastUpdated);
  const formattedDate = formatDate(lastUpdated);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Last Updated notice */}
          <div className="text-sm text-gray-600">
            {lastUpdated ? (
              <p>
                <span className="font-medium">Last Updated:</span>{' '}
                <time dateTime={lastUpdated.toISOString()}>{formattedDate}</time>
              </p>
            ) : (
              <p className="text-gray-400">Last updated date unavailable</p>
            )}

            {/* Staleness warning */}
            {stale && (
              <p
                className="mt-1 text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded px-3 py-1.5"
                role="alert"
                aria-live="polite"
              >
                ⚠️ Content may be outdated — verify with{' '}
                <a
                  href="https://eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
                  aria-label="Election Commission of India website (opens in new tab)"
                >
                  eci.gov.in
                </a>
              </p>
            )}
          </div>

          {/* ECI link */}
          <div className="text-sm">
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Election Commission of India official website (opens in new tab)"
            >
              Election Commission of India ↗
            </a>
            <p className="text-gray-400 mt-1">
              © {new Date().getFullYear()} India Election Guide. For informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
