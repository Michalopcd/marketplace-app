import type {
  CATEGORIES,
  CONDITIONS,
  FASHION_SUBCATEGORIES,
  SORT_OPTIONS,
} from '../utils/constants'
import type { UserId } from './user'

export type Category = (typeof CATEGORIES)[number]
export type FashionSubcategory = (typeof FASHION_SUBCATEGORIES)[number]
export type Condition = (typeof CONDITIONS)[number]
export type SortOption = (typeof SORT_OPTIONS)[number]

export type ListingId = string

/** A product offered for sale. Price is in PLN; dates are ISO 8601 strings. */
export interface Listing {
  id: ListingId
  userId: UserId
  title: string
  description: string
  price: number
  category: Category
  condition: Condition
  subcategory?: FashionSubcategory
  size?: string
  images: string[]
  isSold: boolean
  createdAt: string
  updatedAt: string
}

/** Search, filter and sort criteria for the product list. `null` means "no constraint". */
export interface ListingFilters {
  query: string
  category: Category | null
  condition: Condition | null
  minPrice: number | null
  maxPrice: number | null
  subcategory: FashionSubcategory | null
  sortBy: SortOption
}
