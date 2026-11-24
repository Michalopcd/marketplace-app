import { useId, useState, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'
import { getPriceRangeError } from '../../utils/listingFilters'
import { formatPriceInput, parsePriceInput } from '../../utils/priceInput'
import { AlertIcon } from '../icons/icons'
import { FILTERS } from './marketplaceContent'

export interface PriceRange {
  minPrice: number | null
  maxPrice: number | null
}

interface PriceRangeFieldsProps extends PriceRange {
  /** Called with a valid, changed range on blur or Enter – never while typing. */
  onCommit: (range: PriceRange) => void
}

interface FieldError {
  message: string
  minInvalid: boolean
  maxInvalid: boolean
}

function validate(min: ReturnType<typeof parsePriceInput>, max: ReturnType<typeof parsePriceInput>): FieldError | null {
  if (min === 'invalid' || max === 'invalid') {
    return {
      message: FILTERS.invalidAmount,
      minInvalid: min === 'invalid',
      maxInvalid: max === 'invalid',
    }
  }
  return getPriceRangeError(min, max)
    ? { message: FILTERS.invertedRange, minInvalid: true, maxInvalid: false }
    : null
}

const fieldClassName =
  'flex min-h-11 min-w-0 items-center rounded-lg border bg-white pr-3 transition-colors focus-within:border-forest focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus'

/**
 * "Od – Do" price fields with local drafts. A valid range is committed on blur or
 * Enter; an invalid one shows an error and keeps what the user typed (Issue #10).
 */
export function PriceRangeFields({ minPrice, maxPrice, onCommit }: PriceRangeFieldsProps) {
  const minId = useId()
  const maxId = useId()
  const errorId = useId()

  const [minDraft, setMinDraft] = useState(() => formatPriceInput(minPrice))
  const [maxDraft, setMaxDraft] = useState(() => formatPriceInput(maxPrice))
  const [showError, setShowError] = useState(false)
  const [synced, setSynced] = useState<PriceRange>({ minPrice, maxPrice })

  // Prices changed from outside (Back, reset, links) replace the drafts.
  // Adjusting state during render (React docs pattern), as in SearchBar.
  if (synced.minPrice !== minPrice || synced.maxPrice !== maxPrice) {
    setSynced({ minPrice, maxPrice })
    setMinDraft(formatPriceInput(minPrice))
    setMaxDraft(formatPriceInput(maxPrice))
    setShowError(false)
  }

  const min = parsePriceInput(minDraft)
  const max = parsePriceInput(maxDraft)
  const error = validate(min, max)
  const visibleError = showError ? error : null

  const commit = () => {
    if (error || min === 'invalid' || max === 'invalid') {
      setShowError(true)
      return
    }
    setShowError(false)
    if (min !== minPrice || max !== maxPrice) onCommit({ minPrice: min, maxPrice: max })
  }

  const commitOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit()
  }

  const field = (
    id: string,
    label: string,
    placeholder: string,
    value: string,
    setValue: (value: string) => void,
    invalid: boolean,
  ) => (
    <div className={cn(fieldClassName, invalid ? 'border-danger' : 'border-field')}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        size={1}
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        onKeyDown={commitOnEnter}
        aria-invalid={invalid || undefined}
        aria-describedby={visibleError ? errorId : undefined}
        className="h-[42px] w-full min-w-0 flex-1 bg-transparent pl-3 text-sm placeholder:text-muted focus-visible:outline-none"
      />
      <span aria-hidden="true" className="shrink-0 pl-1.5 text-xs text-muted">
        zł
      </span>
    </div>
  )

  return (
    <div className="pt-2">
      {/* Two equal columns that always fit the panel (mockup fix: fields never overflow). */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        {field(minId, FILTERS.priceMin, FILTERS.priceMinPlaceholder, minDraft, setMinDraft, visibleError?.minInvalid ?? false)}
        <span aria-hidden="true" className="text-muted">
          -
        </span>
        {field(maxId, FILTERS.priceMax, FILTERS.priceMaxPlaceholder, maxDraft, setMaxDraft, visibleError?.maxInvalid ?? false)}
      </div>

      <div aria-live="polite">
        {visibleError && (
          <p id={errorId} className="mt-2.5 flex items-start gap-1.5 text-xs leading-[1.45] text-danger">
            <AlertIcon className="mt-px shrink-0" />
            {visibleError.message}
          </p>
        )}
      </div>
    </div>
  )
}
