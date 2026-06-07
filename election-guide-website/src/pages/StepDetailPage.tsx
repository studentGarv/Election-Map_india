import React from 'react';
import { useParams, Link } from 'react-router-dom';

const StepDetailPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-4">
        <Link to="/guide" className="text-blue-600 hover:underline text-sm">
          ← Back to Guide
        </Link>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Election Step: {stepId}
      </h1>
      <p className="text-gray-600">
        Detailed information about this election step will be displayed here.
      </p>
      <p className="mt-4 text-sm text-orange-600 font-medium">Coming Soon — Full content will be available shortly.</p>
    </main>
  );
};

export default StepDetailPage;
