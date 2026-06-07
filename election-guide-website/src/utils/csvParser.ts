/**
 * CSV Importer and Data Pipeline
 *
 * Utilities for parsing, validating, deduplicating, and serializing
 * the three CSV data files used by the Election Guide Website.
 */

import Papa from 'papaparse';
import type { CMRecord, LokSabhaRecord, StatePartyTenure, PMRecord, DataLoadError } from '../types';

// ─── Column Validation ────────────────────────────────────────────────────────

/**
 * Returns the list of column names that are present in `required` but absent
 * from `headers`.
 */
export function validateColumns(headers: string[], required: string[]): string[] {
  return required.filter((col) => !headers.includes(col));
}

// ─── Date Parsing ─────────────────────────────────────────────────────────────

/**
 * Parses a date string in ISO format or 'NaT' (not-a-time) to a Date or null.
 * Returns null for 'NaT', empty strings, or unparseable values.
 */
function parseDate(value: string | undefined | null): Date | null {
  if (!value || value.trim() === '' || value.trim().toLowerCase() === 'nat') {
    return null;
  }
  const d = new Date(value.trim());
  if (isNaN(d.getTime())) {
    return null;
  }
  return d;
}

/**
 * Returns true if the value is a valid ISO date string (not NaT, not empty).
 */
function isValidDateString(value: string | undefined | null): boolean {
  if (!value || value.trim() === '' || value.trim().toLowerCase() === 'nat') {
    return false;
  }
  const d = new Date(value.trim());
  return !isNaN(d.getTime());
}

// ─── CM CSV Parser ────────────────────────────────────────────────────────────

const CM_REQUIRED_COLUMNS = ['state', 'name', 'party', 'start_date', 'end_date'];

/**
 * Parses a CM CSV string (cm_raw_all_states.csv format).
 *
 * - Validates required columns; rejects file if any are missing.
 * - Parses dates (ISO or 'NaT' → null).
 * - Skips rows with missing or malformed start_date; logs a DataLoadError.
 * - Deduplicates on (state, name, start_date).
 */
export function parseCMCsv(csvString: string): { records: CMRecord[]; errors: DataLoadError[] } {
  const errors: DataLoadError[] = [];

  const result = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields ?? [];
  const missingColumns = validateColumns(headers, CM_REQUIRED_COLUMNS);

  if (missingColumns.length > 0) {
    errors.push({
      file: 'cm_raw_all_states.csv',
      rowNumber: null,
      field: null,
      message: `Missing required columns: ${missingColumns.join(', ')}`,
    });
    return { records: [], errors };
  }

  const rawRecords: CMRecord[] = [];

  result.data.forEach((row, index) => {
    const rowNumber = index + 2; // 1-based, accounting for header row

    // start_date is required and must be a valid date
    if (!isValidDateString(row['start_date'])) {
      errors.push({
        file: 'cm_raw_all_states.csv',
        rowNumber,
        field: 'start_date',
        message: `Row ${rowNumber}: missing or malformed start_date "${row['start_date'] ?? ''}"`,
      });
      return; // skip row
    }

    rawRecords.push({
      state: row['state'] ?? '',
      name: row['name'] ?? '',
      party: row['party'] ?? '',
      startDate: parseDate(row['start_date']),
      endDate: parseDate(row['end_date']),
    });
  });

  const records = deduplicateCMRecords(rawRecords);
  return { records, errors };
}

// ─── Lok Sabha CSV Parser ─────────────────────────────────────────────────────

const LOK_SABHA_REQUIRED_COLUMNS = [
  'election_year',
  'lok_sabha',
  'seats_won_by_the_ruling_party',
  'prime_minister',
];

/**
 * Parses a Lok Sabha CSV string (lok_sabha_ruling_party.csv format).
 *
 * - Validates required columns (party_in_government is optional).
 * - Parses numeric seats (may be missing/empty → null).
 * - Handles missing party_in_government gracefully.
 */
export function parseLokSabhaCsv(csvString: string): { records: LokSabhaRecord[]; errors: DataLoadError[] } {
  const errors: DataLoadError[] = [];

  const result = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields ?? [];
  const missingColumns = validateColumns(headers, LOK_SABHA_REQUIRED_COLUMNS);

  if (missingColumns.length > 0) {
    errors.push({
      file: 'lok_sabha_ruling_party.csv',
      rowNumber: null,
      field: null,
      message: `Missing required columns: ${missingColumns.join(', ')}`,
    });
    return { records: [], errors };
  }

  const records: LokSabhaRecord[] = [];

  result.data.forEach((row) => {
    const seatsRaw = row['seats_won_by_the_ruling_party'];
    let seatsWon: number | null = null;
    if (seatsRaw !== undefined && seatsRaw.trim() !== '') {
      const parsed = parseFloat(seatsRaw);
      seatsWon = isNaN(parsed) ? null : Math.round(parsed);
    }

    records.push({
      electionYear: row['election_year'] ?? '',
      lokSabha: row['lok_sabha'] ?? '',
      partyInGovernment: row['party_in_government'] ?? '',
      seatsWon,
      primeMinister: row['prime_minister'] ?? '',
    });
  });

  return { records, errors };
}

