export const APP_NAME = 'NÓW Marketplace'

export const CURRENCY = 'PLN'
export const LOCALE = 'pl-PL'

export const CATEGORIES = [
  'fashion',
  'electronics',
  'home',
  'sports',
  'other',
] as const

export const CATEGORY_LABELS = {
  fashion: 'Moda',
  electronics: 'Elektronika',
  home: 'Dom',
  sports: 'Sport',
  other: 'Inne',
} as const satisfies Record<(typeof CATEGORIES)[number], string>

/** Subcategories apply to the `fashion` category only. */
export const FASHION_SUBCATEGORIES = ['women', 'men', 'kids'] as const

export const FASHION_SUBCATEGORY_LABELS = {
  women: 'Kobiety',
  men: 'Mężczyźni',
  kids: 'Dzieci',
} as const satisfies Record<
  (typeof FASHION_SUBCATEGORIES)[number],
  string
>

export const CONDITIONS = ['new', 'like-new', 'good', 'fair'] as const

export const CONDITION_LABELS = {
  new: 'Nowy',
  'like-new': 'Jak nowy',
  good: 'Dobry',
  fair: 'Zadowalający',
} as const satisfies Record<(typeof CONDITIONS)[number], string>

export const SORT_OPTIONS = ['newest', 'price-asc', 'price-desc'] as const

export const SORT_LABELS = {
  newest: 'Najnowsze',
  'price-asc': 'Cena: od najniższej',
  'price-desc': 'Cena: od najwyższej',
} as const satisfies Record<(typeof SORT_OPTIONS)[number], string>

/** Search phrases longer than a listing title (max 100 chars) can't match anything. */
export const MAX_SEARCH_QUERY_LENGTH = 100
