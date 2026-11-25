import { useEffect, useRef, useState } from 'react'
import { SearchIcon } from '../components/icons/icons'
import { Filters } from '../components/marketplace/Filters'
import { FiltersDrawer } from '../components/marketplace/FiltersDrawer'
import { FiltersSidebar } from '../components/marketplace/FiltersSidebar'
import { LoadMore } from '../components/marketplace/LoadMore'
import { MarketplaceHeader } from '../components/marketplace/MarketplaceHeader'
import {
  MARKETPLACE,
  noResultsDescription,
} from '../components/marketplace/marketplaceContent'
import type { SearchBarHandle } from '../components/marketplace/SearchBar'
import { SortSelect } from '../components/marketplace/SortSelect'
import { ProductGrid } from '../components/product/ProductGrid'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { useLoadMore } from '../hooks/useLoadMore'
import { useMarketplaceListings } from '../hooks/useMarketplaceListings'
import { MARKETPLACE_PAGE_SIZE } from '../utils/constants'
import { DEFAULT_LISTING_FILTERS } from '../utils/listingFilters'
import { getMarketplaceHeading } from '../utils/marketplaceHeading'

const RESULTS_HEADING_ID = 'marketplace-results-heading'

/**
 * MARKETPLACE: available listings with search (#11), filters and sorting (#12) and
 * "load more" pagination (#13). All criteria and the loaded pages live in the URL
 * (Issue #10); this page only wires them to the UI.
 */
export function Marketplace() {
  const {
    listings,
    isLoading,
    error,
    retry,
    filters,
    setFilters,
    resetFilters,
    activeFilterCount,
    totalAvailable,
  } = useMarketplaceListings()
  const searchRef = useRef<SearchBarHandle>(null)
  // Bumped on every reset so price drafts the URL never held (e.g. invalid ones) are dropped too.
  const [resetKey, setResetKey] = useState(0)

  const clearFilters = () => {
    resetFilters()
    setResetKey((key) => key + 1)
  }

  const resetSearchAndFilters = () => {
    setFilters(DEFAULT_LISTING_FILTERS)
    setResetKey((key) => key + 1)
    // The reset button unmounts with the empty state – keep focus in a useful place.
    searchRef.current?.focus()
  }

  const pagination = useLoadMore(listings)
  const resultsRef = useRef<HTMLElement>(null)
  // Index of the first card added by "Załaduj więcej", until it has been focused.
  const pendingFocusIndex = useRef<number | null>(null)

  const loadMore = () => {
    pendingFocusIndex.current = pagination.shownCount
    pagination.loadMore()
  }

  // Keyboard and screen-reader users continue from the first new card. It also keeps
  // focus off <body> when the button disappears after the last page.
  useEffect(() => {
    const index = pendingFocusIndex.current
    if (index === null || pagination.shownCount <= index) return
    pendingFocusIndex.current = null
    const firstNewCard = resultsRef.current?.querySelectorAll('ul > li').item(index)
    firstNewCard?.querySelector<HTMLAnchorElement>('a[href]')?.focus()
  }, [pagination.shownCount])

  const isSettled = !isLoading && !error
  const resultCount = isSettled ? listings.length : null
  // Listings exist, but none match the search or filters (vs. an empty catalogue).
  const hasNoMatches = isSettled && totalAvailable > 0 && listings.length === 0

  return (
    <>
      <MarketplaceHeader
        title={getMarketplaceHeading(filters)}
        query={filters.query}
        onSearch={(query) => setFilters({ query })}
        resultCount={resultCount}
        searchRef={searchRef}
      />

      <div className="bg-cream pt-7 pb-[62px] md:pt-12 md:pb-[94px]">
        <Container className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start lg:gap-12">
          <FiltersSidebar
            filters={filters}
            activeFilterCount={activeFilterCount}
            onChange={setFilters}
            onReset={clearFilters}
            resetKey={resetKey}
            className="max-lg:hidden"
          />

          <div className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-3 lg:mb-6 lg:justify-end">
              <FiltersDrawer
                activeFilterCount={activeFilterCount}
                resultCount={resultCount}
                onReset={clearFilters}
              >
                <Filters filters={filters} onChange={setFilters} resetKey={resetKey} />
              </FiltersDrawer>
              <SortSelect
                value={filters.sortBy}
                onChange={(sortBy) => setFilters({ sortBy })}
              />
            </div>

            <section ref={resultsRef} aria-labelledby={RESULTS_HEADING_ID}>
              <h2 id={RESULTS_HEADING_ID} className="sr-only">
                {MARKETPLACE.resultsHeading}
              </h2>

              {hasNoMatches ? (
                <EmptyState
                  compact
                  headingLevel="h3"
                  icon={<SearchIcon size={30} />}
                  title={MARKETPLACE.noResultsTitle}
                  description={noResultsDescription(filters.query)}
                  action={
                    <Button variant="secondary" onClick={resetSearchAndFilters}>
                      {MARKETPLACE.resetAction}
                    </Button>
                  }
                />
              ) : (
                <ProductGrid
                  withSidebar
                  listings={pagination.visibleItems}
                  isLoading={isLoading}
                  error={error}
                  onRetry={retry}
                  // No action: the "add listing" page doesn't exist yet (Sprint 4).
                  emptyTitle={MARKETPLACE.emptyTitle}
                  emptyDescription={MARKETPLACE.emptyDescription}
                />
              )}

              {isSettled && (
                <LoadMore
                  shownCount={pagination.shownCount}
                  totalCount={pagination.totalCount}
                  hasMore={pagination.hasMore}
                  pageSize={MARKETPLACE_PAGE_SIZE}
                  onLoadMore={loadMore}
                />
              )}
            </section>
          </div>
        </Container>
      </div>
    </>
  )
}
