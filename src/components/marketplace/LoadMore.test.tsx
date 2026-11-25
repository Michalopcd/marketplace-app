// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoadMore } from './LoadMore'

function renderLoadMore(shownCount: number, totalCount: number, pageSize = 20) {
  const onLoadMore = vi.fn()
  const view = render(
    <LoadMore
      shownCount={shownCount}
      totalCount={totalCount}
      hasMore={shownCount < totalCount}
      pageSize={pageSize}
      onLoadMore={onLoadMore}
    />,
  )
  return { ...view, onLoadMore }
}

const button = () => screen.queryByRole('button', { name: 'Załaduj więcej' })

describe('LoadMore', () => {
  it('announces how many offers are shown', () => {
    renderLoadMore(20, 24)

    expect(screen.getByRole('status')).toHaveTextContent('Wyświetlono 20 z 24 ofert')
  })

  it('loads more on click', () => {
    const { onLoadMore } = renderLoadMore(20, 24)

    fireEvent.click(button()!)

    expect(onLoadMore).toHaveBeenCalledOnce()
  })

  it('hides the button once everything is shown, but keeps the count', () => {
    renderLoadMore(24, 24)

    expect(button()).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Wyświetlono 24 z 24 ofert')
  })

  it('renders nothing when the results fit on one page', () => {
    const { container } = renderLoadMore(20, 20)

    expect(container).toBeEmptyDOMElement()
  })

  it('shows progress as a decorative bar', () => {
    const { container } = renderLoadMore(20, 40)

    const bar = container.querySelector('[aria-hidden="true"] > span')
    expect(bar).toHaveStyle({ width: '50%' })
  })
})
