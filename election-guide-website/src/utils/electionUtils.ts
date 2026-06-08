import type { ElectionStep } from '../types';

/**
 * Sorts an array of ElectionStep objects by the `order` field in ascending order.
 * Returns a new array; does not mutate the input.
 */
export function sortElectionSteps(steps: ElectionStep[]): ElectionStep[] {
  return [...steps].sort((a, b) => a.order - b.order);
}
