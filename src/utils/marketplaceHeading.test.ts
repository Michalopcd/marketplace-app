import { describe, expect, it } from 'vitest'
import { CATEGORY_ENTRIES } from './categories'
import { getMarketplaceHeading } from './marketplaceHeading'

describe('getMarketplaceHeading', () => {
  it('names the unfiltered marketplace', () => {
    expect(getMarketplaceHeading({ category: null, subcategory: null })).toBe(
      'Wszystkie produkty',
    )
  })

  it.each(CATEGORY_ENTRIES)(
    'matches the navigation label "$label"',
    ({ label, filter }) => {
      expect(
        getMarketplaceHeading({
          category: filter.category,
          subcategory: 'subcategory' in filter ? filter.subcategory : null,
        }),
      ).toBe(label)
    },
  )

  it('names fashion without a subcategory', () => {
    expect(
      getMarketplaceHeading({ category: 'fashion', subcategory: null }),
    ).toBe('Moda')
  })

  it('ignores a subcategory outside fashion', () => {
    expect(
      getMarketplaceHeading({ category: 'home', subcategory: 'men' }),
    ).toBe('Dom')
  })
})
