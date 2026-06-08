import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { isStale } from '../utils/dateUtils';

// Feature: election-guide-website, Property 15: Staleness Check Correctness

describe('Freshness Properties', () => {
  it('P15: Staleness check correctness', () => {
    const now = new Date();
    
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }), // days difference
        (daysDiff) => {
          const testDate = new Date(now.getTime() - daysDiff * 24 * 60 * 60 * 1000);
          const result = isStale(testDate);
          
          if (daysDiff > 180) {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
