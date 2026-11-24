import { useId } from 'react'
import type { SortOption } from '../../types/listing'
import { SORT_LABELS, SORT_OPTIONS } from '../../utils/constants'
import { isOneOf } from '../../utils/listingFiltersParams'
import { ChevronDownIcon } from '../icons/icons'

interface SortSelectProps {
  value: SortOption
  onChange: (sortBy: SortOption) => void
}

/** Native select (keyboard and screen-reader support for free), styled like the search field. */
export function SortSelect({ value, onChange }: SortSelectProps) {
  const id = useId()

  return (
    <div className="flex items-center gap-2.5">
      {/* Phones show the select alone; the label stays for screen readers. */}
      <label htmlFor={id} className="text-[13px] text-muted max-sm:sr-only">
        Sortuj
      </label>
      <div className="relative flex items-center">
        <select
          id={id}
          value={value}
          onChange={(event) => {
            const next = event.target.value
            if (isOneOf(SORT_OPTIONS, next)) onChange(next)
          }}
          className="min-h-11 cursor-pointer appearance-none rounded-lg border border-field bg-white py-0 pr-10 pl-3.5 text-[13px] font-semibold transition-colors hover:border-forest"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 text-muted" />
      </div>
    </div>
  )
}
