export function isStale(date: Date | null, thresholdDays = 180): boolean {
  if (!date) return true; // If no date, assume stale

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > thresholdDays;
}
