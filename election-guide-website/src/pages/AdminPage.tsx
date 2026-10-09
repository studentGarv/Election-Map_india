import React from 'react';
import { CSVImporter } from '../components/CSVImporter';
import NotFoundPage from './NotFoundPage';

const AdminPage: React.FC = () => {
  // Guard: Admin is only accessible during local development (`npm run dev`)
  if (!import.meta.env.DEV) {
    return <NotFoundPage />;
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-semibold rounded-full mb-3">
          <span>🛠️ Local Development Only (npm run dev)</span>
          <span>•</span>
          <span>Data Ingestion</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Administration & Data Updates
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Manage the election portal's underlying datasets. Upload verified CSV records to update historical leadership, state party tenures, or general election results in real-time.
        </p>
      </div>

      <CSVImporter />
    </main>
  );
};

export default AdminPage;
