import type { Listing } from '../types/listing'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  FASHION_SUBCATEGORIES,
  FASHION_SUBCATEGORY_LABELS,
} from './constants'
import type { CategoryFilter } from './paths'

export interface CategoryEntry {
  /** Stable id, e.g. `fashion-women` or `electronics`. */
  key: string
  label: string
  filter: CategoryFilter
  /**
   * Representative cover photo (`public/images/categories/<key>.webp`, 4:5).
   * Sources and licence: `docs/image-credits.md`.
   */
  image: string
}

const categoryImagePath = (key: string) => `/images/categories/${key}.webp`

/**
 * The browsable categories, in display order: fashion split into its
 * subcategories, then every other category. Single source for the header,
 * mobile menu, footer and the HOME category section.
 */
export const CATEGORY_ENTRIES: readonly CategoryEntry[] = [
  ...FASHION_SUBCATEGORIES.map((subcategory) => ({
    key: `fashion-${subcategory}`,
    label: FASHION_SUBCATEGORY_LABELS[subcategory],
    filter: { category: 'fashion', subcategory } as const,
    image: categoryImagePath(`fashion-${subcategory}`),
  })),
  ...CATEGORIES.filter((category) => category !== 'fashion').map(
    (category) => ({
      key: category,
      label: CATEGORY_LABELS[category],
      filter: { category },
      image: categoryImagePath(category),
    }),
  ),
]

export function matchesCategoryFilter(
  listing: Listing,
  filter: CategoryFilter,
): boolean {
  if (listing.category !== filter.category) return false
  return !('subcategory' in filter) || listing.subcategory === filter.subcategory
}
