import { Link } from 'react-router'
import type { Listing } from '../../types/listing'
import { cn } from '../../utils/cn'
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  FASHION_SUBCATEGORY_LABELS,
} from '../../utils/constants'
import { formatPrice } from '../../utils/formatting'
import { HeartIcon } from '../icons/HeartIcon'
import { Badge } from '../ui/Badge'

interface Props {
  listing: Listing
  /** Favorite toggle is shown only when a handler is given (logic arrives in Sprint 5). */
  isFavorite?: boolean
  onToggleFavorite?: (listingId: Listing['id']) => void
  headingLevel?: 'h2' | 'h3'
}

function categoryLine({ category, subcategory }: Listing): string {
  const categoryLabel = CATEGORY_LABELS[category]
  return subcategory
    ? `${categoryLabel} · ${FASHION_SUBCATEGORY_LABELS[subcategory]}`
    : categoryLabel
}

export function ProductCard({
  listing,
  isFavorite = false,
  onToggleFavorite,
  headingLevel: Heading = 'h3',
}: Props) {
  const { id, title, images, price, size, condition, isSold } = listing
  const href = `/product/${id}`

  return (
    <article className="group relative min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {images[0] && (
          <img
            src={images[0]}
            // Decorative: the title right below is the link name; repeating it adds noise.
            alt=""
            width={640}
            height={800}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        )}
        {isSold && (
          <Badge variant="muted" className="absolute top-2.5 left-2.5">
            Sprzedane
          </Badge>
        )}
      </div>

      <div className="pt-3.5">
        <p className="text-[11px] font-bold tracking-[0.05em] text-muted uppercase">
          {categoryLine(listing)}
        </p>
        <Heading className="mt-1 font-display text-lg leading-tight">
          {/* Stretched link: the whole card is clickable, with one focus stop. */}
          <Link
            to={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus"
          >
            {title}
          </Link>
        </Heading>
        <p className="mt-1.5 truncate text-xs text-muted">
          {size && (
            <>
              <span className="sr-only">Rozmiar: </span>
              {size}
              <span aria-hidden="true" className="mx-1.5">
                •
              </span>
            </>
          )}
          <span className="sr-only">Stan: </span>
          {CONDITION_LABELS[condition]}
        </p>
        <p className="mt-2.5 text-sm font-bold">
          <span className="sr-only">Cena: </span>
          {formatPrice(price)}
        </p>
      </div>

      {onToggleFavorite && (
        <button
          type="button"
          onClick={() => onToggleFavorite(id)}
          // Toggle button pattern: constant label, state conveyed by aria-pressed only.
          aria-pressed={isFavorite}
          aria-label={`Ulubione: ${title}`}
          className={cn(
            // z-10 keeps the button above the stretched link; 44px touch target.
            'absolute top-2 right-2 z-10 grid size-11 place-items-center rounded-full bg-white/90 shadow-soft transition-colors',
            isFavorite ? 'text-favorite' : 'text-ink hover:text-favorite',
          )}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      )}
    </article>
  )
}
