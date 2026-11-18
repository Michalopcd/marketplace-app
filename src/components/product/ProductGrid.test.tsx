// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { mockListings } from '../../data/mockListings'
import { ProductGrid } from './ProductGrid'

const sample = mockListings.slice(0, 4)

function renderGrid(props: ComponentProps<typeof ProductGrid>) {
  return render(
    <MemoryRouter>
      <ProductGrid {...props} />
    </MemoryRouter>,
  )
}

describe('ProductGrid', () => {
  it('renders one list item per listing', () => {
    renderGrid({ listings: sample })

    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(sample.length)
    expect(
      screen.getByRole('link', { name: sample[0].title }),
    ).toBeInTheDocument()
  })

  it('announces loading in a persistent live region and hides skeletons from AT', () => {
    const { rerender } = renderGrid({
      listings: sample,
      isLoading: true,
    })

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Ładowanie produktów…')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <ProductGrid listings={sample} />
      </MemoryRouter>,
    )

    // Same node stays mounted, now empty.
    expect(screen.getByRole('status')).toBe(status)
    expect(status).toBeEmptyDOMElement()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('shows the error with a retry action instead of the list', () => {
    const onRetry = vi.fn()

    renderGrid({
      listings: sample,
      error: 'Nie udało się pobrać ogłoszeń.',
      onRetry,
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nie udało się pobrać ogłoszeń.',
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Spróbuj ponownie' }),
    )

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows the empty state with custom copy', () => {
    renderGrid({
      listings: [],
      emptyTitle: 'Brak pasujących produktów',
    })

    expect(
      screen.getByRole('heading', {
        name: 'Brak pasujących produktów',
      }),
    ).toBeInTheDocument()
  })

  it('passes favorite state to cards', () => {
    renderGrid({
      listings: sample,
      favoriteIds: new Set([sample[1].id]),
      onToggleFavorite: () => {},
    })

    const pressed = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-pressed') === 'true')

    expect(pressed).toHaveLength(1)

    expect(pressed[0]).toHaveAccessibleName(`Ulubione: ${sample[1].title}`)
  })

  it.each([
    [3, 3],
    [2.7, 2],
    [-1, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
  ])('renders a safe number of skeletons for skeletonCount=%s', (count, expected) => {
    const { container } = renderGrid({
      listings: [],
      isLoading: true,
      skeletonCount: count,
    })

    const skeletonGrid = container.querySelector('div[aria-hidden="true"].grid')
    expect(skeletonGrid?.children).toHaveLength(expected)
  })
})
