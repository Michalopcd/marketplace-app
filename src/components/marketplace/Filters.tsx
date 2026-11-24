import { useId, type ReactNode } from 'react'
import type { ListingFilters } from '../../types/listing'
import { cn } from '../../utils/cn'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CONDITIONS,
  CONDITION_LABELS,
  FASHION_SUBCATEGORIES,
  FASHION_SUBCATEGORY_LABELS,
} from '../../utils/constants'
import { FILTERS } from './marketplaceContent'
import { PriceRangeFields } from './PriceRangeFields'

interface FiltersProps {
  filters: ListingFilters
  /** One patch per user action, applied to the URL by `useListingFilters`. */
  onChange: (patch: Partial<ListingFilters>) => void
  /** Changing it remounts the price fields, dropping drafts the URL doesn't hold (e.g. after "Wyczyść"). */
  resetKey?: number
}

interface OptionProps {
  name: string
  label: string
  checked: boolean
  onSelect: () => void
  compact?: boolean
}

/** Native radio (arrow keys move within the group) with a 44px row as the touch target. */
function Option({ name, label, checked, onSelect, compact = false }: OptionProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 has-checked:font-bold has-checked:text-forest',
        compact ? 'min-h-10 text-[13px]' : 'min-h-11 text-sm',
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="size-[18px] shrink-0 cursor-pointer accent-forest"
      />
      <span>{label}</span>
    </label>
  )
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 border-b border-line pt-[18px] pb-3.5">
      <legend className="mb-1.5 text-[11px] font-bold tracking-[0.14em] text-moss uppercase">
        {legend}
      </legend>
      {children}
    </fieldset>
  )
}

/**
 * Category (with fashion subcategories), price range and condition. Used in the
 * desktop sidebar and the mobile drawer; all state comes from the URL.
 */
export function Filters({ filters, onChange, resetKey = 0 }: FiltersProps) {
  const name = useId()
  const { category, subcategory, condition } = filters

  return (
    <div>
      <Group legend={FILTERS.category}>
        <Option
          name={`${name}-category`}
          label={FILTERS.allCategories}
          checked={category === null}
          onSelect={() => onChange({ category: null, subcategory: null })}
        />
        {CATEGORIES.map((option) => (
          <div key={option}>
            <Option
              name={`${name}-category`}
              label={CATEGORY_LABELS[option]}
              checked={category === option}
              // Subcategories exist only in fashion (CLAUDE.md → Model danych); a new category starts without one.
              onSelect={() => onChange({ category: option, subcategory: null })}
            />
            {option === 'fashion' && category === 'fashion' && (
              <div
                role="group"
                aria-label={FILTERS.fashionSubcategory}
                className="mb-1 ml-[30px] border-l border-line pl-3.5"
              >
                <Option
                  compact
                  name={`${name}-subcategory`}
                  label={FILTERS.allFashion}
                  checked={subcategory === null}
                  onSelect={() => onChange({ subcategory: null })}
                />
                {FASHION_SUBCATEGORIES.map((sub) => (
                  <Option
                    compact
                    key={sub}
                    name={`${name}-subcategory`}
                    label={FASHION_SUBCATEGORY_LABELS[sub]}
                    checked={subcategory === sub}
                    onSelect={() => onChange({ subcategory: sub })}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </Group>

      <Group legend={FILTERS.price}>
        <PriceRangeFields
          key={resetKey}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onCommit={onChange}
        />
      </Group>

      <Group legend={FILTERS.condition}>
        <Option
          name={`${name}-condition`}
          label={FILTERS.anyCondition}
          checked={condition === null}
          onSelect={() => onChange({ condition: null })}
        />
        {CONDITIONS.map((option) => (
          <Option
            key={option}
            name={`${name}-condition`}
            label={CONDITION_LABELS[option]}
            checked={condition === option}
            onSelect={() => onChange({ condition: option })}
          />
        ))}
      </Group>
    </div>
  )
}
