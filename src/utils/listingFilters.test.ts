import { describe, expect, it } from 'vitest'
import { mockListings } from '../data/mockListings'
import type { Listing, ListingFilters } from '../types/listing'
import {
  applyListingFilters,
  countActiveFilters,
  DEFAULT_LISTING_FILTERS,
  filterListings,
  getPriceRangeError,
  sortListings,
} from './listingFilters'

function listing(overrides: Partial<Listing> & Pick<Listing, 'id'>): Listing {
  return {
    userId: 'user-1',
    title: 'Produkt',
    description: 'Opis produktu testowego.',
    price: 100,
    category: 'other',
    condition: 'good',
    images: [],
    isSold: false,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
    ...overrides,
  }
}

const coat = listing({
  id: 'a',
  title: 'Wełniany płaszcz',
  price: 240,
  category: 'fashion',
  subcategory: 'women',
  condition: 'like-new',
  createdAt: '2026-11-05T10:00:00.000Z',
})
const jacket = listing({
  id: 'b',
  title: 'Kurtka puchowa',
  price: 180,
  category: 'fashion',
  subcategory: 'men',
  condition: 'good',
  createdAt: '2026-11-04T10:00:00.000Z',
})
const headphones = listing({
  id: 'c',
  title: 'Słuchawki bezprzewodowe',
  price: 180,
  category: 'electronics',
  condition: 'new',
  createdAt: '2026-11-06T10:00:00.000Z',
})
const lamp = listing({
  id: 'd',
  title: 'Lampa stołowa',
  price: 60,
  category: 'home',
  condition: 'fair',
  createdAt: '2026-11-04T10:00:00.000Z',
})

const sample: readonly Listing[] = Object.freeze([coat, jacket, headphones, lamp])

const withFilters = (patch: Partial<ListingFilters>): ListingFilters => ({
  ...DEFAULT_LISTING_FILTERS,
  ...patch,
})

const ids = (listings: readonly Listing[]) => listings.map((l) => l.id)

describe('DEFAULT_LISTING_FILTERS', () => {
  it('has no constraints and sorts by newest', () => {
    expect(DEFAULT_LISTING_FILTERS).toEqual({
      query: '',
      category: null,
      subcategory: null,
      condition: null,
      minPrice: null,
      maxPrice: null,
      sortBy: 'newest',
    })
  })
})

describe('filterListings', () => {
  it('returns every listing without constraints', () => {
    expect(ids(filterListings(sample, DEFAULT_LISTING_FILTERS))).toEqual(['a', 'b', 'c', 'd'])
  })

  describe('query', () => {
    it('matches the title case-insensitively, including Polish letters', () => {
      expect(ids(filterListings(sample, withFilters({ query: 'WEŁNIANY' })))).toEqual(['a'])
      expect(ids(filterListings(sample, withFilters({ query: 'słuchawki' })))).toEqual(['c'])
    })

    it('matches a fragment and trims surrounding spaces', () => {
      expect(ids(filterListings(sample, withFilters({ query: '  puch  ' })))).toEqual(['b'])
    })

    it('treats a blank query as no constraint', () => {
      expect(filterListings(sample, withFilters({ query: '   ' }))).toHaveLength(4)
    })

    it('does not search the description', () => {
      expect(filterListings(sample, withFilters({ query: 'testowego' }))).toEqual([])
    })

    it('returns an empty list when nothing matches', () => {
      expect(filterListings(sample, withFilters({ query: 'rower' }))).toEqual([])
    })
  })

  describe('category and subcategory', () => {
    it('filters by category', () => {
      expect(ids(filterListings(sample, withFilters({ category: 'electronics' })))).toEqual(['c'])
    })

    it('treats fashion without a subcategory as all of fashion', () => {
      expect(ids(filterListings(sample, withFilters({ category: 'fashion' })))).toEqual(['a', 'b'])
    })

    it('narrows fashion by subcategory', () => {
      expect(
        ids(filterListings(sample, withFilters({ category: 'fashion', subcategory: 'men' }))),
      ).toEqual(['b'])
    })

    it('ignores a subcategory outside fashion', () => {
      expect(
        ids(filterListings(sample, withFilters({ category: 'home', subcategory: 'men' }))),
      ).toEqual(['d'])
      expect(filterListings(sample, withFilters({ subcategory: 'women' }))).toHaveLength(4)
    })
  })

  it('filters by condition', () => {
    expect(ids(filterListings(sample, withFilters({ condition: 'fair' })))).toEqual(['d'])
  })

  describe('price range', () => {
    it('includes both bounds', () => {
      expect(
        ids(filterListings(sample, withFilters({ minPrice: 180, maxPrice: 240 }))),
      ).toEqual(['a', 'b', 'c'])
    })

    it('accepts a single bound', () => {
      expect(ids(filterListings(sample, withFilters({ minPrice: 200 })))).toEqual(['a'])
      expect(ids(filterListings(sample, withFilters({ maxPrice: 60 })))).toEqual(['d'])
    })

    it('treats 0 as a real bound', () => {
      expect(filterListings(sample, withFilters({ maxPrice: 0 }))).toEqual([])
    })

    it('returns an empty list for a range without listings', () => {
      expect(filterListings(sample, withFilters({ minPrice: 1000 }))).toEqual([])
    })
  })

  it('combines all constraints', () => {
    const filters = withFilters({
      query: 'płaszcz',
      category: 'fashion',
      subcategory: 'women',
      condition: 'like-new',
      minPrice: 200,
      maxPrice: 300,
    })
    expect(ids(filterListings(sample, filters))).toEqual(['a'])
    expect(filterListings(sample, { ...filters, condition: 'new' })).toEqual([])
  })

  it('works on the mock data', () => {
    const result = filterListings(mockListings, withFilters({ category: 'fashion', subcategory: 'women' }))
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((l) => l.category === 'fashion' && l.subcategory === 'women')).toBe(true)
  })
})

