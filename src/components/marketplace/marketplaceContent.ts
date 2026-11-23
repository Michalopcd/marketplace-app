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

export function noResultsDescription(query: string): string {
  return query === ''
    ? MARKETPLACE.noResultsFiltersDescription
    : `Nie znaleźliśmy produktów dla „${query}”. Sprawdź pisownię albo poszukaj czegoś ogólniejszego.`
}
