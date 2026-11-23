import { useRef } from 'react'
import { SearchIcon } from '../components/icons/icons'
import type { SearchBarHandle } from '../components/marketplace/SearchBar'
import { MarketplaceHeader } from '../components/marketplace/MarketplaceHeader'
import {
  MARKETPLACE,
  noResultsDescription,
} from '../components/marketplace/marketplaceContent'
import { ProductGrid } from '../components/product/ProductGrid'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { useMarketplaceListings } from '../hooks/useMarketplaceListings'
import { DEFAULT_LISTING_FILTERS } from '../utils/listingFilters'
import { getMarketplaceHeading } from '../utils/marketplaceHeading'

const RESULTS_HEADING_ID = 'marketplace-results-heading'

/** MARKETPLACE: all available listings with search; filters come from the URL (Issue #10). */
export function Marketplace() {
  const {
    listings,
    isLoading,
    error,
    retry,
    filters,
    setFilters,
    totalAvailable,
  } = useMarketplaceListings()
  const searchRef = useRef<SearchBarHandle>(null)

  const resetSearchAndFilters = () => {
    setFilters(DEFAULT_LISTING_FILTERS)
    // The reset button unmounts with the empty state – keep focus in a useful place.
    searchRef.current?.focus()
  }

  const isSettled = !isLoading && !error
  // Listings exist, but none match the search or filters (vs. an empty catalogue).
  const hasNoMatches = isSettled && totalAvailable > 0 && listings.length === 0

  return (
    <>
      <MarketplaceHeader
        title={getMarketplaceHeading(filters)}
        query={filters.query}
        onSearch={(query) => setFilters({ query })}
        resultCount={isSettled ? listings.length : null}
        searchRef={searchRef}
      />

      <section
        aria-labelledby={RESULTS_HEADING_ID}
        className="bg-cream pt-7 pb-[62px] md:pt-12 md:pb-[94px]"
      >
        <Container>
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
              listings={listings}
              isLoading={isLoading}
              error={error}
              onRetry={retry}
              // No action: the "add listing" page doesn't exist yet (Sprint 4).
              emptyTitle={MARKETPLACE.emptyTitle}
              emptyDescription={MARKETPLACE.emptyDescription}
            />
          )}
        </Container>
      </section>
    </>
  )
}
