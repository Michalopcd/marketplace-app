// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_LISTING_FILTERS } from '../../utils/listingFilters'
import { FiltersSidebar } from './FiltersSidebar'

function renderSidebar(activeFilterCount: number) {
  const onReset = vi.fn()
  const onChange = vi.fn()
  const sidebar = (count: number) => (
    <FiltersSidebar
      filters={{ ...DEFAULT_LISTING_FILTERS, category: 'home' }}
      activeFilterCount={count}
      onChange={onChange}
      onReset={onReset}
    />
  )
  const view = render(sidebar(activeFilterCount))
  return {
    onReset,
    onChange,
    aside: screen.getByRole('complementary', { name: 'Filtry' }),
    rerenderWithCount: (count: number) => view.rerender(sidebar(count)),
  }
}

describe('FiltersSidebar', () => {
  it('is a labelled complementary landmark with the filters', () => {
    const { aside, onChange } = renderSidebar(1)

    expect(within(aside).getByRole('heading', { level: 2, name: 'Filtry' })).toBeInTheDocument()
    expect(within(aside).getByRole('radio', { name: 'Dom' })).toBeChecked()

    fireEvent.click(within(aside).getByRole('radio', { name: 'Sport' }))
    expect(onChange).toHaveBeenCalledExactlyOnceWith({ category: 'sports', subcategory: null })
  })

  it('clears the filters with a count of active filters', () => {
    const { aside, onReset } = renderSidebar(2)

    const clear = within(aside).getByRole('button', { name: 'Wyczyść filtry (2)' })
    fireEvent.click(clear)

    expect(onReset).toHaveBeenCalledOnce()
  })

  it('marks clearing unavailable without active filters, but keeps it focusable', () => {
    const { aside, onReset } = renderSidebar(0)

    const clear = within(aside).getByRole('button', { name: 'Wyczyść filtry' })
    // aria-disabled instead of disabled: a disabled button would drop keyboard focus to <body>.
    expect(clear).toHaveAttribute('aria-disabled', 'true')
    expect(clear).not.toBeDisabled()

    fireEvent.click(clear)
    expect(onReset).not.toHaveBeenCalled()
  })

  it('keeps keyboard focus on the clear button after clearing', () => {
    const { aside, rerenderWithCount } = renderSidebar(2)
    const clear = within(aside).getByRole('button', { name: 'Wyczyść filtry (2)' })

    clear.focus()
    fireEvent.click(clear)
    rerenderWithCount(0)

    expect(clear).toHaveFocus()
    expect(clear).toHaveAttribute('aria-disabled', 'true')
  })

  it('never grows taller than the screen on desktop, so every option stays reachable', () => {
    const { aside } = renderSidebar(1)

    // jsdom has no layout: the contract is checked on the utilities that create it.
    expect(aside).toHaveClass(
      'lg:sticky',
      'lg:top-6',
      'lg:max-h-[calc(100dvh-3rem)]',
      'lg:overflow-y-auto',
      'lg:overscroll-contain',
    )
  })
})
