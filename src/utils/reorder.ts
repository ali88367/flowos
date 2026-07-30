/**
 * Merges a locally-reordered subsequence of ids back into the full ordered
 * list, preserving the relative position of ids that weren't part of the
 * visible/filtered subsequence being dragged.
 */
export function mergeReorder(
  fullIds: string[],
  visibleIds: string[],
  newVisibleOrder: string[],
): string[] {
  const visibleSet = new Set(visibleIds);
  const queue = [...newVisibleOrder];

  return fullIds.map((id) => (visibleSet.has(id) ? (queue.shift() as string) : id));
}
