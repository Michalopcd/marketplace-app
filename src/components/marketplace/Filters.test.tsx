// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ListingFilters } from '../../types/listing'
import { DEFAULT_LISTING_FILTERS } from '../../utils/listingFilters'
import { Filters } from './Filters'

function renderFilters(patch: Partial<ListingFilters> = {}) {
  const onChange = vi.fn<(patch: Partial<ListingFilters>) => void>()
  const filters = { ...DEFAULT_LISTING_FILTERS, ...patch }
  const view = render(<Filters filters={filters} onChange={onChange} />)
  return { ...view, onChange }
}

const group = (name: string) => screen.getByRole('group', { name })
const radio = (groupName: string, name: string) =>
  within(group(groupName)).getByRole('radio', { name })

describe('Filters', () => {
  it('groups the controls in labelled fieldsets', () => {
    renderFilters()

    expect(group('Kategoria')).toBeInTheDocument()
    expect(group('Cena (zł)')).toBeInTheDocument()
    expect(group('Stan')).toBeInTheDocument()
  })

  describe('category', () => {
    it('offers "Wszystkie" and every category, checked from the filters', () => {
      renderFilters({ category: 'home' })

      const names = within(group('Kategoria'))
        .getAllByRole('radio')
        .map((r) => r.getAttribute('aria-label') ?? r.closest('label')?.textContent)
      expect(names).toEqual(['Wszystkie', 'Moda', 'Elektronika', 'Dom', 'Sport', 'Inne'])
      expect(radio('Kategoria', 'Dom')).toBeChecked()
    })

    it('checks "Wszystkie" without a category', () => {
      renderFilters()

      expect(radio('Kategoria', 'Wszystkie')).toBeChecked()
    })

    it('selects a category and clears the subcategory', () => {
      const { onChange } = renderFilters({ category: 'fashion', subcategory: 'men' })

      fireEvent.click(radio('Kategoria', 'Elektronika'))

      expect(onChange).toHaveBeenCalledExactlyOnceWith({
        category: 'electronics',
        subcategory: null,
      })
    })

    it('clears the category with "Wszystkie"', () => {
      const { onChange } = renderFilters({ category: 'sports' })

      fireEvent.click(radio('Kategoria', 'Wszystkie'))

      expect(onChange).toHaveBeenCalledExactlyOnceWith({ category: null, subcategory: null })
    })
  })

  describe('fashion subcategory', () => {
    it('is hidden unless fashion is selected', () => {
      renderFilters({ category: 'home' })

      expect(screen.queryByRole('group', { name: 'Podkategoria Mody' })).not.toBeInTheDocument()
    })

    it('shows "Cała moda" and the subcategories for fashion', () => {
      renderFilters({ category: 'fashion', subcategory: 'women' })

      const sub = group('Podkategoria Mody')
      expect(within(sub).getAllByRole('radio')).toHaveLength(4)
      expect(radio('Podkategoria Mody', 'Kobiety')).toBeChecked()
    })

    it('checks "Cała moda" for fashion without a subcategory', () => {
      renderFilters({ category: 'fashion' })

      expect(radio('Podkategoria Mody', 'Cała moda')).toBeChecked()
    })

    it('selects a subcategory and goes back to all of fashion', () => {
      const { onChange, rerender } = renderFilters({ category: 'fashion' })

      fireEvent.click(radio('Podkategoria Mody', 'Dzieci'))
      expect(onChange).toHaveBeenLastCalledWith({ subcategory: 'kids' })

      rerender(
        <Filters
          filters={{ ...DEFAULT_LISTING_FILTERS, category: 'fashion', subcategory: 'kids' }}
          onChange={onChange}
        />,
      )
      fireEvent.click(radio('Podkategoria Mody', 'Cała moda'))
      expect(onChange).toHaveBeenLastCalledWith({ subcategory: null })
    })
  })

  describe('condition', () => {
    it('offers "Dowolny" and every condition', () => {
      renderFilters({ condition: 'good' })

      expect(within(group('Stan')).getAllByRole('radio')).toHaveLength(5)
      expect(radio('Stan', 'Dobry')).toBeChecked()
    })

    it('selects and clears the condition', () => {
      const { onChange } = renderFilters({ condition: 'good' })

      fireEvent.click(radio('Stan', 'Nowy'))
      expect(onChange).toHaveBeenLastCalledWith({ condition: 'new' })

      fireEvent.click(radio('Stan', 'Dowolny'))
      expect(onChange).toHaveBeenLastCalledWith({ condition: null })
    })
  })

  it('commits a valid price range', () => {
    const { onChange } = renderFilters()

    const min = within(group('Cena (zł)')).getByRole('textbox', { name: 'Cena minimalna' })
    fireEvent.change(min, { target: { value: '20' } })
    fireEvent.blur(min)

    expect(onChange).toHaveBeenCalledExactlyOnceWith({ minPrice: 20, maxPrice: null })
  })
})
