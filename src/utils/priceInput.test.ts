import { describe, expect, it } from 'vitest'
import { SORT_LABELS, SORT_OPTIONS } from './constants'
import { formatPriceInput, parsePriceInput } from './priceInput'

describe('parsePriceInput', () => {
  it.each(['', '   '])('treats %j as no constraint', (raw) => {
    expect(parsePriceInput(raw)).toBeNull()
  })

  it.each([
    ['0', 0],
    ['50', 50],
    ['89.99', 89.99],
    ['89,99', 89.99],
    [' 120 ', 120],
  ])('reads %j as %d', (raw, expected) => {
    expect(parsePriceInput(raw)).toBe(expected)
  })

  it.each(['-5', 'abc', '1e3', '12,5,0', '0x10', '1 000', '9'.repeat(400)])(
    'rejects %j',
    (raw) => {
      expect(parsePriceInput(raw)).toBe('invalid')
    },
  )
})

describe('formatPriceInput', () => {
  it('shows an empty field for no constraint and the plain number otherwise', () => {
    expect(formatPriceInput(null)).toBe('')
    expect(formatPriceInput(0)).toBe('0')
    expect(formatPriceInput(89.99)).toBe('89.99')
  })

  it('round-trips through parsePriceInput', () => {
    expect(parsePriceInput(formatPriceInput(399.5))).toBe(399.5)
  })
})

describe('SORT_LABELS', () => {
  it('names every sort option in Polish', () => {
    expect(SORT_OPTIONS.map((option) => SORT_LABELS[option])).toEqual([
      'Najnowsze',
      'Cena: od najniższej',
      'Cena: od najwyższej',
    ])
  })
})
