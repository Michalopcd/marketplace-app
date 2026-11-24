import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { CloseIcon, FilterIcon } from '../icons/icons'
import { Button } from '../ui/Button'
import {
  FILTERS,
  formatActiveFilters,
  LG_QUERY,
  showResultsLabel,
} from './marketplaceContent'

interface FiltersDrawerProps {
  activeFilterCount: number
  /** Results for the current filters, or `null` while unknown (loading / error). */
  resultCount: number | null
  onReset: () => void
  /** The filters form – rendered only while the panel is open. */
  children: ReactNode
}

/**
 * Filters for phones and tablets (< lg): a trigger with the active-filter count and
 * a modal <dialog> sliding in from the right. `showModal()` gives the focus trap
 * (rest of the page inert), Esc to close and focus return to the trigger.
 */
export function FiltersDrawer({
  activeFilterCount,
  resultCount,
  onReset,
  children,
}: FiltersDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const dialogId = useId()
  const headingId = useId()

  const open = () => {
    dialogRef.current?.showModal()
    setIsOpen(true)
  }

  const close = () => dialogRef.current?.close()

  // From lg the sidebar takes over; a hidden modal would leave the page inert.
  useEffect(() => {
    if (!isOpen) return
    const query = window.matchMedia(LG_QUERY)
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) close()
    }
    query.addEventListener('change', closeOnDesktop)
    return () => query.removeEventListener('change', closeOnDesktop)
  }, [isOpen])

  // The dialog box fills the panel, so a click on the dialog itself hits the backdrop.
  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close()
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        className="bg-white lg:hidden"
      >
        <FilterIcon />
        {FILTERS.heading}
        {activeFilterCount > 0 && (
          <>
            <span className="sr-only">, {formatActiveFilters(activeFilterCount)}</span>
            <span
              aria-hidden="true"
              className="grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1.5 text-[11px] text-white"
            >
              {activeFilterCount}
            </span>
          </>
        )}
      </Button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-labelledby={headingId}
        onClose={() => setIsOpen(false)}
        onClick={closeOnBackdrop}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(90vw,400px)] max-w-none translate-x-full bg-white p-0 text-ink transition-[translate,overlay,display] transition-discrete duration-300 backdrop:bg-ink/35 backdrop:backdrop-blur-[2px] open:translate-x-0 starting:open:translate-x-full lg:hidden"
      >
        {isOpen && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line py-3.5 pr-4 pl-6">
              <h2 id={headingId} className="font-display text-[26px]">
                {FILTERS.heading}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={FILTERS.close}
                className="grid size-11 place-items-center rounded-lg transition-colors hover:bg-mint hover:text-forest"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-3">{children}</div>

            <div className="flex gap-2.5 border-t border-line px-6 pt-3.5 pb-[max(18px,env(safe-area-inset-bottom))]">
              {/* aria-disabled (not disabled): keeps focus on the button after clearing. */}
              <Button
                variant="secondary"
                onClick={activeFilterCount > 0 ? onReset : undefined}
                aria-disabled={activeFilterCount === 0}
                className="aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:bg-transparent"
              >
                {FILTERS.clear}
              </Button>
              <Button onClick={close} className="flex-1">
                {showResultsLabel(resultCount)}
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
