import { describe, expect, expectTypeOf, it } from 'vitest'
import { marketplacePath } from './paths'

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
