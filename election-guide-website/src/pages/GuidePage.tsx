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
    <main className="container mx-auto px-4 py-8 text-center flex justify-center items-center h-[50vh]">
      <p className="text-gray-600">Loading guide...</p>
    </main>
  );
};

export default GuidePage;
