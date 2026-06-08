/**
 * Date utility functions for the Election Guide Website.
 */

import type { CMRecord } from '../types';

const STALENESS_THRESHOLD_DAYS = 180;

/**
 * Returns true if the given date is more than 180 days before the current date.
 * Returns false if the date is null/undefined or within the threshold.
 *
 * Validates: Requirements 12.2 (Property 15: Staleness Check Correctness)
 */
export function isStale(date: Date | null | undefined): boolean {
  if (!date) return false;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > STALENESS_THRESHOLD_DAYS;
}

/**
 * Sorts CM records chronologically (ascending by startDate).
 * Records with null startDate are placed at the end.
 *
 * Validates: Requirements 2.4 (Property P5: Chronological Record Ordering)
 */
export function sortCMChronological(records: CMRecord[]): CMRecord[] {
  return [...records].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.getTime() - b.startDate.getTime();
  });
}

/**
 * Formats a Date to a human-readable string (e.g. "15 January 2024").
 * Returns an empty string for null/undefined.
 */
export function formatDate(date: Date | null | undefined): string {
  if (!date) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
