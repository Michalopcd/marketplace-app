import { describe, expect, expectTypeOf, it } from 'vitest'
import { isNavTargetActive, marketplacePath, PATHS } from './paths'

describe('marketplacePath', () => {
  it('builds a category filter URL', () => {
    expect(marketplacePath({ category: 'home' })).toBe(
      '/marketplace?category=home',
    )
  })

  it('adds the fashion subcategory', () => {
    expect(marketplacePath({ category: 'fashion', subcategory: 'men' })).toBe(
      '/marketplace?category=fashion&subcategory=men',
    )
  })

  it('rejects filters that break the category model (type-level check)', () => {
    // Checked by `tsc -b` only – the build fails if either call ever type-checks.
    // Wrapped in a function that is never invoked, so nothing runs at test time.
    const invalidCalls = () => {
      // @ts-expect-error – fashion requires a subcategory
      marketplacePath({ category: 'fashion' })
      // @ts-expect-error – only fashion has subcategories
      marketplacePath({ category: 'electronics', subcategory: 'men' })
    }
    expectTypeOf(invalidCalls).toBeFunction()
  })
})

describe('isNavTargetActive', () => {
  const at = (pathname: string, search = '') => ({ pathname, search })
  const women = marketplacePath({ category: 'fashion', subcategory: 'women' })

  it('activates "all products" only without category filters', () => {
    expect(isNavTargetActive(PATHS.marketplace, at('/marketplace'))).toBe(true)
    expect(
      isNavTargetActive(PATHS.marketplace, at('/marketplace', '?category=home')),
    ).toBe(false)
  })

  it('matches a category link on its exact filters', () => {
    const search = '?category=fashion&subcategory=women'
    expect(isNavTargetActive(women, at('/marketplace', search))).toBe(true)
    expect(
      isNavTargetActive(women, at('/marketplace', '?category=fashion&subcategory=men')),
    ).toBe(false)
  })

  it('ignores non-filter params such as sorting and search', () => {
    expect(
      isNavTargetActive(PATHS.marketplace, at('/marketplace', '?sortBy=price-asc&q=kurtka')),
    ).toBe(true)
    expect(
      isNavTargetActive(
        marketplacePath({ category: 'home' }),
        at('/marketplace', '?sortBy=newest&category=home'),
      ),
    ).toBe(true)
  })

  it('requires the same path', () => {
    expect(isNavTargetActive(PATHS.home, at('/'))).toBe(true)
    expect(isNavTargetActive(PATHS.home, at('/marketplace'))).toBe(false)
  })
})
