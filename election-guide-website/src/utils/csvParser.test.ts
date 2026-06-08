/**
 * Property-based tests for the CSV importer and data pipeline.
 *
 * Feature: election-guide-website
 * Properties P1–P4 as defined in design.md
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateColumns,
  parseCMCsv,
  parseLokSabhaCsv,
  parseStatePartyTenureCsv,
  serializeToCSV,
  deduplicateCMRecords,
  derivePMRecords,
} from './csvParser';
import type { CMRecord, LokSabhaRecord } from '../types';

// ─── Helpers / Arbitraries ────────────────────────────────────────────────────

/** Generates a safe string that won't break CSV parsing (no commas, quotes, newlines) */
const safeString = fc.stringMatching(/^[A-Za-z0-9 _\-\.]{1,30}$/);

/** Generates a valid ISO date string — reserved for future tests */
// const _isoDateString = fc.date(...)

/** Generates a CMRecord with valid dates */
const cmRecordArb: fc.Arbitrary<CMRecord> = fc.record({
  state: safeString,
  name: safeString,
  party: safeString,
  startDate: fc.date({ min: new Date('1900-01-01'), max: new Date('2030-12-31') }),
  endDate: fc.option(fc.date({ min: new Date('1900-01-01'), max: new Date('2030-12-31') }), {
    nil: null,
  }),
});

/** Generates a LokSabhaRecord — reserved for future tests */
// const _lokSabhaRecordArb = fc.record({ ... })

/**
 * Serializes a CMRecord array to a CSV string using the CM column schema.
 * Dates are written as ISO strings; null end_date is written as 'NaT'.
 */
function cmRecordsToCSV(records: CMRecord[]): string {
  const columns = ['state', 'name', 'party', 'start_date', 'end_date'];
  const header = columns.join(',');
  const rows = records.map((r) => {
    const startDate = r.startDate ? r.startDate.toISOString() : '';
    const endDate = r.endDate ? r.endDate.toISOString() : 'NaT';
    return [r.state, r.name, r.party, startDate, endDate].join(',');
  });
  return [header, ...rows].join('\n') + '\n';
}

// ─── Unit Tests ───────────────────────────────────────────────────────────────

describe('validateColumns', () => {
  it('returns empty array when all required columns are present', () => {
    expect(validateColumns(['state', 'name', 'party'], ['state', 'name'])).toEqual([]);
  });

  it('returns missing columns', () => {
    expect(validateColumns(['state'], ['state', 'name', 'party'])).toEqual(['name', 'party']);
  });

  it('returns all required columns when headers is empty', () => {
    expect(validateColumns([], ['state', 'name'])).toEqual(['state', 'name']);
  });
});

describe('parseCMCsv', () => {
  it('parses a valid CM CSV', () => {
    const csv = `state,name,party,start_date,end_date
Maharashtra,John Doe,INC,2000-01-01T00:00:00,2005-01-01T00:00:00
`;
    const { records, errors } = parseCMCsv(csv);
    expect(errors).toHaveLength(0);
    expect(records).toHaveLength(1);
    expect(records[0].state).toBe('Maharashtra');
    expect(records[0].startDate).toBeInstanceOf(Date);
  });

  it('rejects CSV with missing required columns', () => {
    const csv = `state,name,party\nMaharashtra,John,INC\n`;
    const { records, errors } = parseCMCsv(csv);
    expect(records).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('start_date');
  });

  it('skips rows with missing start_date and logs error', () => {
    const csv = `state,name,party,start_date,end_date
Maharashtra,John,INC,,2005-01-01T00:00:00
Maharashtra,Jane,INC,2001-01-01T00:00:00,NaT
`;
    const { records, errors } = parseCMCsv(csv);
    expect(records).toHaveLength(1);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('start_date');
  });

  it('deduplicates rows with same (state, name, start_date)', () => {
    const csv = `state,name,party,start_date,end_date
Maharashtra,John,INC,2000-01-01T00:00:00,NaT
Maharashtra,John,INC,2000-01-01T00:00:00,NaT
`;
    const { records } = parseCMCsv(csv);
    expect(records).toHaveLength(1);
  });

  it('treats NaT end_date as null', () => {
    const csv = `state,name,party,start_date,end_date
Maharashtra,John,INC,2000-01-01T00:00:00,NaT
`;
    const { records } = parseCMCsv(csv);
    expect(records[0].endDate).toBeNull();
  });
});

