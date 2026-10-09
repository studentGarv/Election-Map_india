import React from 'react';
import { useAppData } from '../context/AppContext';
import { isStale, formatDate } from '../utils/dateUtils';

const Footer: React.FC = () => {
  const { state } = useAppData();
  const { lastUpdated } = state;

  const stale = isStale(lastUpdated);
  const formattedDate = formatDate(lastUpdated);

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto relative">
      {/* Tricolor accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600" aria-hidden="true" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Metadata & Staleness */}
          <div className="flex flex-col gap-2 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm tracking-tight">
                India Election Guide
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Citizen Education Portal</span>
            </div>

            {lastUpdated ? (
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="font-semibold text-slate-700">Last Updated:</span>{' '}
                <time dateTime={lastUpdated.toISOString()} className="font-medium text-slate-600">{formattedDate}</time>
              </p>
            ) : (
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300" aria-hidden="true" />
                Last updated date unavailable
              </p>
            )}

            {/* Staleness warning */}
            {stale && (
              <p
                className="mt-1 text-xs text-amber-800 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2 flex items-center gap-2"
                role="alert"
                aria-live="polite"
              >
                <span aria-hidden="true">⚠️</span>
                <span>
                  Content may be outdated — verify with{' '}
                  <a
                    href="https://eci.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-amber-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
                    aria-label="Election Commission of India website (opens in new tab)"
                  >
                    eci.gov.in
                  </a>
                </span>
              </p>
            )}
          </div>

          {/* Official Reference & Copyright */}
          <div className="flex flex-col items-start md:items-end gap-1.5 text-xs">
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 px-3.5 py-1.5 rounded-lg border border-amber-200/70 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Election Commission of India official website (opens in new tab)"
            >
              <span>Election Commission of India</span>
              <span aria-hidden="true" className="text-amber-600 font-bold">↗</span>
            </a>
            <p className="text-slate-400 mt-1">
              © {new Date().getFullYear()} India Election Guide. For civic informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
