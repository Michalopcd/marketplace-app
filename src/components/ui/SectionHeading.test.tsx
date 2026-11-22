// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { Eyebrow } from './Eyebrow'
import { SectionHeading } from './SectionHeading'

describe('SectionHeading', () => {
  it('renders the eyebrow and an h2 with the given id', () => {
    render(
      <MemoryRouter>
        <SectionHeading id="x-heading" eyebrow="Znajdź swój styl" title="Kategorie" />
      </MemoryRouter>,
    )

    const heading = screen.getByRole('heading', { level: 2, name: 'Kategorie' })
    expect(heading).toHaveAttribute('id', 'x-heading')
    expect(screen.getByText('Znajdź swój styl')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders the action as a visible text link', () => {
    render(
      <MemoryRouter>
        <SectionHeading
          id="y-heading"
          eyebrow="Wybrane dla Ciebie"
          title="Świeżo dodane"
          action={{ label: 'Zobacz więcej', to: '/marketplace' }}
        />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'Zobacz więcej' })
    expect(link).toHaveAttribute('href', '/marketplace')
    expect(link).toHaveTextContent('Zobacz więcej')
  })
})

describe('Eyebrow', () => {
  it('uses the light tone on dark backgrounds', () => {
    render(<Eyebrow tone="light">Mały gest</Eyebrow>)

    expect(screen.getByText('Mały gest')).toHaveClass('text-white/70')
  })
})
