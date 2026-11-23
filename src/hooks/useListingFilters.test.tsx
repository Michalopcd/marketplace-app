// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import { describe, expect, it } from 'vitest'
import { DEFAULT_LISTING_FILTERS } from '../utils/listingFilters'
import { useListingFilters } from './useListingFilters'

/** Renders the hook with the current location and a navigate function for history checks. */
function renderFilters(entries: string[] = ['/marketplace']) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
      {children}
    </MemoryRouter>
  )
  return renderHook(
    () => ({ ...useListingFilters(), location: useLocation(), navigate: useNavigate() }),
    { wrapper },
  )
}

describe('useListingFilters', () => {
  it('reads the filters from the URL', () => {
    const { result } = renderFilters([
      '/marketplace?query=kurtka&category=fashion&subcategory=men&sortBy=price-asc',
    ])

    expect(result.current.filters).toEqual({
      ...DEFAULT_LISTING_FILTERS,
      query: 'kurtka',
      category: 'fashion',
      subcategory: 'men',
      sortBy: 'price-asc',
    })
    expect(result.current.activeFilterCount).toBe(1)
  })

  it('falls back to the defaults for invalid parameters', () => {
    const { result } = renderFilters(['/marketplace?category=cars&minPrice=-1&sortBy=abc'])

    expect(result.current.filters).toEqual(DEFAULT_LISTING_FILTERS)
    expect(result.current.activeFilterCount).toBe(0)
  })

  it('merges a patch into the URL in canonical form', () => {
    const { result } = renderFilters(['/marketplace?category=home'])

    act(() => result.current.setFilters({ maxPrice: 200, sortBy: 'price-desc' }))

    expect(result.current.location.pathname).toBe('/marketplace')
    expect(result.current.location.search).toBe('?category=home&maxPrice=200&sortBy=price-desc')
    expect(result.current.filters).toMatchObject({ category: 'home', maxPrice: 200 })
    expect(result.current.activeFilterCount).toBe(2)
  })

  it('applies a multi-field patch in one update', () => {
    const { result } = renderFilters()

    act(() => result.current.setFilters({ category: 'sports', condition: 'new' }))

    expect(result.current.location.search).toBe('?category=sports&condition=new')
  })

  it('builds on the filters from the latest render between separate updates', () => {
    const { result } = renderFilters()

    act(() => result.current.setFilters({ category: 'sports' }))
    act(() => result.current.setFilters({ condition: 'new' }))

    expect(result.current.location.search).toBe('?category=sports&condition=new')
  })

  it('drops the subcategory when the category changes away from fashion', () => {
    const { result } = renderFilters(['/marketplace?category=fashion&subcategory=women'])

    act(() => result.current.setFilters({ category: 'electronics' }))

    expect(result.current.location.search).toBe('?category=electronics')
    expect(result.current.filters.subcategory).toBeNull()
  })

  it('removes a parameter when it is set back to its default', () => {
    const { result } = renderFilters(['/marketplace?query=lampa&sortBy=price-asc'])

    act(() => result.current.setFilters({ query: '', sortBy: 'newest' }))

    expect(result.current.location.search).toBe('')
  })

  it('ignores undefined fields in a patch', () => {
    const { result } = renderFilters(['/marketplace?query=lampa&sortBy=price-asc'])

    act(() => result.current.setFilters({ query: undefined, sortBy: undefined, condition: 'new' }))

    expect(result.current.location.search).toBe('?query=lampa&condition=new&sortBy=price-asc')
  })

  it('drops unrelated parameters when writing', () => {
    const { result } = renderFilters(['/marketplace?utm_source=x&category=home'])

    act(() => result.current.setFilters({ condition: 'good' }))

    expect(result.current.location.search).toBe('?category=home&condition=good')
  })

  it('resets filters and sorting but keeps the search query', () => {
    const { result } = renderFilters([
      '/marketplace?query=kurtka&category=fashion&subcategory=men&condition=good&minPrice=10&sortBy=price-asc',
    ])

    act(() => result.current.resetFilters())

    expect(result.current.location.search).toBe('?query=kurtka')
    expect(result.current.filters).toEqual({ ...DEFAULT_LISTING_FILTERS, query: 'kurtka' })
  })

  describe('browser history', () => {
    const entries = ['/', '/marketplace?category=home']

    it('pushes a new entry by default, so Back restores the previous filters', () => {
      const { result } = renderFilters(entries)

      act(() => result.current.setFilters({ condition: 'new' }))
      expect(result.current.location.search).toBe('?category=home&condition=new')

      act(() => void result.current.navigate(-1))

      expect(result.current.location.search).toBe('?category=home')
      expect(result.current.filters.condition).toBeNull()
    })

    it('replaces the current entry with { replace: true }', () => {
      const { result } = renderFilters(entries)

      act(() => result.current.setFilters({ minPrice: 1 }, { replace: true }))
      act(() => result.current.setFilters({ minPrice: 15 }, { replace: true }))
      expect(result.current.location.search).toBe('?category=home&minPrice=15')

      act(() => void result.current.navigate(-1))

      expect(result.current.location.pathname).toBe('/')
    })

    it('supports { replace: true } on reset', () => {
      const { result } = renderFilters(entries)

      act(() => result.current.resetFilters({ replace: true }))
      expect(result.current.location.search).toBe('')

      act(() => void result.current.navigate(-1))

      expect(result.current.location.pathname).toBe('/')
    })
  })
})
