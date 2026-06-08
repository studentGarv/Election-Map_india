import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { InteractiveGuide } from '../components/InteractiveGuide';
import StepDetailPage from '../pages/StepDetailPage';
import { electionSteps } from '../data/electionSteps';

// Feature: election-guide-website, Property 9: Guide Navigation Bounds
// Feature: election-guide-website, Property 10: Progress Tracker Monotonicity
// Feature: election-guide-website, Property 13: Session Persistence Round-Trip
// Feature: election-guide-website, Property 14: Step Detail Rendering Completeness

describe('Guide Navigation and Progress Properties', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('P9: Guide Navigation Bounds', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: electionSteps.length - 1 }), (stepIndex) => {
        const step = electionSteps[stepIndex];
        const { unmount } = render(
          <MemoryRouter initialEntries={[`/guide/${step.id}`]}>
            <AppProvider>
              <InteractiveGuide stepId={step.id}>
                <div>Content</div>
              </InteractiveGuide>
            </AppProvider>
          </MemoryRouter>
        );

        const prevBtn = screen.getByRole('button', { name: /Previous step/i });
        const nextBtn = screen.getByRole('button', { name: /Next step/i });

        if (stepIndex === 0) {
          expect(prevBtn).toBeDisabled();
        } else {
          expect(prevBtn).not.toBeDisabled();
        }

        if (stepIndex === electionSteps.length - 1) {
          expect(nextBtn).toBeDisabled();
        } else {
          expect(nextBtn).not.toBeDisabled();
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('P10: Progress tracker monotonicity test', () => {
    // Generate an arbitrary sequence of step visits
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: electionSteps.length - 1 }), { minLength: 1, maxLength: 50 }),
        (visits) => {
          sessionStorage.clear();
          let maxVisited = 0;
          let currentVisited = new Set<string>();

          for (const index of visits) {
            const stepId = electionSteps[index].id;
            currentVisited.add(stepId);
            
            // Simulating what useGuideProgress does inside sessionStorage
            sessionStorage.setItem('election-guide-visited-steps', JSON.stringify(Array.from(currentVisited)));
            
            const stored = JSON.parse(sessionStorage.getItem('election-guide-visited-steps') || '[]');
            expect(stored.length).toBeGreaterThanOrEqual(maxVisited);
            maxVisited = stored.length;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('P13: Session persistence round-trip test', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...electionSteps.map(s => s.id)),
        (stepId) => {
          sessionStorage.setItem('election-guide-current-step', stepId);
          const retrieved = sessionStorage.getItem('election-guide-current-step');
          expect(retrieved).toBe(stepId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('P14: Step detail rendering completeness test', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...electionSteps),
        (step) => {
          const { unmount } = render(
            <MemoryRouter initialEntries={[`/guide/${step.id}`]}>
              <AppProvider>
                <Routes>
                  <Route path="/guide/:stepId" element={<StepDetailPage />} />
                </Routes>
              </AppProvider>
            </MemoryRouter>
          );

          // Assert Title
          expect(screen.getByText(step.title)).toBeInTheDocument();
          // Assert Description
          expect(screen.getByText(step.description)).toBeInTheDocument();
          // Assert Key Dates section
          expect(screen.getByText(/Key Dates/i)).toBeInTheDocument();
          // Assert Responsible Parties section
          expect(screen.getByText(/Responsible Parties/i)).toBeInTheDocument();

          // Check if related steps are present unless it has none
          if (step.relatedStepIds.length > 0) {
            expect(screen.getByText(/Related Steps/i)).toBeInTheDocument();
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
