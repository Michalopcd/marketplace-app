// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { mockListings } from '../../data/mockListings'
import type { Listing } from '../../types/listing'
import { ProductCard } from './ProductCard'

function findFixture(predicate: (listing: Listing) => boolean): Listing {
  const listing = mockListings.find(predicate)
  if (!listing) throw new Error('Missing ProductCard fixture in mockListings')
  return listing
}

const fashion = findFixture(
  (listing) =>
    listing.category === 'fashion' && listing.subcategory === 'women',
)
const electronics = findFixture(
  (listing) => listing.category === 'electronics' && !listing.size,
)

function renderCard(
  props: Partial<Parameters<typeof ProductCard>[0]> & { listing: Listing },
) {
  return render(
    <MemoryRouter>
      <ProductCard {...props} />
    </MemoryRouter>,
  )
}

/** Intl uses non-breaking spaces in prices. */
const normalize = (text: string | null) => text?.replace(/\s/g, ' ')

describe('ProductCard', () => {
  it('links the title to the product details page', () => {
    renderCard({ listing: fashion })

    const link = screen.getByRole('link', { name: fashion.title })
    expect(link).toHaveAttribute('href', `/product/${fashion.id}`)
    expect(
      screen.getByRole('heading', { level: 3, name: fashion.title }),
    ).toBeInTheDocument()
  })

  it('shows the first image as decorative (title is announced once, via the link)', () => {
    const { container } = renderCard({ listing: fashion })

    const image = container.querySelector('img')
    expect(image).toHaveAttribute('src', fashion.images[0])
    expect(image).toHaveAttribute('alt', '')
  })

  it('shows category with fashion subcategory, size, condition and PLN price', () => {
    renderCard({ listing: fashion })

    expect(screen.getByText('Moda · Kobiety')).toBeInTheDocument()
    const article = screen.getByRole('article')
    expect(normalize(article.textContent)).toContain(
      `Rozmiar: ${fashion.size}`,
    )
    expect(normalize(article.textContent)).toMatch(/Cena: [\d ]+(,\d{2})? zł/)
  })

  it('omits subcategory and size when the listing has none', () => {
    renderCard({ listing: electronics })

    expect(screen.getByText('Elektronika')).toBeInTheDocument()
    expect(screen.queryByText(/Rozmiar:/)).not.toBeInTheDocument()
  })

  it('marks sold listings', () => {
    renderCard({ listing: { ...fashion, isSold: true } })

    expect(screen.getByText('Sprzedane')).toBeInTheDocument()
  })

  it('hides the favorite button without a handler', () => {
    renderCard({ listing: fashion })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('reports favorite toggles with the listing id and exposes pressed state', () => {
    const onToggleFavorite = vi.fn()

    renderCard({
      listing: fashion,
      isFavorite: true,
      onToggleFavorite,
    })

    const button = screen.getByRole('button', {
      name: `Ulubione: ${fashion.title}`,
    })

    expect(button).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(button)

    expect(onToggleFavorite).toHaveBeenCalledTimes(1)
    expect(onToggleFavorite).toHaveBeenCalledWith(fashion.id)
  })

  it('keeps the same accessible name in both states (state comes from aria-pressed)', () => {
    const { rerender } = renderCard({
      listing: fashion,
      isFavorite: false,
      onToggleFavorite: () => {},
    })
    const name = `Ulubione: ${fashion.title}`

    expect(screen.getByRole('button', { name })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    rerender(
      <MemoryRouter>
        <ProductCard listing={fashion} isFavorite onToggleFavorite={() => {}} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
