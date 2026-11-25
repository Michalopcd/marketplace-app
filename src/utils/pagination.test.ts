import { describe, expect, it } from 'vitest'
import { MARKETPLACE_PAGE_SIZE } from './constants'
import { paginate, parsePageParam } from './pagination'

const items = (count: number) => Array.from({ length: count }, (_, index) => index)

describe('MARKETPLACE_PAGE_SIZE', () => {
  it('loads 20 listings per page (Issue #13, Firestore limit(20) later)', () => {
    expect(MARKETPLACE_PAGE_SIZE).toBe(20)
  })
})

describe('parsePageParam', () => {
  it.each([null, '', ' ', 'abc', '0', '-1', '1.5', '1e2', '0x2', '+2', '2abc'])(
    'treats %j as the first page',
    (raw) => {
      expect(parsePageParam(raw)).toBe(1)
    },
  )

  it.each([
    ['1', 1],
    ['2', 2],
    ['15', 15],
  ])('reads %j as page %d', (raw, page) => {
    expect(parsePageParam(raw)).toBe(page)
  })

  it('caps absurd values instead of overflowing', () => {
    expect(parsePageParam('9'.repeat(30))).toBe(1000)
  })
})

describe('paginate', () => {
  it('handles an empty list', () => {
    expect(paginate([], 1, 20)).toEqual({
      visibleItems: [],
      shownCount: 0,
      totalCount: 0,
      hasMore: false,
    })
  })

  it('shows everything when there is less than one page', () => {
    const result = paginate(items(5), 1, 20)

    expect(result.visibleItems).toEqual(items(5))
    expect(result.hasMore).toBe(false)
  })

  it('has no more items with exactly one full page', () => {
    const result = paginate(items(20), 1, 20)

    expect(result.shownCount).toBe(20)
    expect(result.hasMore).toBe(false)
  })

  it('shows the first page of a longer list', () => {
    const result = paginate(items(24), 1, 20)

    expect(result.visibleItems).toEqual(items(20))
    expect(result).toMatchObject({ shownCount: 20, totalCount: 24, hasMore: true })
  })

  it('accumulates pages: page 2 shows the first 40 items', () => {
    expect(paginate(items(26), 2, 20)).toMatchObject({
      shownCount: 26,
      totalCount: 26,
      hasMore: false,
    })
    expect(paginate(items(50), 2, 20)).toMatchObject({ shownCount: 40, hasMore: true })
  })

  it('shows everything for a page past the end', () => {
    const result = paginate(items(24), 99, 20)

    expect(result.visibleItems).toEqual(items(24))
    expect(result.hasMore).toBe(false)
  })

  it('does not mutate the input', () => {
    const input = Object.freeze(items(24))

    expect(() => paginate(input, 1, 20)).not.toThrow()
    expect(input).toHaveLength(24)
  })
})
