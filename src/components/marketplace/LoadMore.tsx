import { Button } from '../ui/Button'
import { LOAD_MORE } from './marketplaceContent'

interface LoadMoreProps {
  shownCount: number
  totalCount: number
  hasMore: boolean
  pageSize: number
  onLoadMore: () => void
}

/**
 * Footer under the results: "Wyświetlono X z Y ofert", a decorative progress bar
 * and the "Załaduj więcej" button. Hidden when the results fit on one page.
 */
export function LoadMore({ shownCount, totalCount, hasMore, pageSize, onLoadMore }: LoadMoreProps) {
  if (totalCount <= pageSize) return null

  const progress = Math.round((shownCount / totalCount) * 100)

  return (
    <div className="mt-9 flex flex-col items-center gap-3.5 text-center md:mt-12">
      {/* Announced after each "load more"; the bar below only repeats it visually. */}
      <p role="status" className="text-[13px] text-muted">
        {/* Only shown for more than one page, so "z Y" always takes the genitive plural "ofert". */}
        Wyświetlono <strong className="font-bold text-ink">{shownCount}</strong> z{' '}
        <strong className="font-bold text-ink">{totalCount}</strong> ofert
      </p>
      <div aria-hidden="true" className="h-0.5 w-full overflow-hidden bg-line sm:w-60">
        <span className="block h-full bg-forest" style={{ width: `${progress}%` }} />
      </div>
      {hasMore && (
        <Button variant="secondary" onClick={onLoadMore} className="mt-1.5 w-full sm:w-auto sm:min-w-55">
          {LOAD_MORE.action}
        </Button>
      )}
    </div>
  )
}
