import type { ListingFilters } from '../types/listing'
import { CATEGORY_LABELS, FASHION_SUBCATEGORY_LABELS } from './constants'

export const ALL_PRODUCTS_HEADING = 'Wszystkie produkty'

/**
 * MARKETPLACE page title for the category filter in the URL. Uses the same
 * labels as the navigation ("Kobiety", "Elektronika"), so the active nav link
 * and the h1 always agree.
 */
export function getMarketplaceHeading({
  category,
  subcategory,
}: Pick<ListingFilters, 'category' | 'subcategory'>): string {
  if (category === null) return ALL_PRODUCTS_HEADING
  // Subcategories exist only in fashion (CLAUDE.md → Model danych).
  if (category === 'fashion' && subcategory !== null) {
    return FASHION_SUBCATEGORY_LABELS[subcategory]
  }
  return CATEGORY_LABELS[category]
}
