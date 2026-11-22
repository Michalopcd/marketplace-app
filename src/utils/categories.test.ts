import { describe, expect, it } from 'vitest'
import { mockListings } from '../data/mockListings'
import type { Listing } from '../types/listing'
import { isShippedImage } from '../test/publicImages'
import { CATEGORY_ENTRIES, matchesCategoryFilter } from './categories'

const listing = (overrides: Partial<Listing>): Listing => ({
  ...mockListings[0],
  ...overrides,
})

describe('CATEGORY_ENTRIES', () => {
  it('lists fashion audiences first, then the other categories', () => {
    expect(CATEGORY_ENTRIES.map((entry) => entry.label)).toEqual([
      'Kobiety',
      'Mężczyźni',
      'Dzieci',
      'Elektronika',
      'Dom',
      'Sport',
      'Inne',
    ])
  })

  it('has unique keys', () => {
    const keys = CATEGORY_ENTRIES.map((entry) => entry.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('gives each category its own cover photo that exists in public/', () => {
    const images = CATEGORY_ENTRIES.map((entry) => entry.image)
    expect(new Set(images).size).toBe(images.length)

    for (const { key, image } of CATEGORY_ENTRIES) {
      expect(image).toBe(`/images/categories/${key}.webp`)
      expect(isShippedImage(image), image).toBe(true)
    }
  })
})

describe('matchesCategoryFilter', () => {
  it('matches fashion only for the same subcategory', () => {
    const kidsJacket = listing({ category: 'fashion', subcategory: 'kids' })

    expect(
      matchesCategoryFilter(kidsJacket, { category: 'fashion', subcategory: 'kids' }),
    ).toBe(true)
    expect(
      matchesCategoryFilter(kidsJacket, { category: 'fashion', subcategory: 'men' }),
    ).toBe(false)
  })

  it('matches other categories by category alone', () => {
    const lamp = listing({ category: 'home', subcategory: undefined })

    expect(matchesCategoryFilter(lamp, { category: 'home' })).toBe(true)
    expect(matchesCategoryFilter(lamp, { category: 'sports' })).toBe(false)
  })
})
