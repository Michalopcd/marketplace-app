import { useSearchParams } from 'react-router'
import { MARKETPLACE_PAGE_SIZE } from '../utils/constants'
import { paginate, parsePageParam, type PaginationResult } from '../utils/pagination'

export const PAGE_PARAM = 'page'

export interface LoadMore<T> extends PaginationResult<T> {
  /** Loads the next page: `?page=N+1`, keeping the other parameters (new history entry). */
  loadMore: () => void
}

/**
 * "Load more" pagination stored in the URL (`?page=`), so a refresh or a shared
 * link keeps the loaded results and Back undoes the last "load more".
 *
 * Filter, search and sort changes reset it on their own: `useListingFilters`
 * writes only filter keys to the URL (Issue #10), which drops `page`.
 */
export function useLoadMore<T>(
  items: readonly T[],
  pageSize: number = MARKETPLACE_PAGE_SIZE,
): LoadMore<T> {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePageParam(searchParams.get(PAGE_PARAM))
  const result = paginate(items, page, pageSize)

  const loadMore = () => {
    if (!result.hasMore) return
    const next = new URLSearchParams(searchParams)
    next.set(PAGE_PARAM, String(page + 1))
    setSearchParams(next)
  }

  return { ...result, loadMore }
}
