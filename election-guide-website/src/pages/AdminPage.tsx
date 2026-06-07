import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin — Data Upload</h1>
      <p className="text-gray-600">
        Upload CSV files to populate the election data store. Supported files:
        Chief Minister history, Lok Sabha ruling party history, and state party tenure summaries.
      </p>
      <p className="mt-4 text-sm text-orange-600 font-medium">Coming Soon — CSV upload UI will be available shortly.</p>
    </main>
  );
};

export default AdminPage;
