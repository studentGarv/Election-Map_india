import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '../context/AppContext';

const VISITED_STEPS_KEY = 'election-guide-visited-steps';
const CURRENT_STEP_KEY = 'election-guide-current-step';

export function useGuideProgress() {
  const { state } = useAppData();
  const totalCount = state.electionSteps.length;

  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem(VISITED_STEPS_KEY);
      if (stored) {
        return new Set(JSON.parse(stored) as string[]);
      }
    } catch (e) {
      console.error('Failed to parse visited steps from session storage', e);
    }
    return new Set<string>();
  });

  const [currentStepId, setCurrentStepIdState] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(CURRENT_STEP_KEY);
    } catch (e) {
      return null;
    }
  });

  const markVisited = useCallback((id: string) => {
    setVisitedSteps((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        sessionStorage.setItem(VISITED_STEPS_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error('Failed to save visited steps to session storage', e);
      }
      return next;
    });
  }, []);

  const setCurrentStep = useCallback((id: string) => {
    setCurrentStepIdState(id);
    try {
      sessionStorage.setItem(CURRENT_STEP_KEY, id);
    } catch (e) {
      console.error('Failed to save current step to session storage', e);
    }
  }, []);

  return {
    visitedCount: visitedSteps.size,
    totalCount,
    markVisited,
    currentStepId,
    setCurrentStep,
    visitedSteps,
  };
}
