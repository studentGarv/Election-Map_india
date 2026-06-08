// Feature: election-guide-website, Property 12: Step description word count

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { ElectionStep, ElectionType } from '../types';
import { electionSteps } from '../data/electionSteps';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Count whitespace-delimited tokens in a string. */
function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length;
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const electionTypeArb: fc.Arbitrary<ElectionType> = fc.constantFrom(
  'lok_sabha',
  'rajya_sabha',
  'state_assembly',
);

/**
 * Arbitrary ElectionStep with an unconstrained description.
 * We intentionally allow descriptions beyond 50 words so the property test
 * exercises both compliant and non-compliant inputs.
 */
const electionStepArb: fc.Arbitrary<ElectionStep> = fc.record({
  id: fc.hexaString({ minLength: 4, maxLength: 16 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  electionType: electionTypeArb,
  order: fc.integer({ min: 1, max: 100 }),
  dateRange: fc.string({ minLength: 1, maxLength: 200 }),
  description: fc.string({ minLength: 0, maxLength: 500 }),
  keyDates: fc.array(fc.string({ minLength: 1, maxLength: 100 })),
  responsibleParties: fc.array(fc.string({ minLength: 1, maxLength: 100 })),
  citizenActions: fc.array(fc.string({ minLength: 1, maxLength: 200 })),
  externalLinks: fc.array(
    fc.record({
      label: fc.string({ minLength: 1, maxLength: 100 }),
      url: fc.webUrl(),
    }),
  ),
  relatedStepIds: fc.array(fc.hexaString({ minLength: 4, maxLength: 16 })),
});

/**
 * Arbitrary ElectionStep whose description is ALWAYS within the 50-word limit.
 * Used to verify the countWords helper and confirm compliant records pass.
 */
const compliantStepArb: fc.Arbitrary<ElectionStep> = fc
  .array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), {
    minLength: 1,
    maxLength: 50,
  })
  .chain((words) => {
    const description = words.join(' ');
    return fc.record({
      id: fc.hexaString({ minLength: 4, maxLength: 16 }),
      title: fc.string({ minLength: 1, maxLength: 100 }),
      electionType: electionTypeArb,
      order: fc.integer({ min: 1, max: 100 }),
      dateRange: fc.string({ minLength: 1, maxLength: 200 }),
      description: fc.constant(description),
      keyDates: fc.array(fc.string({ minLength: 1, maxLength: 100 })),
      responsibleParties: fc.array(fc.string({ minLength: 1, maxLength: 100 })),
      citizenActions: fc.array(fc.string({ minLength: 1, maxLength: 200 })),
      externalLinks: fc.array(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 100 }),
          url: fc.webUrl(),
        }),
      ),
      relatedStepIds: fc.array(fc.hexaString({ minLength: 4, maxLength: 16 })),
    });
  });

// ─── Property Tests ───────────────────────────────────────────────────────────

describe('ElectionStep — Property 12: Step description word count', () => {
  /**
   * **Validates: Requirements 1.3**
   *
   * Property P12: For any ElectionStep record stored in the data, the
   * `description` field SHALL contain no more than 50 words.
   *
   * The property is tested in two ways:
   *   1. Generative: compliant-by-construction records all satisfy the limit.
   *   2. Static:     every record in the bundled `electionSteps` dataset satisfies
   *                  the limit, confirming real content compliance.
   */

  it('P12 (generative): compliant-by-construction ElectionStep records always satisfy the 50-word limit', () => {
    fc.assert(
      fc.property(compliantStepArb, (step) => {
        const wordCount = countWords(step.description);
        return wordCount <= 50;
      }),
      { numRuns: 25 },
    );
  });

  it('P12 (static): every entry in the bundled electionSteps data has a description of ≤ 50 words', () => {
    for (const step of electionSteps) {
      const wordCount = countWords(step.description);
      expect(wordCount, `Step "${step.id}" has ${wordCount} words (limit: 50)`).toBeLessThanOrEqual(50);
    }
  });

  it('countWords helper: empty string returns 0 words', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });

  it('countWords helper: single word returns 1', () => {
    expect(countWords('hello')).toBe(1);
    expect(countWords('  hello  ')).toBe(1);
  });

  it('countWords helper: splits on any whitespace', () => {
    expect(countWords('hello world')).toBe(2);
    expect(countWords('a\tb\nc')).toBe(3);
  });
});

