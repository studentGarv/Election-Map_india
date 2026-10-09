import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-lg mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-200 mb-4">
          <span className="text-2xl font-extrabold text-amber-600">404</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved.
          Please check the URL or navigate back to the home page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Go to Home Page
          </Link>
          <Link
            to="/map"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Explore Map
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
