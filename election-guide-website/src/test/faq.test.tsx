import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AppProvider } from '../context/AppContext';
import { FAQAccordion } from '../components/FAQAccordion';
import { faqEntries } from '../data/faqEntries';

// Feature: election-guide-website, Property 17: FAQ Toggle Round-Trip

describe('FAQ Properties', () => {
  it('P17: FAQ Toggle Round-Trip test', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: faqEntries.length - 1 }),
        (index) => {
          const { unmount } = render(
            <AppProvider>
              <FAQAccordion />
            </AppProvider>
          );

          const targetFaq = faqEntries[index];
          const btn = screen.getByText(targetFaq.question).closest('button');
          expect(btn).not.toBeNull();
          
          if (!btn) return;

          // Initial state: collapsed
          expect(btn.getAttribute('aria-expanded')).toBe('false');
          expect(screen.queryByText(targetFaq.answer)).not.toBeInTheDocument();

          // Expand
          fireEvent.click(btn);
          expect(btn.getAttribute('aria-expanded')).toBe('true');
          expect(screen.getByText(targetFaq.answer)).toBeInTheDocument();

          // Collapse
          fireEvent.click(btn);
          expect(btn.getAttribute('aria-expanded')).toBe('false');
          expect(screen.queryByText(targetFaq.answer)).not.toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: Math.min(100, faqEntries.length * 2) } // Just running enough times
    );
  });
});
