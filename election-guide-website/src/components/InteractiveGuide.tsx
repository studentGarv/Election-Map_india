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

      <div className="mt-8 flex justify-between items-center border-t border-gray-200/80 pt-6">
        <button
          onClick={() => prevStep && navigate(`/guide/${prevStep.id}`)}
          disabled={!prevStep}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            prevStep
              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-2xs'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent'
          }`}
          aria-label="Previous step"
        >
          <span>&larr;</span>
          <span>Previous Step</span>
        </button>

        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          Step {currentIndex + 1} of {steps.length}
        </span>

        <button
          onClick={() => nextStep && navigate(`/guide/${nextStep.id}`)}
          disabled={!nextStep}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs ${
            nextStep
              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20 hover:shadow-md'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
          aria-label="Next step"
        >
          <span>{nextStep ? 'Next Step' : 'Complete Guide'}</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
