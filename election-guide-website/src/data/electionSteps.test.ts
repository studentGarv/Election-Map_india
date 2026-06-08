/**
 * Property-based tests for ElectionStep data.
 *
 * Feature: election-guide-website, Property 12: Step description word count
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { ElectionStep } from '../types';
import { electionSteps } from './electionSteps';

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Counts words in a string by splitting on whitespace. */
function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const electionTypeArb = fc.constantFrom(
  'lok_sabha' as const,
  'rajya_sabha' as const,
  'state_assembly' as const
);

/** Word token used in generated descriptions */
const wordArb = fc.stringMatching(/^[A-Za-z]{1,12}$/);

/** Builds a step with a description of exactly `wordCount` words — no filter needed */
function makeStepWithWordCount(
  id: string,
  title: string,
  electionType: ElectionStep['electionType'],
  order: number,
  dateRange: string,
  words: string[],
): ElectionStep {
  return {
    id,
    title,
    electionType,
    order,
    dateRange,
    description: words.join(' '),
    keyDates: [],
    responsibleParties: [],
    citizenActions: [],
    externalLinks: [],
    relatedStepIds: [],
  };
}

const baseFieldsArb = fc.tuple(
  fc.stringMatching(/^[A-Za-z0-9\-]{1,20}$/),   // id
  fc.stringMatching(/^[A-Za-z0-9 ]{1,50}$/),     // title
  electionTypeArb,
  fc.integer({ min: 1, max: 20 }),               // order
  fc.stringMatching(/^[A-Za-z0-9 \-]{1,60}$/),  // dateRange
);

/** Step whose description has 1–50 words (always valid, no filter) */
const validStepArb: fc.Arbitrary<ElectionStep> = fc
  .tuple(baseFieldsArb, fc.array(wordArb, { minLength: 1, maxLength: 50 }))
  .map(([[id, title, et, order, dr], words]) =>
    makeStepWithWordCount(id, title, et, order, dr, words)
  );

/** Step whose description has 51–80 words (always over-limit, no filter) */
const overLimitStepArb: fc.Arbitrary<ElectionStep> = fc
  .tuple(baseFieldsArb, fc.array(wordArb, { minLength: 51, maxLength: 80 }))
  .map(([[id, title, et, order, dr], words]) =>
    makeStepWithWordCount(id, title, et, order, dr, words)
  );

// ─── Property-Based Test ──────────────────────────────────────────────────────

// Feature: election-guide-website, Property 12: Step description word count
describe('P12: Step Description Word Count', () => {
  it('any ElectionStep with a valid description has ≤ 50 words', () => {
    // Validates: Requirements 1.3
    fc.assert(
      fc.property(validStepArb, (step) => {
        expect(countWords(step.description)).toBeLessThanOrEqual(50);
      }),
      { numRuns: 100 }
    );
  });

  it('countWords correctly identifies descriptions that exceed 50 words', () => {
    // Validates: Requirements 1.3
    fc.assert(
      fc.property(overLimitStepArb, (step) => {
        expect(countWords(step.description)).toBeGreaterThan(50);
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Static Data Verification ─────────────────────────────────────────────────

describe('Static electionSteps data — description word count', () => {
  it('every description in the bundled electionSteps is ≤ 50 words', () => {
    // Validates: Requirements 1.3
    expect(electionSteps.length).toBeGreaterThan(0);

    electionSteps.forEach((step) => {
      const words = countWords(step.description);
      expect(
        words,
        `Step "${step.id}" description has ${words} words (limit: 50): "${step.description}"`
      ).toBeLessThanOrEqual(50);
    });
  });

  it('reports the word count for each step (informational)', () => {
    // Validates: Requirements 1.3 — documents current word counts for review
    const counts = electionSteps.map((step) => ({
      id: step.id,
      words: countWords(step.description),
    }));

    counts.forEach(({ words }) => {
      expect(words).toBeLessThanOrEqual(50);
    });
  });
});

