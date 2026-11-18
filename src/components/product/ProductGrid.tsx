import type { ReactNode } from 'react'
import type { Listing } from '../../types/listing'
import { EmptyState } from '../ui/EmptyState'
import { ErrorMessage } from '../ui/ErrorMessage'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

interface ProductGridProps {
  listings: readonly Listing[]
  isLoading?: boolean
  /** User-facing error message; replaces the grid when set. */
  error?: string | null
  onRetry?: () => void
  skeletonCount?: number
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  favoriteIds?: ReadonlySet<Listing['id']>
  onToggleFavorite?: (listingId: Listing['id']) => void
}

/** Mobile-first: 2 columns on phones, 3 on tablets, 4 on desktop. */
const gridClassName =
  'grid grid-cols-2 gap-x-2.5 gap-y-7 md:grid-cols-3 md:gap-x-4 md:gap-y-9 lg:grid-cols-4 lg:gap-x-[18px]'

export function ProductGrid(props: ProductGridProps) {
  return (
    <>
      <p role="status" className="sr-only">
        {props.isLoading ? 'Ładowanie produktów…' : ''}
      </p>

      <ProductGridContent {...props} />
    </>
  )
}

function ProductGridContent({
  listings,
  isLoading = false,
  error = null,
  onRetry,
  skeletonCount = 8,
  emptyTitle = 'Brak produktów',
  emptyDescription = 'Nie znaleźliśmy tu jeszcze żadnych ogłoszeń. Zajrzyj później.',
  emptyAction,
  favoriteIds,
  onToggleFavorite,
}: ProductGridProps) {
  if (isLoading) {
    const safeCount = Number.isFinite(skeletonCount)
      ? Math.max(0, Math.floor(skeletonCount))
      : 0

    return (
      <div aria-hidden="true" className={gridClassName}>
        {Array.from({ length: safeCount }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        compact
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return (
    <ul className={gridClassName}>
      {listings.map((listing) => (
        <li key={listing.id} className="min-w-0">
          <ProductCard
            listing={listing}
            isFavorite={favoriteIds?.has(listing.id) ?? false}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  )
}
