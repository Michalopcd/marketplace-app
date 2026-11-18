// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { ButtonLink } from './ButtonLink'

describe('Button', () => {
  it('renders a type="button" by default and handles clicks', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Zapisz</Button>)

    const button = screen.getByRole('button', { name: 'Zapisz' })
    expect(button).toHaveAttribute('type', 'button')

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes', () => {
    render(<Button variant="secondary">Anuluj</Button>)

    expect(screen.getByRole('button', { name: 'Anuluj' })).toHaveClass(
      'bg-transparent',
      'text-forest',
    )
  })

  it('does not fire clicks when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Wyślij
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Wyślij' })
    fireEvent.click(button)

    expect(button).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('is disabled and busy while loading, keeping its label', () => {
    render(<Button isLoading>Dodaj ogłoszenie</Button>)

    const button = screen.getByRole('button', { name: 'Dodaj ogłoszenie' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    // The spinner is decorative: no nested live region inside the button.
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('ButtonLink', () => {
  it('renders a router link styled as a button', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/marketplace">Przeglądaj</ButtonLink>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'Przeglądaj' })
    expect(link).toHaveAttribute('href', '/marketplace')
    expect(link).toHaveClass('bg-forest')
  })

it('does not fire clicks while loading', () => {
  const onClick = vi.fn()

  render(
    <Button isLoading onClick={onClick}>
      Zapisz
    </Button>,
  )

  const button = screen.getByRole('button', {
    name: 'Zapisz',
  })

  fireEvent.click(button)

  expect(button).toBeDisabled()
  expect(onClick).not.toHaveBeenCalled()
})

})
