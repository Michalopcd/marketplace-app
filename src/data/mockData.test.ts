import { describe, expect, it } from 'vitest'
import {
  CATEGORIES,
  CONDITIONS,
  FASHION_SUBCATEGORIES,
} from '../utils/constants'
import { mockListings } from './mockListings'
import { mockUsers } from './mockUsers'

const isIsoDate = (value: string) =>
  !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value

describe('mockUsers', () => {
  it('contains 5 users with unique ids and emails', () => {
    expect(mockUsers).toHaveLength(5)
    expect(new Set(mockUsers.map((user) => user.id)).size).toBe(5)
    expect(new Set(mockUsers.map((user) => user.email)).size).toBe(5)
  })

  it('has valid ISO creation dates', () => {
    for (const user of mockUsers) {
      expect(isIsoDate(user.createdAt)).toBe(true)
    }
  })
})

describe('mockListings', () => {
  const userIds = new Set(mockUsers.map((user) => user.id))

  it('contains at least 20 listings with unique ids', () => {
    expect(mockListings.length).toBeGreaterThanOrEqual(20)
    expect(new Set(mockListings.map((listing) => listing.id)).size).toBe(
      mockListings.length,
    )
  })

  it('references existing sellers only', () => {
    for (const listing of mockListings) {
      expect(userIds.has(listing.userId)).toBe(true)
    }
  })

  it('uses only known categories and conditions', () => {
    for (const listing of mockListings) {
      expect(CATEGORIES).toContain(listing.category)
      expect(CONDITIONS).toContain(listing.condition)
    }
  })

  it('covers every category', () => {
    const used = new Set(mockListings.map((listing) => listing.category))
    expect([...used].sort()).toEqual([...CATEGORIES].sort())
  })

  it('has positive prices, non-empty titles and at least one image', () => {
    for (const listing of mockListings) {
      expect(listing.price).toBeGreaterThan(0)
      expect(listing.title.trim()).not.toBe('')
      expect(listing.images.length).toBeGreaterThan(0)
    }
  })

  it('assigns a subcategory to every fashion listing and to no other category', () => {
    for (const listing of mockListings) {
      if (listing.category === 'fashion') {
        expect(FASHION_SUBCATEGORIES).toContain(listing.subcategory)
      } else {
        expect(listing.subcategory).toBeUndefined()
      }
    }
  })

  it('covers every fashion subcategory (women, men, kids)', () => {
    const used = new Set(
      mockListings
        .filter((listing) => listing.category === 'fashion')
        .map((listing) => listing.subcategory),
    )
    expect([...used].sort()).toEqual([...FASHION_SUBCATEGORIES].sort())
  })

  it('uses valid, unique placeholder image URLs', () => {
    const allImages = mockListings.flatMap((listing) => listing.images)
    expect(new Set(allImages).size).toBe(allImages.length)

    for (const listing of mockListings) {
      listing.images.forEach((src, index) => {
        const url = new URL(src)
        expect(url.protocol).toBe('https:')
        expect(url.hostname).toBe('picsum.photos')
        expect(url.pathname).toBe(`/seed/now-${listing.id}-${index}/800/1000`)
      })
    }
  })

  it('has valid ISO dates with updatedAt not before createdAt', () => {
    for (const listing of mockListings) {
      expect(isIsoDate(listing.createdAt)).toBe(true)
      expect(isIsoDate(listing.updatedAt)).toBe(true)
      expect(Date.parse(listing.updatedAt)).toBeGreaterThanOrEqual(
        Date.parse(listing.createdAt),
      )
    }
  })

  it('includes both available and sold listings', () => {
    expect(mockListings.some((listing) => listing.isSold)).toBe(true)
    expect(mockListings.some((listing) => !listing.isSold)).toBe(true)
  })
})
