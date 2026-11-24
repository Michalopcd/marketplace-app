// @vitest-environment jsdom
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FiltersDrawer } from './FiltersDrawer'
import { LG_QUERY } from './marketplaceContent'

function renderDrawer({ activeFilterCount = 2, resultCount = 7 as number | null } = {}) {
  const onReset = vi.fn()
  render(
    <FiltersDrawer activeFilterCount={activeFilterCount} resultCount={resultCount} onReset={onReset}>
      <p>Treść filtrów</p>
    </FiltersDrawer>,
  )
  return { onReset }
}

const trigger = () => screen.getByRole('button', { name: /^Filtry/ })
const dialog = () => screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement

function open() {
  fireEvent.click(trigger())
  return screen.getByRole('dialog', { name: 'Filtry' }) as HTMLDialogElement
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('FiltersDrawer', () => {
  describe('trigger', () => {
    it('announces the number of active filters', () => {
      renderDrawer({ activeFilterCount: 2 })

      expect(trigger()).toHaveAccessibleName('Filtry, 2 aktywne')
      expect(trigger()).toHaveTextContent('2')
    })

    it('uses the Polish plural forms', () => {
      renderDrawer({ activeFilterCount: 1 })

      expect(trigger()).toHaveAccessibleName('Filtry, 1 aktywny')
    })

    it('has no count without active filters', () => {
      renderDrawer({ activeFilterCount: 0 })

      expect(trigger()).toHaveAccessibleName('Filtry')
    })

    it('is linked to a closed dialog that renders no filters yet', () => {
      renderDrawer()

      expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog')
      expect(trigger()).toHaveAttribute('aria-expanded', 'false')
      expect(trigger()).toHaveAttribute('aria-controls', dialog().id)
      expect(dialog()).not.toHaveAttribute('open')
      expect(screen.queryByText('Treść filtrów')).not.toBeInTheDocument()
    })
  })

  it('opens as a modal panel with a heading and the filters', () => {
    renderDrawer()

    const panel = open()

    expect(panel).toHaveAttribute('open')
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(within(panel).getByRole('heading', { name: 'Filtry' })).toBeInTheDocument()
    expect(within(panel).getByText('Treść filtrów')).toBeInTheDocument()
  })

  describe('closing', () => {
    it('closes with the close button', () => {
      renderDrawer()
      const panel = open()

      fireEvent.click(within(panel).getByRole('button', { name: 'Zamknij filtry' }))

      expect(panel).not.toHaveAttribute('open')
      expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    })

    it('closes with "Pokaż N ofert"', () => {
      renderDrawer({ resultCount: 7 })
      const panel = open()

      fireEvent.click(within(panel).getByRole('button', { name: 'Pokaż 7 ofert' }))

      expect(panel).not.toHaveAttribute('open')
    })

    it('names the show-results button without a count while results are unknown', () => {
      renderDrawer({ resultCount: null })
      const panel = open()

      expect(within(panel).getByRole('button', { name: 'Pokaż wyniki' })).toBeInTheDocument()
    })

    it('closes on a backdrop click but not on a click inside the panel', () => {
      renderDrawer()
      const panel = open()

      fireEvent.click(within(panel).getByText('Treść filtrów'))
      expect(panel).toHaveAttribute('open')

      fireEvent.click(panel)
      expect(panel).not.toHaveAttribute('open')
    })

    it('syncs its state when the dialog closes itself (Esc)', () => {
      renderDrawer()
      const panel = open()

      act(() => panel.close())

      expect(trigger()).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByText('Treść filtrów')).not.toBeInTheDocument()
    })

    it('closes when the viewport widens to the sidebar layout', () => {
      const list = Object.assign(new EventTarget(), {
        matches: false,
        media: LG_QUERY,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
      }) as MediaQueryList
      vi.spyOn(window, 'matchMedia').mockReturnValue(list)
      renderDrawer()
      const panel = open()

      act(() => {
        list.dispatchEvent(Object.assign(new Event('change'), { matches: true }))
      })

      expect(window.matchMedia).toHaveBeenCalledWith(LG_QUERY)
      expect(panel).not.toHaveAttribute('open')
    })
  })

  describe('clear', () => {
    it('clears the filters and keeps the panel open', () => {
      const { onReset } = renderDrawer({ activeFilterCount: 2 })
      const panel = open()

      fireEvent.click(within(panel).getByRole('button', { name: 'Wyczyść' }))

      expect(onReset).toHaveBeenCalledOnce()
      expect(panel).toHaveAttribute('open')
    })

    it('is marked unavailable without active filters, but stays focusable', () => {
      const { onReset } = renderDrawer({ activeFilterCount: 0 })
      const panel = open()

      const clear = within(panel).getByRole('button', { name: 'Wyczyść' })
      expect(clear).toHaveAttribute('aria-disabled', 'true')
      expect(clear).not.toBeDisabled()

      fireEvent.click(clear)
      expect(onReset).not.toHaveBeenCalled()
    })
  })
})
