/**
 * Property-based tests for the party color utility.
 *
 * // Feature: election-guide-website, Property P11: Party Color Consistency
 *
 * Validates: Requirements P11 — For any set of state party tenure records,
 * every party that appears in the data SHALL be assigned a color in the
 * partyColorMap, and the same party SHALL always receive the same color
 * across all map renders within a session.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getPartyColor, buildPartyColorMap } from './partyColors';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Regex for a valid 6-digit hex color string */
const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;

/**
 * Arbitrary that generates party name strings.
 * Covers known party names, arbitrary ASCII strings, and edge-ish values like
 * single characters or names with spaces/punctuation — all valid inputs to
 * getPartyColor.
 */
const partyNameArb: fc.Arbitrary<string> = fc.oneof(
  // Random printable ASCII names (no control characters)
  fc.stringMatching(/^[A-Za-z0-9 ()'\-\.]{1,40}$/),
  // Known party names to exercise the KNOWN_PARTY_COLORS branch
  fc.constantFrom(
    'BJP', 'INC', 'BSP', 'AAP', 'TMC', 'SP', 'DMK', 'AIADMK',
    'JD(U)', 'RJD', 'TDP', 'BJD', 'BRS', 'TRS', 'NCP', 'CPI(M)',
    'Independent', "President's Rule", "Governor's Rule"
  ),
);

// ─── Unit Tests ───────────────────────────────────────────────────────────────

describe('getPartyColor', () => {
  it('returns a valid hex color for known parties', () => {
    expect(getPartyColor('BJP')).toMatch(HEX_COLOR_RE);
    expect(getPartyColor('INC')).toMatch(HEX_COLOR_RE);
    expect(getPartyColor('AAP')).toMatch(HEX_COLOR_RE);
  });

  it('returns a valid hex color for an unknown party', () => {
    expect(getPartyColor('SomeUnknownParty2025')).toMatch(HEX_COLOR_RE);
  });

  it('returns the default grey for empty string', () => {
    expect(getPartyColor('')).toBe('#BDBDBD');
  });

  it('returns the default grey for whitespace-only string', () => {
    expect(getPartyColor('   ')).toBe('#BDBDBD');
  });

  it('is case-insensitive for known parties', () => {
    expect(getPartyColor('bjp')).toBe(getPartyColor('BJP'));
    expect(getPartyColor('inc')).toBe(getPartyColor('INC'));
  });
});

describe('buildPartyColorMap', () => {
  it('maps each party to the same color as getPartyColor', () => {
    const parties = ['BJP', 'INC', 'AAP', 'UnknownParty'];
    const map = buildPartyColorMap(parties);
    for (const party of parties) {
      expect(map[party]).toBe(getPartyColor(party));
    }
  });

  it('returns an empty object for an empty array', () => {
    expect(buildPartyColorMap([])).toEqual({});
  });
});

// ─── Property-Based Tests ─────────────────────────────────────────────────────

// Feature: election-guide-website, Property P11: Party Color Consistency
describe('P11: Party Color Consistency', () => {
  it('getPartyColor always returns a valid hex color for any party name', () => {
    // Validates: Requirements P11
    fc.assert(
      fc.property(partyNameArb, (partyName) => {
        const color = getPartyColor(partyName);
        expect(color).toMatch(HEX_COLOR_RE);
      }),
      { numRuns: 25 }
    );
  });

  it('getPartyColor is deterministic — same party always gets the same color', () => {
    // Validates: Requirements P11
    fc.assert(
      fc.property(partyNameArb, (partyName) => {
        const firstCall = getPartyColor(partyName);
        const secondCall = getPartyColor(partyName);
        expect(firstCall).toBe(secondCall);
      }),
      { numRuns: 25 }
    );
  });

  it('buildPartyColorMap assigns the same color to each party as getPartyColor', () => {
    // Validates: Requirements P11
    fc.assert(
      fc.property(
        fc.array(partyNameArb, { minLength: 1, maxLength: 20 }),
        (parties) => {
          const map = buildPartyColorMap(parties);
          for (const party of parties) {
            expect(map[party]).toBe(getPartyColor(party));
            expect(map[party]).toMatch(HEX_COLOR_RE);
          }
        }
      ),
      { numRuns: 25 }
    );
  });

  it('two calls to buildPartyColorMap with the same parties produce identical maps', () => {
    // Validates: Requirements P11 — consistency across renders within a session
    fc.assert(
      fc.property(
        fc.array(partyNameArb, { minLength: 1, maxLength: 20 }),
        (parties) => {
          const map1 = buildPartyColorMap(parties);
          const map2 = buildPartyColorMap(parties);
          for (const party of parties) {
            expect(map1[party]).toBe(map2[party]);
          }
        }
      ),
      { numRuns: 25 }
    );
  });
});

