/**
 * Client-side "load more" pagination (Issue #13). `page` counts loaded pages, so
 * page 2 shows the first 2 × pageSize items. Source-agnostic: the Firestore
 * version (Sprint 5) can keep the same result shape.
 */

/** Upper bound for `?page=` – far beyond any real list, it only guards against absurd URLs. */
export const MAX_PAGE = 1000

const PAGE_PATTERN = /^\d+$/

/** `?page=` value → page number; anything that isn't a positive integer is page 1. */
export function parsePageParam(raw: string | null): number {
  if (raw === null || !PAGE_PATTERN.test(raw)) return 1
  const page = Number(raw)
  if (page < 1) return 1
  return Math.min(page, MAX_PAGE)
}

export interface PaginationResult<T> {
  visibleItems: T[]
  shownCount: number
  totalCount: number
  hasMore: boolean
}

export function paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): PaginationResult<T> {
  const visibleItems = items.slice(0, page * pageSize)
  return {
    visibleItems,
    shownCount: visibleItems.length,
    totalCount: items.length,
    hasMore: visibleItems.length < items.length,
  }
}
