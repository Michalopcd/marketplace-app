// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PriceRangeFields, type PriceRange } from './PriceRangeFields'

const RANGE_ERROR = 'Cena minimalna nie może być wyższa od maksymalnej.'
const AMOUNT_ERROR = 'Podaj kwotę 0 zł lub wyższą.'

function renderPrice(minPrice: number | null = null, maxPrice: number | null = null) {
  const onCommit = vi.fn<(range: PriceRange) => void>()
  const view = render(
    <PriceRangeFields minPrice={minPrice} maxPrice={maxPrice} onCommit={onCommit} />,
  )
  return {
    ...view,
    onCommit,
    min: screen.getByRole('textbox', { name: 'Cena minimalna' }),
    max: screen.getByRole('textbox', { name: 'Cena maksymalna' }),
  }
}

const type = (input: HTMLElement, text: string) =>
  fireEvent.change(input, { target: { value: text } })

describe('PriceRangeFields', () => {
  it('shows the committed prices in labelled decimal fields', () => {
    const { min, max } = renderPrice(50, 89.99)

    expect(min).toHaveValue('50')
    expect(max).toHaveValue('89.99')
    expect(min).toHaveAttribute('inputMode', 'decimal')
  })

  it('does not commit while typing', () => {
    const { min, onCommit } = renderPrice()

    type(min, '50')

    expect(onCommit).not.toHaveBeenCalled()
  })

  it('commits when a field loses focus', () => {
    const { min, onCommit } = renderPrice()

    type(min, '50')
    fireEvent.blur(min)

    expect(onCommit).toHaveBeenCalledExactlyOnceWith({ minPrice: 50, maxPrice: null })
  })

  it('commits on Enter and accepts a Polish decimal comma', () => {
    const { max, onCommit } = renderPrice()

    type(max, '89,99')
    fireEvent.keyDown(max, { key: 'Enter' })

    expect(onCommit).toHaveBeenCalledExactlyOnceWith({ minPrice: null, maxPrice: 89.99 })
  })

  it('does not commit an unchanged range (no duplicate history entry)', () => {
    const { min, onCommit } = renderPrice(50, null)

    type(min, ' 50 ')
    fireEvent.blur(min)

    expect(onCommit).not.toHaveBeenCalled()
  })

  it('clears a bound when its field is emptied', () => {
    const { min, onCommit } = renderPrice(50, 100)

    type(min, '')
    fireEvent.blur(min)

    expect(onCommit).toHaveBeenCalledExactlyOnceWith({ minPrice: null, maxPrice: 100 })
  })

  describe('validation', () => {
    it('rejects an inverted range and keeps the typed values', () => {
      const { min, max, onCommit } = renderPrice()

      type(min, '300')
      type(max, '100')
      fireEvent.blur(max)

      const error = screen.getByText(RANGE_ERROR)
      expect(onCommit).not.toHaveBeenCalled()
      expect(min).toHaveValue('300')
      expect(max).toHaveValue('100')
      expect(min).toHaveAttribute('aria-invalid', 'true')
      expect(min).toHaveAttribute('aria-describedby', error.id)
      expect(max).toHaveAttribute('aria-describedby', error.id)
    })

    it('rejects a negative or malformed amount in the field that has it', () => {
      const { min, max, onCommit } = renderPrice()

      type(max, '-5')
      fireEvent.blur(max)

      expect(screen.getByText(AMOUNT_ERROR)).toBeInTheDocument()
      expect(max).toHaveAttribute('aria-invalid', 'true')
      expect(min).not.toHaveAttribute('aria-invalid')
      expect(onCommit).not.toHaveBeenCalled()
    })

    it('shows no error before the user commits', () => {
      const { min } = renderPrice()

      type(min, 'abc')

      expect(screen.queryByText(AMOUNT_ERROR)).not.toBeInTheDocument()
      expect(min).not.toHaveAttribute('aria-invalid')
    })

    it('commits once the range is fixed and hides the error', () => {
      const { min, max, onCommit } = renderPrice()

      type(min, '300')
      type(max, '100')
      fireEvent.blur(max)
      type(max, '400')
      fireEvent.blur(max)

      expect(screen.queryByText(RANGE_ERROR)).not.toBeInTheDocument()
      expect(onCommit).toHaveBeenCalledExactlyOnceWith({ minPrice: 300, maxPrice: 400 })
    })
  })

  it('follows prices changed from outside (Back, reset, links)', () => {
    const { min, max, rerender, onCommit } = renderPrice(50, 100)

    rerender(<PriceRangeFields minPrice={null} maxPrice={200} onCommit={onCommit} />)

    expect(min).toHaveValue('')
    expect(max).toHaveValue('200')
  })
})
