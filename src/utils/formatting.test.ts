import { describe, expect, it } from 'vitest'
import { formatDate, formatPrice } from './formatting'

/** Intl uses non-breaking spaces; normalize them so expectations stay readable. */
const normalizeSpaces = (value: string) => value.replace(/\s/g, ' ')

describe('formatPrice', () => {
  it('formats whole amounts without decimals', () => {
    expect(normalizeSpaces(formatPrice(120))).toBe('120 zł')
  })

  it('formats fractional amounts with two decimals', () => {
    expect(normalizeSpaces(formatPrice(89.99))).toBe('89,99 zł')
    expect(normalizeSpaces(formatPrice(399.5))).toBe('399,50 zł')
  })

  it('groups thousands', () => {
    expect(normalizeSpaces(formatPrice(12450))).toBe('12 450 zł')
  })

  it('throws on invalid price amounts', () => {
    expect(() => formatPrice(NaN)).toThrow(RangeError)
    expect(() => formatPrice(Infinity)).toThrow(RangeError)
    expect(() => formatPrice(-Infinity)).toThrow(RangeError)
  })
})

describe('formatDate', () => {
  it('formats an ISO date in Polish', () => {
    expect(formatDate('2026-11-02T10:00:00.000Z')).toBe('2 listopada 2026')
  })

  it('throws on an invalid date', () => {
    expect(() => formatDate('not-a-date')).toThrow(RangeError)
  })
})
