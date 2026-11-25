// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import { describe, expect, it } from 'vitest'
import { useLoadMore } from './useLoadMore'

const items = Array.from({ length: 24 }, (_, index) => `item-${index}`)

function renderLoadMore(entries: string[], list: readonly string[] = items, pageSize = 20) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
      {children}
    </MemoryRouter>
  )
  return renderHook(
    () => ({ ...useLoadMore(list, pageSize), location: useLocation(), navigate: useNavigate() }),
    { wrapper },
  )
}

describe('useLoadMore', () => {
  it('shows the first page without a page parameter', () => {
    const { result } = renderLoadMore(['/marketplace'])

    expect(result.current.visibleItems).toHaveLength(20)
    expect(result.current).toMatchObject({ shownCount: 20, totalCount: 24, hasMore: true })
  })

  it('reads the loaded pages from the URL', () => {
    const { result } = renderLoadMore(['/marketplace?page=2'])

    expect(result.current.shownCount).toBe(24)
    expect(result.current.hasMore).toBe(false)
  })

  it('treats an invalid page parameter as the first page', () => {
    const { result } = renderLoadMore(['/marketplace?page=abc'])

    expect(result.current.shownCount).toBe(20)
  })

  it('loads the next page into the URL and keeps the other parameters', () => {
    const { result } = renderLoadMore(['/marketplace?query=kurtka&category=fashion'])

    act(() => result.current.loadMore())

    expect(result.current.location.search).toBe('?query=kurtka&category=fashion&page=2')
    expect(result.current.shownCount).toBe(24)
  })

  it('replaces an existing page value instead of adding a second one', () => {
    const { result } = renderLoadMore(['/marketplace?page=2'], Array.from({ length: 50 }, String))

    act(() => result.current.loadMore())

    expect(result.current.location.search).toBe('?page=3')
    expect(result.current.shownCount).toBe(50)
  })

  it('adds a history entry, so Back undoes the last "load more"', () => {
    const { result } = renderLoadMore(['/', '/marketplace?category=home'], Array.from({ length: 30 }, String))

    act(() => result.current.loadMore())
    expect(result.current.location.search).toBe('?category=home&page=2')

    act(() => void result.current.navigate(-1))

    expect(result.current.location.search).toBe('?category=home')
    expect(result.current.shownCount).toBe(20)
  })

  it('does nothing when everything is already shown', () => {
    const { result } = renderLoadMore(['/marketplace'], items.slice(0, 5))

    act(() => result.current.loadMore())

    expect(result.current.location.search).toBe('')
  })
})
