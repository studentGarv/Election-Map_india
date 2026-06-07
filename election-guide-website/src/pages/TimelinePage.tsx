import React from 'react';
import { useParams } from 'react-router-dom';

const TimelinePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  const typeLabel: Record<string, string> = {
    lok_sabha: 'Lok Sabha',
    rajya_sabha: 'Rajya Sabha',
    state_assembly: 'State Assembly',
  };

  const label = type ? (typeLabel[type] ?? type) : 'Election';

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{label} Timeline</h1>
      <p className="text-gray-600">
        Chronological timeline of the {label} election process.
      </p>
      <p className="mt-4 text-sm text-orange-600 font-medium">Coming Soon — Full content will be available shortly.</p>
    </main>
  );
};

export default TimelinePage;
