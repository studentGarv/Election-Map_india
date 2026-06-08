import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// Feature: election-guide-website, Property 6: Party Term Count Consistency

describe('History Properties', () => {
  it('P6: Party term count consistency test', () => {
    // Generate arbitrary PMRecords
    const pmRecordArbitrary = fc.record({
      name: fc.string(),
      party: fc.string(),
      lokSabha: fc.string(),
      electionYear: fc.string(),
      startDate: fc.date().map(d => new Date(d)),
      endDate: fc.date().map(d => new Date(d)),
      seatsWon: fc.integer({ min: 1, max: 543 })
    });

    fc.assert(
      fc.property(
        fc.array(pmRecordArbitrary, { minLength: 1, maxLength: 200 }),
        (pmRecords) => {
          const counts: Record<string, number> = {};
          pmRecords.forEach((record) => {
            counts[record.party] = (counts[record.party] || 0) + 1;
          });

          const totalTerms = Object.values(counts).reduce((sum, count) => sum + count, 0);
          expect(totalTerms).toBe(pmRecords.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