describe('sortListings', () => {
  it('sorts newest first, breaking date ties by id', () => {
    expect(ids(sortListings(sample, 'newest'))).toEqual(['c', 'a', 'b', 'd'])
  })

  it('sorts by ascending price, newest first on equal prices', () => {
    expect(ids(sortListings(sample, 'price-asc'))).toEqual(['d', 'c', 'b', 'a'])
  })

  it('sorts by descending price, newest first on equal prices', () => {
    expect(ids(sortListings(sample, 'price-desc'))).toEqual(['a', 'c', 'b', 'd'])
  })

  it('does not mutate the input (frozen array)', () => {
    expect(() => sortListings(sample, 'price-asc')).not.toThrow()
    expect(ids(sample)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('sorts the mock data by price', () => {
    const prices = sortListings(mockListings, 'price-asc').map((l) => l.price)
    expect(prices).toEqual(prices.toSorted((x, y) => x - y))
  })
})

describe('applyListingFilters', () => {
  it('filters, then sorts', () => {
    const filters = withFilters({ maxPrice: 200, sortBy: 'price-desc' })
    expect(ids(applyListingFilters(sample, filters))).toEqual(['c', 'b', 'd'])
  })

  it('returns an empty list for an empty input', () => {
    expect(applyListingFilters([], DEFAULT_LISTING_FILTERS)).toEqual([])
  })
})

describe('getPriceRangeError', () => {
  it('accepts open and valid ranges', () => {
    expect(getPriceRangeError(null, null)).toBeNull()
    expect(getPriceRangeError(10, null)).toBeNull()
    expect(getPriceRangeError(null, 10)).toBeNull()
    expect(getPriceRangeError(10, 10)).toBeNull()
    expect(getPriceRangeError(0, 50)).toBeNull()
  })

  it('reports a minimum above the maximum', () => {
    expect(getPriceRangeError(50, 10)).toBe('min-greater-than-max')
  })
})

describe('countActiveFilters', () => {
  it('is 0 for the defaults', () => {
    expect(countActiveFilters(DEFAULT_LISTING_FILTERS)).toBe(0)
  })

  it('ignores the search query and sorting', () => {
    expect(countActiveFilters(withFilters({ query: 'kurtka', sortBy: 'price-asc' }))).toBe(0)
  })

  it('counts category with subcategory as one filter', () => {
    expect(countActiveFilters(withFilters({ category: 'fashion', subcategory: 'men' }))).toBe(1)
  })

  it('counts a price range as one filter', () => {
    expect(countActiveFilters(withFilters({ minPrice: 10 }))).toBe(1)
    expect(countActiveFilters(withFilters({ minPrice: 10, maxPrice: 50 }))).toBe(1)
    expect(countActiveFilters(withFilters({ maxPrice: 0 }))).toBe(1)
  })

  it('counts category, condition and price', () => {
    expect(
      countActiveFilters(withFilters({ category: 'home', condition: 'new', maxPrice: 100 })),
    ).toBe(3)
  })
})
