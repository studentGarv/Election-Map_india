/**
 * Property-based tests for StateHistoryPanel sort utilities.
 *
 * Feature: election-guide-website, Property P5: Chronological Record Ordering
 *
 * Validates: Requirements 2.4, 4.1, 5.1
 */

// Feature: election-guide-website, Property P5: Chronological Record Ordering

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { sortCMChronological } from '../utils/dateUtils';
import type { CMRecord } from '../types';

// ─── Arbitraries ──────────────────────────────────────────────────────────────

/** Generates a safe non-empty string without special characters */
const safeString = fc.stringMatching(/^[A-Za-z0-9 _\-\.]{1,30}$/);

/**
 * Generates a CMRecord with a valid (non-null) startDate.
 * endDate may be null or a valid Date after startDate.
 */
const cmRecordWithDateArb: fc.Arbitrary<CMRecord> = fc.record({
  state: safeString,
  name: safeString,
  party: safeString,
  startDate: fc.date({ min: new Date('1900-01-01'), max: new Date('2030-12-31') }),
  endDate: fc.option(
    fc.date({ min: new Date('1900-01-01'), max: new Date('2030-12-31') }),
    { nil: null }
  ),
});

// ─── Property P5: Chronological Record Ordering ────────────────────────────────

describe('P5: Chronological Record Ordering', () => {
  it(
    'sortCMChronological produces records ordered by startDate ascending for all adjacent pairs',
    () => {
      // Validates: Requirements 2.4, 4.1, 5.1
      fc.assert(
        fc.property(
          fc.array(cmRecordWithDateArb, { minLength: 0, maxLength: 50 }),
          (records: CMRecord[]) => {
            const sorted = sortCMChronological(records);

            // Result must have the same length as input
            expect(sorted.length).toBe(records.length);

            // For every adjacent pair (a, b) in the sorted result,
            // a.startDate <= b.startDate must hold.
            for (let i = 0; i < sorted.length - 1; i++) {
              const a = sorted[i];
              const b = sorted[i + 1];

              // Records with null startDate are placed at the end;
              // they satisfy the ordering constraint vacuously.
              if (a.startDate === null || b.startDate === null) {
                // null can only appear at the tail — if b is null, that's fine.
                // If a is null but b is not null, that violates the contract.
                expect(a.startDate).toBeNull();
                // b may also be null (both at the end) — that is valid.
              } else {
                // Both are non-null Dates — enforce ascending order.
                expect(a.startDate.getTime()).toBeLessThanOrEqual(
                  b.startDate.getTime()
                );
              }
            }
          }
        ),
        { numRuns: 25 }
      );
    }
  );

  it('sortCMChronological does not mutate the original array', () => {
    // Validates: Requirements 2.4
    fc.assert(
      fc.property(
        fc.array(cmRecordWithDateArb, { minLength: 1, maxLength: 30 }),
        (records: CMRecord[]) => {
          const original = records.map((r) => ({ ...r }));
          sortCMChronological(records);
          // Original array references and values must be unchanged
          expect(records.length).toBe(original.length);
          for (let i = 0; i < records.length; i++) {
            expect(records[i].startDate?.getTime()).toBe(
              original[i].startDate?.getTime()
            );
            expect(records[i].name).toBe(original[i].name);
          }
        }
      ),
      { numRuns: 25 }
    );
  });

  it('sortCMChronological is stable — records with equal startDate preserve relative order', () => {
    // Validates: Requirements 2.4
    fc.assert(
      fc.property(
        fc.array(cmRecordWithDateArb, { minLength: 2, maxLength: 30 }),
        (records: CMRecord[]) => {
          // Force some records to share the same startDate by duplicating
          const sameDate = new Date('2000-06-15');
          const tweaked: CMRecord[] = records.map((r, idx) =>
            idx % 3 === 0 ? { ...r, startDate: sameDate } : r
          );

          const sorted = sortCMChronological(tweaked);

          // Extract records with the shared date and verify relative order is preserved
          const originalIndices: number[] = [];
          tweaked.forEach((r, i) => {
            if (r.startDate?.getTime() === sameDate.getTime()) {
              originalIndices.push(i);
            }
          });

          const sortedIndices: number[] = [];
          sorted.forEach((sortedRecord) => {
            const origIdx = tweaked.findIndex(
              (r, i) =>
                r === sortedRecord && !sortedIndices.includes(i)
            );
            if (origIdx !== -1 && tweaked[origIdx].startDate?.getTime() === sameDate.getTime()) {
              sortedIndices.push(origIdx);
            }
          });

          // The relative order of same-date records should match original
          expect(sortedIndices).toEqual(originalIndices);
        }
      ),
      { numRuns: 25 }
    );
  });
});

