/**
 * Map Utility Functions
 *
 * Helpers shared by the IndiaMap component and its tests.
 * Exported here so they can be unit-tested and property-tested independently
 * of the React rendering layer.
 */

import type { StatePartyTenure } from '../types';

// ─── GeoJSON feature type used by react-simple-maps ──────────────────────────

export interface GeoFeature {
  properties: Record<string, string>;
}

// ─── getStateName ─────────────────────────────────────────────────────────────

/**
 * Extracts the state/UT name from a GeoJSON feature's properties.
 *
 * Priority order matches the property keys found in common India TopoJSON
 * sources:
 *   1. NAME_1  — deldersveld/topojson India states
 *   2. name    — generic GeoJSON
 *   3. NAME    — alternative generic
 *   4. st_nm   — some India-specific sources
 *
 * Returns an empty string when none of the known keys are present.
 */
export function getStateName(geo: GeoFeature): string {
  return (
    geo.properties['NAME_1'] ||
    geo.properties['name'] ||
    geo.properties['NAME'] ||
    geo.properties['st_nm'] ||
    ''
  );
}

// ─── getCurrentParty ──────────────────────────────────────────────────────────

/**
 * Derives the current ruling party for a state from StatePartyTenure records.
 * Returns the party with the highest `lastYearInPower` (most recently in power).
 * Returns an empty string when no matching records are found.
 */
export function getCurrentParty(
  stateName: string,
  stateData: StatePartyTenure[]
): string {
  const tenures = stateData.filter(
    (t) => t.state.toLowerCase() === stateName.toLowerCase()
  );
  if (tenures.length === 0) return '';

  const sorted = [...tenures].sort((a, b) => b.lastYearInPower - a.lastYearInPower);
  return sorted[0].party;
}
