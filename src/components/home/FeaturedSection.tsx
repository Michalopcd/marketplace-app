import {
  FEATURED_COUNT,
  type FeaturedListings,
} from '../../hooks/useFeaturedListings'
import { PATHS } from '../../utils/paths'
import { ProductGrid } from '../product/ProductGrid'
import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { FEATURED_SECTION } from './homeContent'

const HEADING_ID = 'featured-heading'

/** "Świeżo dodane" – newest listings on a cream band, with loading/error/empty states. */
export function FeaturedSection({ listings, isLoading, error, retry }: FeaturedListings) {
  return (
    <section aria-labelledby={HEADING_ID} className="bg-cream py-[62px] md:py-[94px]">
      <Container>
        <SectionHeading
          id={HEADING_ID}
          eyebrow={FEATURED_SECTION.eyebrow}
          title={FEATURED_SECTION.title}
          action={{ label: FEATURED_SECTION.action, to: PATHS.marketplace }}
        />

        <ProductGrid
          listings={listings}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
          skeletonCount={FEATURED_COUNT}
          emptyTitle={FEATURED_SECTION.emptyTitle}
          emptyDescription={FEATURED_SECTION.emptyDescription}
          emptyAction={
            <ButtonLink to={PATHS.createListing} variant="secondary">
              Dodaj pierwsze ogłoszenie
            </ButtonLink>
          }
        />
      </Container>
    </section>
  )
}
