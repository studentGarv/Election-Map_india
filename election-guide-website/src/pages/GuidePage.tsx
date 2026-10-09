import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import { useGuideProgress } from '../hooks/useGuideProgress';

const GuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppData();
  const { currentStepId } = useGuideProgress();

  useEffect(() => {
    if (state.electionSteps && state.electionSteps.length > 0) {
      if (currentStepId) {
        navigate(`/guide/${currentStepId}`, { replace: true });
      } else {
        navigate(`/guide/${state.electionSteps[0].id}`, { replace: true });
      }
    }
  }, [currentStepId, navigate, state.electionSteps]);

  return (
    <main className="container mx-auto px-4 py-16 text-center flex flex-col justify-center items-center min-h-[50vh]">
      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-slate-500 text-sm font-medium">Navigating to Election Guide...</p>
    </main>
  );
};

export default GuidePage;
