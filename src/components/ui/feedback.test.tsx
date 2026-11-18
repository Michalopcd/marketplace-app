// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Badge } from './Badge'
import { Container } from './Container'
import { EmptyState } from './EmptyState'
import { ErrorMessage } from './ErrorMessage'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('exposes a status with an accessible label', () => {
    render(<LoadingSpinner label="Pobieranie ogłoszeń" />)

    expect(screen.getByRole('status')).toHaveTextContent('Pobieranie ogłoszeń')
  })
})

describe('Badge', () => {
  it('renders its content', () => {
    render(<Badge>Nowość</Badge>)

    expect(screen.getByText('Nowość')).toHaveClass('bg-forest')
  })
})

describe('Container', () => {
  it('renders the requested element', () => {
    render(<Container as="section">Treść</Container>)

    expect(screen.getByText('Treść').tagName).toBe('SECTION')
  })
})

describe('EmptyState', () => {
  it('renders title, description and action', () => {
    render(
      <EmptyState
        title="Brak ulubionych"
        description="Zapisuj rzeczy, które wpadły Ci w oko."
        action={<button type="button">Przeglądaj</button>}
      />,
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Brak ulubionych' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Zapisuj rzeczy, które wpadły Ci w oko.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Przeglądaj' })).toBeInTheDocument()
  })

  it('supports a custom heading level', () => {
    render(<EmptyState title="Pusto" headingLevel="h3" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Pusto' })).toBeInTheDocument()
  })
})

describe('ErrorMessage', () => {
  it('announces the error and calls onRetry', () => {
    const onRetry = vi.fn()
    render(<ErrorMessage message="Nie udało się pobrać ogłoszeń." onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nie udało się pobrać ogłoszeń.',
    )
    expect(
      screen.getByRole('heading', { level: 2, name: 'Coś poszło nie tak' }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('hides the retry button without a handler', () => {
    render(<ErrorMessage message="Błąd" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
