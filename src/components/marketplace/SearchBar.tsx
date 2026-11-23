import {
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
  type Ref,
} from 'react'
import { MAX_SEARCH_QUERY_LENGTH } from '../../utils/constants'
import { CloseIcon, SearchIcon } from '../icons/icons'
import { Button } from '../ui/Button'

interface SearchBarProps {
  /** Committed query (from the URL). */
  value: string
  /**
   * Called when the committed query changes (submit or clear) – never while
   * typing and never for a no-op, which would push a duplicate history entry.
   */
  onSearch: (query: string) => void
  ref?: Ref<SearchBarHandle>
}

export interface SearchBarHandle {
  /** Moves focus to the search field (e.g. after the control that had it unmounts). */
  focus: () => void
}

/**
 * Product search by name. Typing edits a local draft; the query is committed on
 * submit (Enter / button) or clear, so the URL changes once per search.
 */
export function SearchBar({ value, onSearch, ref }: SearchBarProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(
    ref,
    () => ({ focus: () => inputRef.current?.focus() }),
    [],
  )
  const [draft, setDraft] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  // A new committed query (Back/Forward, category link, reset) replaces the draft.
  // Adjusting state during render (React docs pattern) avoids an effect and keeps focus.
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // The URL stores the trimmed query (Issue #10), so compare like with like.
    if (draft.trim() === value) {
      setDraft(value)
      return
    }
    onSearch(draft)
  }

  const handleClear = () => {
    setDraft('')
    if (value !== '') onSearch('')
    inputRef.current?.focus()
  }

  return (
    <form
      role="search"
      aria-label="Wyszukaj produkty"
      onSubmit={handleSubmit}
      className="mt-[18px] flex max-w-[640px] gap-2 md:mt-[26px] md:gap-2.5"
    >
      <div className="flex min-h-12 min-w-0 flex-1 items-center rounded-lg border border-field bg-white transition-colors focus-within:border-forest focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus">
        <SearchIcon className="ml-3.5 shrink-0 text-muted" />
        <label htmlFor={inputId} className="sr-only">
          Szukaj produktów
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Czego szukasz? Np. kurtka, lampa…"
          maxLength={MAX_SEARCH_QUERY_LENGTH}
          autoComplete="off"
          enterKeyHint="search"
          // The wrapper shows the focus ring; the native clear button is replaced by ours.
          className="h-[46px] min-w-0 flex-1 bg-transparent px-2.5 text-sm placeholder:text-muted focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {draft !== '' && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Wyczyść wyszukiwanie"
            className="grid size-11 shrink-0 place-items-center rounded-md text-muted transition-colors hover:text-ink"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      {/* Icon-only square on phones; max-md variants sort after the base size classes. */}
      <Button type="submit" className="max-md:w-12 max-md:px-0">
        <SearchIcon />
        <span className="max-md:sr-only">Szukaj</span>
      </Button>
    </form>
  )
}