describe('parseLokSabhaCsv', () => {
  it('parses a valid Lok Sabha CSV', () => {
    const csv = `election_year,lok_sabha,party_in_government,seats_won_by_the_ruling_party,prime_minister
1951-52,First,INC,364.0,Jawaharlal Nehru
`;
    const { records, errors } = parseLokSabhaCsv(csv);
    expect(errors).toHaveLength(0);
    expect(records).toHaveLength(1);
    expect(records[0].seatsWon).toBe(364);
    expect(records[0].primeMinister).toBe('Jawaharlal Nehru');
  });

  it('handles missing party_in_government', () => {
    const csv = `election_year,lok_sabha,party_in_government,seats_won_by_the_ruling_party,prime_minister
1951-52,First,,364.0,Jawaharlal Nehru
`;
    const { records } = parseLokSabhaCsv(csv);
    expect(records[0].partyInGovernment).toBe('');
  });

  it('handles missing seats as null', () => {
    const csv = `election_year,lok_sabha,party_in_government,seats_won_by_the_ruling_party,prime_minister
1951-52,First,INC,,Jawaharlal Nehru
`;
    const { records } = parseLokSabhaCsv(csv);
    expect(records[0].seatsWon).toBeNull();
  });

  it('rejects CSV with missing required columns', () => {
    const csv = `election_year,lok_sabha\n1951-52,First\n`;
    const { records, errors } = parseLokSabhaCsv(csv);
    expect(records).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('parseStatePartyTenureCsv', () => {
  it('parses a valid state party tenure CSV', () => {
    const csv = `state,party,total_days,first_start,last_end,total_years,first_year_in_power,last_year_in_power
Maharashtra,INC,3650,2000-01-01,2010-01-01,10.0,2000,2010
`;
    const { records, errors } = parseStatePartyTenureCsv(csv);
    expect(errors).toHaveLength(0);
    expect(records).toHaveLength(1);
    expect(records[0].totalDays).toBe(3650);
    expect(records[0].firstStart).toBeInstanceOf(Date);
  });

  it('rejects CSV with missing required columns', () => {
    const csv = `state,party\nMaharashtra,INC\n`;
    const { records, errors } = parseStatePartyTenureCsv(csv);
    expect(records).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('serializeToCSV', () => {
  it('serializes records to CSV with correct headers', () => {
    const records = [{ state: 'Maharashtra', name: 'John' }];
    const csv = serializeToCSV(records as Record<string, unknown>[], ['state', 'name']);
    expect(csv).toContain('state,name');
    expect(csv).toContain('Maharashtra,John');
  });

  it('returns header-only CSV for empty records', () => {
    const csv = serializeToCSV([], ['state', 'name']);
    expect(csv.trim()).toBe('state,name');
  });
});

describe('deduplicateCMRecords', () => {
  it('removes duplicate records with same (state, name, startDate)', () => {
    const date = new Date('2000-01-01');
    const records: CMRecord[] = [
      { state: 'A', name: 'X', party: 'P1', startDate: date, endDate: null },
      { state: 'A', name: 'X', party: 'P2', startDate: date, endDate: null },
    ];
    const result = deduplicateCMRecords(records);
    expect(result).toHaveLength(1);
    expect(result[0].party).toBe('P1'); // first occurrence retained
  });

  it('keeps records with different keys', () => {
    const records: CMRecord[] = [
      { state: 'A', name: 'X', party: 'P1', startDate: new Date('2000-01-01'), endDate: null },
      { state: 'B', name: 'X', party: 'P1', startDate: new Date('2000-01-01'), endDate: null },
    ];
    expect(deduplicateCMRecords(records)).toHaveLength(2);
  });
});

describe('derivePMRecords', () => {
  it('derives PM records from Lok Sabha records', () => {
    const lokSabha: LokSabhaRecord[] = [
      {
        electionYear: '1951-52',
        lokSabha: 'First',
        partyInGovernment: 'INC',
        seatsWon: 364,
        primeMinister: 'Jawaharlal Nehru',
      },
    ];
    const pmRecords = derivePMRecords(lokSabha);
    expect(pmRecords).toHaveLength(1);
    expect(pmRecords[0].name).toBe('Jawaharlal Nehru');
    expect(pmRecords[0].party).toBe('INC');
    expect(pmRecords[0].seatsWon).toBe(364);
    expect(pmRecords[0].startDate).toBeNull();
    expect(pmRecords[0].endDate).toBeNull();
  });
});

// ─── Property-Based Tests ─────────────────────────────────────────────────────

// Feature: election-guide-website, Property 1: CSV round-trip fidelity
describe('P1: CSV Round-Trip Fidelity', () => {
  it('serializing CM records to CSV and parsing back produces equivalent records', () => {
    // Validates: Requirements 3.8
    fc.assert(
      fc.property(fc.array(cmRecordArb, { minLength: 1, maxLength: 20 }), (originalRecords) => {
        // Deduplicate first so we have a canonical set
        const deduped = deduplicateCMRecords(originalRecords);

        // Serialize to CSV
        const csvString = cmRecordsToCSV(deduped);

        // Parse back
        const { records: parsedRecords, errors } = parseCMCsv(csvString);

        // No parse errors expected for valid records
        expect(errors).toHaveLength(0);

        // Same count
        expect(parsedRecords.length).toBe(deduped.length);

        // Equivalent field values
        for (let i = 0; i < deduped.length; i++) {
          expect(parsedRecords[i].state).toBe(deduped[i].state);
          expect(parsedRecords[i].name).toBe(deduped[i].name);
          expect(parsedRecords[i].party).toBe(deduped[i].party);
          // Compare dates by time value
          expect(parsedRecords[i].startDate?.getTime()).toBe(deduped[i].startDate?.getTime());
        }
      }),
      { numRuns: 25 }
    );
  });
});

// Feature: election-guide-website, Property 2: Deduplication idempotence
describe('P2: Deduplication Idempotence', () => {
  it('deduplicating once and twice produces the same result', () => {
    // Validates: Requirements 3.7
    fc.assert(
      fc.property(
        fc.array(cmRecordArb, { minLength: 0, maxLength: 30 }),
        (records) => {
          const once = deduplicateCMRecords(records);
          const twice = deduplicateCMRecords(once);

          expect(twice.length).toBe(once.length);

          for (let i = 0; i < once.length; i++) {
            expect(twice[i].state).toBe(once[i].state);
            expect(twice[i].name).toBe(once[i].name);
            expect(twice[i].startDate?.getTime()).toBe(once[i].startDate?.getTime());
          }
        }
      ),
      { numRuns: 25 }
    );
  });
});

// Feature: election-guide-website, Property 3: Invalid rows skipped, valid rows retained
describe('P3: Invalid Rows Skipped, Valid Rows Retained', () => {
  it('rows with missing/malformed start_date are skipped and errors are logged', () => {
    // Validates: Requirements 3.5
    fc.assert(
      fc.property(
        fc.array(cmRecordArb, { minLength: 1, maxLength: 15 }),
        fc.array(
          fc.record({
            state: safeString,
            name: safeString,
            party: safeString,
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (validRecords, invalidRows) => {
          // Build CSV with valid rows + invalid rows (missing start_date)
          const validLines = validRecords.map((r) => {
            const startDate = r.startDate ? r.startDate.toISOString() : '';
            const endDate = r.endDate ? r.endDate.toISOString() : 'NaT';
            return `${r.state},${r.name},${r.party},${startDate},${endDate}`;
          });

          const invalidLines = invalidRows.map(
            (r) => `${r.state},${r.name},${r.party},,NaT` // empty start_date
          );

          // Shuffle valid and invalid lines together
          const allLines = [...validLines, ...invalidLines];
          const csvString = `state,name,party,start_date,end_date\n${allLines.join('\n')}\n`;

          const { records: parsedRecords, errors } = parseCMCsv(csvString);

          // Errors logged for each invalid row
          expect(errors.length).toBeGreaterThanOrEqual(invalidRows.length);

          // All errors reference start_date
          errors.forEach((err) => {
            expect(err.field).toBe('start_date');
          });

          // Parsed count ≤ valid records count (deduplication may reduce further)
          expect(parsedRecords.length).toBeLessThanOrEqual(validRecords.length);

          // No parsed record has a null startDate (invalid rows were skipped)
          parsedRecords.forEach((r) => {
            expect(r.startDate).not.toBeNull();
          });
        }
      ),
      { numRuns: 25 }
    );
  });
});

// Feature: election-guide-website, Property 4: Missing required columns causes rejection
describe('P4: Missing Required Columns Causes Rejection', () => {
  const CM_COLUMNS = ['state', 'name', 'party', 'start_date', 'end_date'];

  it('CM CSV with at least one missing required column returns errors and zero records', () => {
    // Validates: Requirements 3.1, 3.2, 3.3, 3.6
    fc.assert(
      fc.property(
        // Pick a non-empty subset of required columns to remove
        fc.array(fc.constantFrom(...CM_COLUMNS), { minLength: 1, maxLength: CM_COLUMNS.length }).map(
          (toRemove) => [...new Set(toRemove)]
        ),
        fc.array(
          fc.record({ state: safeString, name: safeString }),
          { minLength: 0, maxLength: 5 }
        ),
        (missingCols, _rows) => {
          const presentCols = CM_COLUMNS.filter((c) => !missingCols.includes(c));
          const header = presentCols.join(',');
          const csvString = `${header}\nvalue1,value2\n`;

          const { records, errors } = parseCMCsv(csvString);

          expect(records).toHaveLength(0);
          expect(errors.length).toBeGreaterThan(0);

          // Error message should mention at least one missing column
          const errorText = errors.map((e) => e.message).join(' ');
          missingCols.forEach((col) => {
            expect(errorText).toContain(col);
          });
        }
      ),
      { numRuns: 25 }
    );
  });

  it('Lok Sabha CSV with missing required columns returns errors and zero records', () => {
    const LOK_SABHA_COLUMNS = [
      'election_year',
      'lok_sabha',
      'seats_won_by_the_ruling_party',
      'prime_minister',
    ];

    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...LOK_SABHA_COLUMNS), { minLength: 1, maxLength: LOK_SABHA_COLUMNS.length }).map(
          (toRemove) => [...new Set(toRemove)]
        ),
        (missingCols) => {
          const presentCols = LOK_SABHA_COLUMNS.filter((c) => !missingCols.includes(c));
          const header = presentCols.join(',');
          const csvString = `${header}\nvalue1\n`;

          const { records, errors } = parseLokSabhaCsv(csvString);

          expect(records).toHaveLength(0);
          expect(errors.length).toBeGreaterThan(0);

          const errorText = errors.map((e) => e.message).join(' ');
          missingCols.forEach((col) => {
            expect(errorText).toContain(col);
          });
        }
      ),
      { numRuns: 25 }
    );
  });

  it('State party tenure CSV with missing required columns returns errors and zero records', () => {
    const SPT_COLUMNS = [
      'state',
      'party',
      'total_days',
      'first_start',
      'last_end',
      'total_years',
      'first_year_in_power',
      'last_year_in_power',
    ];

    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...SPT_COLUMNS), { minLength: 1, maxLength: SPT_COLUMNS.length }).map(
          (toRemove) => [...new Set(toRemove)]
        ),
        (missingCols) => {
          const presentCols = SPT_COLUMNS.filter((c) => !missingCols.includes(c));
          const header = presentCols.join(',');
          const csvString = `${header}\nvalue1\n`;

          const { records, errors } = parseStatePartyTenureCsv(csvString);

          expect(records).toHaveLength(0);
          expect(errors.length).toBeGreaterThan(0);

          const errorText = errors.map((e) => e.message).join(' ');
          missingCols.forEach((col) => {
            expect(errorText).toContain(col);
          });
        }
      ),
      { numRuns: 25 }
    );
  });
});

