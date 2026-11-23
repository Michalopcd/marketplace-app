import type { Ref } from 'react'
import { formatOfferCount } from '../../utils/formatting'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { MARKETPLACE } from './marketplaceContent'
import { SearchBar, type SearchBarHandle } from './SearchBar'

interface MarketplaceHeaderProps {
  title: string
  query: string
  onSearch: (query: string) => void
  /** Number of results, or `null` while loading or after an error (count hidden). */
  resultCount: number | null
  searchRef?: Ref<SearchBarHandle>
}

/** Page intro: eyebrow, h1 (from the category filter), search and the live result count. */
export function MarketplaceHeader({
  title,
  query,
  onSearch,
  resultCount,
  searchRef,
}: MarketplaceHeaderProps) {
  return (
    <Container className="pt-7 pb-[22px] md:pt-11 md:pb-[34px]">
      <Eyebrow className="mb-2.5">{MARKETPLACE.eyebrow}</Eyebrow>
      <h1 className="font-display text-[36px] leading-[1.04] tracking-[-0.03em] text-balance md:text-[52px]">
        {title}
      </h1>

      <SearchBar ref={searchRef} value={query} onSearch={onSearch} />

      {/* Always mounted, so screen readers announce every change of the count. */}
      <p
        role="status"
        data-result-count=""
        className="mt-3.5 min-h-5 text-[13px] text-muted md:mt-[18px]"
      >
        {resultCount !== null && (
          <>
            <strong className="font-bold text-ink">
              {formatOfferCount(resultCount)}
            </strong>
            {query !== '' && ` dla „${query}”`}
          </>
        )}
      </p>
    </Container>
  )
}
