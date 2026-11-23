// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { MAX_SEARCH_QUERY_LENGTH } from '../../utils/constants'
import { SearchBar, type SearchBarHandle } from './SearchBar'

function renderSearchBar(value = '') {
  const onSearch = vi.fn<(query: string) => void>()
  const view = render(<SearchBar value={value} onSearch={onSearch} />)
  const input = screen.getByRole('searchbox', { name: 'Szukaj produktów' })
  return { ...view, onSearch, input }
}

const type = (input: HTMLElement, text: string) =>
  fireEvent.change(input, { target: { value: text } })

describe('SearchBar', () => {
  it('is a labelled search landmark with a capped search field', () => {
    const { input } = renderSearchBar()

    expect(
      screen.getByRole('search', { name: 'Wyszukaj produkty' }),
    ).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'search')
    expect(input).toHaveAttribute('maxLength', String(MAX_SEARCH_QUERY_LENGTH))
    expect(screen.getByRole('button', { name: 'Szukaj' })).toHaveAttribute(
      'type',
      'submit',
    )
  })

  it('shows the current query', () => {
    const { input } = renderSearchBar('kurtka')

    expect(input).toHaveValue('kurtka')
  })

  it('does not search while typing', () => {
    const { input, onSearch } = renderSearchBar()

    type(input, 'lampa')

    expect(input).toHaveValue('lampa')
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('searches on submit (Enter or the button)', () => {
    const { input, onSearch } = renderSearchBar()

    type(input, 'lampa')
    fireEvent.click(screen.getByRole('button', { name: 'Szukaj' }))

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('lampa')

    type(input, 'mata')
    fireEvent.submit(screen.getByRole('search'))

    expect(onSearch).toHaveBeenLastCalledWith('mata')
  })

  it('shows the clear button only when there is text', () => {
    const { input } = renderSearchBar()
    const clear = () =>
      screen.queryByRole('button', { name: 'Wyczyść wyszukiwanie' })

    expect(clear()).not.toBeInTheDocument()

    type(input, 'k')

    expect(clear()).toBeInTheDocument()
  })

  it('clears the field, searches for nothing and keeps focus in the field', () => {
    const { input, onSearch } = renderSearchBar('kurtka')

    fireEvent.click(
      screen.getByRole('button', { name: 'Wyczyść wyszukiwanie' }),
    )

    expect(input).toHaveValue('')
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('')
    expect(input).toHaveFocus()
  })

  describe('no-op commits (would add duplicate history entries)', () => {
    it('does not search again for the current query', () => {
      const { onSearch } = renderSearchBar('kurtka')

      fireEvent.submit(screen.getByRole('search'))

      expect(onSearch).not.toHaveBeenCalled()
    })

    it('does not search when the trimmed draft equals the current query', () => {
      const { input, onSearch } = renderSearchBar('kurtka')

      type(input, '  kurtka ')
      fireEvent.submit(screen.getByRole('search'))

      expect(onSearch).not.toHaveBeenCalled()
      expect(input).toHaveValue('kurtka')
    })

    it('clears an uncommitted draft without searching', () => {
      const { input, onSearch } = renderSearchBar()

      type(input, 'lam')
      fireEvent.click(
        screen.getByRole('button', { name: 'Wyczyść wyszukiwanie' }),
      )

      expect(input).toHaveValue('')
      expect(input).toHaveFocus()
      expect(onSearch).not.toHaveBeenCalled()
    })
  })

  it('can be focused by the parent through its ref', () => {
    const ref = createRef<SearchBarHandle>()
    render(<SearchBar ref={ref} value="" onSearch={() => {}} />)

    act(() => ref.current?.focus())

    expect(screen.getByRole('searchbox')).toHaveFocus()
  })

  it('follows a new query from outside (e.g. Back or a category link)', () => {
    const { input, rerender, onSearch } = renderSearchBar('kurtka')

    type(input, 'kurtka zim')
    rerender(<SearchBar value="lampa" onSearch={onSearch} />)

    expect(input).toHaveValue('lampa')
  })

  it('keeps the typed draft while the query from outside stays the same', () => {
    const { input, rerender, onSearch } = renderSearchBar('kurtka')

    type(input, 'kurtka zim')
    rerender(<SearchBar value="kurtka" onSearch={onSearch} />)

    expect(input).toHaveValue('kurtka zim')
  })
})
