/**
 * Date utility functions for the Election Guide Website.
 */

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
