import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <p className="text-6xl font-bold text-orange-500 mb-4" aria-hidden="true">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or may have been moved.
          Please check the URL or navigate back to the home page.
        </p>
        <Link
          to="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Go to Home Page
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
