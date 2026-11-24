import { useId } from 'react'
import type { ListingFilters } from '../../types/listing'
import { cn } from '../../utils/cn'
import { Filters } from './Filters'
import { FILTERS } from './marketplaceContent'

interface FiltersSidebarProps {
  filters: ListingFilters
  activeFilterCount: number
  onChange: (patch: Partial<ListingFilters>) => void
  onReset: () => void
  resetKey?: number
  className?: string
}

/**
 * Desktop filters (lg+): a sticky column next to the results. It is capped at the
 * screen height and scrolls on its own, so with fashion expanded on a 768px-tall
 * laptop the condition options stay reachable while the results scroll.
 */
export function FiltersSidebar({
  filters,
  activeFilterCount,
  onChange,
  onReset,
  resetKey,
  className,
}: FiltersSidebarProps) {
  const headingId = useId()
  const canReset = activeFilterCount > 0

  return (
    <aside
      aria-labelledby={headingId}
      className={cn(
        // top-6 (1.5rem) + the same gap below = 3rem. -mx/px keep focus rings inside the scroll box.
        'lg:sticky lg:top-6 lg:-mx-2 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain lg:px-2',
        className,
      )}
    >
      <div className="flex items-baseline justify-between border-b border-ink pb-3.5">
        <h2 id={headingId} className="font-display text-2xl">
          {FILTERS.heading}
        </h2>
        <button
          type="button"
          // aria-disabled (not disabled): after clearing, a disabled button would drop
          // keyboard focus to <body>; this one keeps it and stays announced as unavailable.
          onClick={canReset ? onReset : undefined}
          aria-disabled={!canReset}
          className="min-h-11 border-b border-field text-[13px] font-bold text-forest transition-colors hover:border-forest aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:border-field"
        >
          {FILTERS.clear}{' '}
          <span className="sr-only">filtry</span>
          {canReset && ` (${activeFilterCount})`}
        </button>
      </div>

      <Filters filters={filters} onChange={onChange} resetKey={resetKey} />
    </aside>
  )
}
