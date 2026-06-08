import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { useGuideProgress } from '../hooks/useGuideProgress';
import { ProgressTracker } from './ProgressTracker';

interface InteractiveGuideProps {
  stepId: string;
  children: React.ReactNode;
}

export function InteractiveGuide({ stepId, children }: InteractiveGuideProps) {
  const navigate = useNavigate();
  const { state } = useAppData();
  const { markVisited, setCurrentStep } = useGuideProgress();

  const steps = state.electionSteps;
  const currentIndex = steps.findIndex((s) => s.id === stepId);

  useEffect(() => {
    if (stepId) {
      markVisited(stepId);
      setCurrentStep(stepId);
    }
  }, [stepId, markVisited, setCurrentStep]);

  if (currentIndex === -1) {
    // handled by parent or NotFoundPage
    return <>{children}</>;
  }

  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  return (
    <div className="flex flex-col h-full min-h-[50vh]">
      <div className="mb-6">
        <ProgressTracker />
      </div>

      <div className="flex-grow">
        {children}
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-gray-200 pt-6">
        <button
          onClick={() => prevStep && navigate(`/guide/${prevStep.id}`)}
          disabled={!prevStep}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            prevStep
              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent'
          }`}
          aria-label="Previous step"
        >
          &larr; Previous
        </button>

        <button
          onClick={() => nextStep && navigate(`/guide/${nextStep.id}`)}
          disabled={!nextStep}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            nextStep
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Next step"
        >
          {nextStep ? 'Next \u2192' : 'Finish'}
        </button>
      </div>
    </div>
  );
}
