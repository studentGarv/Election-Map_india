import React from 'react';
import { CSVImporter } from '../components/CSVImporter';

const AdminPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Administration</h1>
      <p className="text-gray-600 mb-8">
        Manage the application's underlying data. You can manually upload new CSV files
        to update the history and records shown across the website.
      </p>

      <CSVImporter />
    </main>
  );
};

export default AdminPage;