// ─── State Party Tenure CSV Parser ───────────────────────────────────────────

const STATE_PARTY_TENURE_REQUIRED_COLUMNS = [
  'state',
  'party',
  'total_days',
  'first_start',
  'last_end',
  'total_years',
  'first_year_in_power',
  'last_year_in_power',
];

/**
 * Parses a state party tenure CSV string (state_party_years_all_states.csv format).
 *
 * - Validates required columns.
 * - Parses dates and numeric fields.
 * - Skips rows with malformed numeric fields; logs DataLoadError.
 */
export function parseStatePartyTenureCsv(csvString: string): { records: StatePartyTenure[]; errors: DataLoadError[] } {
  const errors: DataLoadError[] = [];

  const result = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields ?? [];
  const missingColumns = validateColumns(headers, STATE_PARTY_TENURE_REQUIRED_COLUMNS);

  if (missingColumns.length > 0) {
    errors.push({
      file: 'state_party_years_all_states.csv',
      rowNumber: null,
      field: null,
      message: `Missing required columns: ${missingColumns.join(', ')}`,
    });
    return { records: [], errors };
  }

  const records: StatePartyTenure[] = [];

  result.data.forEach((row, index) => {
    const rowNumber = index + 2;

    const totalDays = parseFloat(row['total_days'] ?? '');
    const totalYears = parseFloat(row['total_years'] ?? '');
    const firstYearInPower = parseInt(row['first_year_in_power'] ?? '', 10);
    const lastYearInPower = parseInt(row['last_year_in_power'] ?? '', 10);

    if (isNaN(totalDays)) {
      errors.push({
        file: 'state_party_years_all_states.csv',
        rowNumber,
        field: 'total_days',
        message: `Row ${rowNumber}: malformed total_days "${row['total_days'] ?? ''}"`,
      });
      return;
    }

    if (isNaN(totalYears)) {
      errors.push({
        file: 'state_party_years_all_states.csv',
        rowNumber,
        field: 'total_years',
        message: `Row ${rowNumber}: malformed total_years "${row['total_years'] ?? ''}"`,
      });
      return;
    }

    if (isNaN(firstYearInPower)) {
      errors.push({
        file: 'state_party_years_all_states.csv',
        rowNumber,
        field: 'first_year_in_power',
        message: `Row ${rowNumber}: malformed first_year_in_power "${row['first_year_in_power'] ?? ''}"`,
      });
      return;
    }

    if (isNaN(lastYearInPower)) {
      errors.push({
        file: 'state_party_years_all_states.csv',
        rowNumber,
        field: 'last_year_in_power',
        message: `Row ${rowNumber}: malformed last_year_in_power "${row['last_year_in_power'] ?? ''}"`,
      });
      return;
    }

    records.push({
      state: row['state'] ?? '',
      party: row['party'] ?? '',
      totalDays,
      firstStart: parseDate(row['first_start']),
      lastEnd: parseDate(row['last_end']),
      totalYears,
      firstYearInPower,
      lastYearInPower,
    });
  });

  return { records, errors };
}

// ─── CSV Serializer ───────────────────────────────────────────────────────────

/**
 * Serializes an array of records back to a CSV string using the given column order.
 * Used for round-trip testing.
 */
export function serializeToCSV(records: Record<string, unknown>[], columns: string[]): string {
  if (records.length === 0) {
    return columns.join(',') + '\n';
  }

  const rows = records.map((record) =>
    columns.map((col) => {
      const value = record[col];
      if (value === null || value === undefined) {
        return '';
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      const str = String(value);
      // Quote fields that contain commas, quotes, or newlines
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  );

  return [columns.join(','), ...rows].join('\n') + '\n';
}

// ─── Deduplication ────────────────────────────────────────────────────────────

/**
 * Deduplicates CM records by (state, name, start_date), retaining the first
 * occurrence of each duplicate group.
 */
export function deduplicateCMRecords(records: CMRecord[]): CMRecord[] {
  const seen = new Set<string>();
  return records.filter((record) => {
    const key = `${record.state}|${record.name}|${record.startDate?.toISOString() ?? 'null'}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// ─── PM Record Derivation ─────────────────────────────────────────────────────

/**
 * Derives PMRecord[] from LokSabhaRecord[].
 *
 * Each Lok Sabha record maps to one PM record. startDate and endDate are null
 * since the CSV does not contain tenure dates for PMs.
 */
export function derivePMRecords(lokSabhaRecords: LokSabhaRecord[]): PMRecord[] {
  return lokSabhaRecords.map((record) => ({
    name: record.primeMinister,
    party: record.partyInGovernment,
    lokSabha: record.lokSabha,
    electionYear: record.electionYear,
    startDate: null,
    endDate: null,
    seatsWon: record.seatsWon,
  }));
}
