import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { InteractiveGuide } from '../components/InteractiveGuide';

const StepDetailPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const { state } = useAppData();

  const step = state.electionSteps.find((s) => s.id === stepId);

  if (!step) {
    return (
      <main className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-2xl">
          🔍
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Step Not Found</h1>
        <p className="text-gray-600 mb-6 text-sm">
          The election step you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-xs"
        >
          Return to Timeline
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <InteractiveGuide stepId={step.id}>
        <div className="bg-white shadow-xs rounded-2xl border border-gray-200/80 p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {step.electionType.replace('_', ' ')}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                Step #{step.order}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              {step.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 font-medium">
              <span>⏱️ Expected Duration:</span>
              <span className="font-semibold text-gray-700">{step.dateRange}</span>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none text-gray-700 mb-8 leading-relaxed">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              {step.description}
            </p>
          </div>

          {/* Key Dates & Responsible Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📅</span>
                <span>Key Dates & Windows</span>
              </h2>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                {step.keyDates.map((date, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{date}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🏛️</span>
                <span>Responsible Authorities</span>
              </h2>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                {step.responsibleParties.map((party, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{party}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Citizen Actions */}
          <div className="mb-8 bg-emerald-50/60 p-5 sm:p-6 rounded-xl border border-emerald-200/80">
            <h2 className="text-sm font-bold text-emerald-950 mb-3 flex items-center gap-2">
              <span className="text-base">✅</span>
              <span>Citizen Action Items</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
              {step.citizenActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links */}
          {step.externalLinks && step.externalLinks.length > 0 && (
            <div className="mb-8 pt-4 border-t border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🔗</span>
                <span>Official Resources & Guidelines</span>
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {step.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>{link.label}</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Steps */}
          {step.relatedStepIds && step.relatedStepIds.length > 0 && (
            <div className="border-t border-gray-100 pt-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Related Process Steps
              </h2>
              <div className="flex flex-wrap gap-2">
                {step.relatedStepIds.map((relatedId) => {
                  const relatedStep = state.electionSteps.find((s) => s.id === relatedId);
                  if (!relatedStep) return null;
                  return (
                    <Link
                      key={relatedId}
                      to={`/guide/${relatedId}`}
                      className="inline-flex items-center gap-1 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border border-gray-200 hover:border-orange-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <span>{relatedStep.title}</span>
                      <span className="text-gray-400">&rarr;</span>
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
