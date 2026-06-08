import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { InteractiveGuide } from '../components/InteractiveGuide';
import NotFoundPage from './NotFoundPage';

const StepDetailPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const { state } = useAppData();

  const step = state.electionSteps.find((s) => s.id === stepId);

  if (!step) {
    return (
      <main className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Step Not Found</h1>
        <p className="text-gray-600 mb-6">
          The election step you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Return to Timeline
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <InteractiveGuide stepId={step.id}>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 sm:p-8">
          <div className="mb-6 border-b border-gray-100 pb-4">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              {step.electionType.replace('_', ' ')}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{step.title}</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">Timeline: {step.dateRange}</p>
          </div>

          <div className="prose max-w-none text-gray-700 mb-8">
            <p className="text-lg leading-relaxed">{step.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📅</span> Key Dates
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {step.keyDates.map((date, idx) => (
                  <li key={idx}>{date}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🏛️</span> Responsible Parties
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {step.responsibleParties.map((party, idx) => (
                  <li key={idx}>{party}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
              <span className="mr-2">✅</span> Citizen Actions
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-indigo-800">
              {step.citizenActions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ul>
          </div>

          {step.externalLinks && step.externalLinks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🔗</span> External Links
              </h2>
              <div className="flex flex-col space-y-2">
                {step.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors"
                  >
                    {link.label}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {step.relatedStepIds && step.relatedStepIds.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Related Steps</h2>
              <div className="flex flex-wrap gap-2">
                {step.relatedStepIds.map((relatedId) => {
                  const relatedStep = state.electionSteps.find((s) => s.id === relatedId);
                  if (!relatedStep) return null;
                  return (
                    <Link
                      key={relatedId}
                      to={`/guide/${relatedId}`}
                      className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {relatedStep.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </InteractiveGuide>
    </main>
  );
};

export default StepDetailPage;
