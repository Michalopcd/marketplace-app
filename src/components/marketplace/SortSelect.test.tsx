// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { SortOption } from '../../types/listing'
import { SortSelect } from './SortSelect'

function renderSort(value: SortOption = 'newest') {
  const onChange = vi.fn<(sortBy: SortOption) => void>()
  render(<SortSelect value={value} onChange={onChange} />)
  return { onChange, select: screen.getByRole('combobox', { name: 'Sortuj' }) }
}

describe('SortSelect', () => {
  it('is a labelled select with the three sort options', () => {
    const { select } = renderSort()

    expect(within(select).getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Najnowsze',
      'Cena: od najniższej',
      'Cena: od najwyższej',
    ])
  })

  it('shows the current sort order', () => {
    const { select } = renderSort('price-desc')

    expect(select).toHaveValue('price-desc')
  })

  it('reports the chosen sort order', () => {
    const { select, onChange } = renderSort()

    fireEvent.change(select, { target: { value: 'price-asc' } })

    expect(onChange).toHaveBeenCalledExactlyOnceWith('price-asc')
  })
})
