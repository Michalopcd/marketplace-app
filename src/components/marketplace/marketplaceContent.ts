import { formatOfferCount } from '../../utils/formatting'

/** Static MARKETPLACE copy (Issue #11 mockup). */
export const MARKETPLACE = {
  eyebrow: 'Marketplace',
  resultsHeading: 'Lista produktów',
  emptyTitle: 'Jeszcze nic tu nie ma',
  emptyDescription: 'Nowe perełki pojawią się wkrótce. Zajrzyj do nas niedługo.',
  noResultsTitle: 'Brak wyników',
  noResultsFiltersDescription: 'Nie znaleźliśmy produktów spełniających wybrane kryteria.',
  resetAction: 'Wyczyść wyszukiwanie i filtry',
} as const

/** "Załaduj więcej" footer copy (Issue #13 mockup). */
export const LOAD_MORE = {
  action: 'Załaduj więcej',
} as const

/** Tailwind `lg`: from here the filters live in the sidebar instead of the drawer. */
export const LG_QUERY = '(min-width: 64rem)'

/** Filters panel copy (Issue #12 mockup). */
export const FILTERS = {
  heading: 'Filtry',
  category: 'Kategoria',
  allCategories: 'Wszystkie',
  fashionSubcategory: 'Podkategoria Mody',
  allFashion: 'Cała moda',
  price: 'Cena (zł)',
  priceMin: 'Cena minimalna',
  priceMax: 'Cena maksymalna',
  priceMinPlaceholder: 'Od',
  priceMaxPlaceholder: 'Do',
  invalidAmount: 'Podaj kwotę 0 zł lub wyższą.',
  invertedRange: 'Cena minimalna nie może być wyższa od maksymalnej.',
  condition: 'Stan',
  anyCondition: 'Dowolny',
  clear: 'Wyczyść',
  close: 'Zamknij filtry',
} as const

const ACTIVE_FORMS: Record<Intl.LDMLPluralRule, string> = {
  zero: 'aktywnych',
  one: 'aktywny',
  two: 'aktywne',
  few: 'aktywne',
  many: 'aktywnych',
  other: 'aktywnego',
}
const activeRules = new Intl.PluralRules('pl-PL')

/** "1 aktywny", "2 aktywne", "5 aktywnych" – read out with the filters button. */
export function formatActiveFilters(count: number): string {
  return `${count} ${ACTIVE_FORMS[activeRules.select(count)]}`
}

export function showResultsLabel(count: number | null): string {
  return count === null ? 'Pokaż wyniki' : `Pokaż ${formatOfferCount(count)}`
}

export function noResultsDescription(query: string): string {
  return query === ''
    ? MARKETPLACE.noResultsFiltersDescription
    : `Nie znaleźliśmy produktów dla „${query}”. Sprawdź pisownię albo poszukaj czegoś ogólniejszego.`
}
