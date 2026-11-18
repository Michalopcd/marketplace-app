import { describe, expect, it } from 'vitest'
import { mockListings } from '../data/mockListings'
import { getListings } from './listingsService'

describe('getListings', () => {
  it('resolves with all mock listings', async () => {
    const listings = await getListings(0)
    expect(listings).toEqual(mockListings)
  })

  it('returns a copy so callers cannot mutate the mock source', async () => {
    const listings = await getListings(0)
    listings[0].title = 'Changed'
    listings.pop()

    expect(mockListings[0].title).not.toBe('Changed')
    expect(await getListings(0)).toHaveLength(mockListings.length)
  })

  it('returns a deep copy of mock listings', async () => {
    const listings = await getListings(0)

    const originalImage = mockListings[0].images[0]
    listings[0].images[0] = 'changed.jpg'

    expect(mockListings[0].images[0]).toBe(originalImage)
  })
})