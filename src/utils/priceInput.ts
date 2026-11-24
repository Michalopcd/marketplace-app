/** A price typed into a filter field: a number, `null` (empty = no constraint) or invalid. */
export type ParsedPriceInput = number | null | 'invalid'

/** Non-negative decimal with a dot or a Polish comma ("89.99", "89,99"); no signs or exponents. */
const PRICE_INPUT_PATTERN = /^\d+([.,]\d+)?$/

export function parsePriceInput(raw: string): ParsedPriceInput {
  const value = raw.trim()
  if (value === '') return null
  if (!PRICE_INPUT_PATTERN.test(value)) return 'invalid'

  const price = Number(value.replace(',', '.'))
  return Number.isFinite(price) ? price : 'invalid'
}

/** Field text for a committed price (`null` = empty field). */
export function formatPriceInput(price: number | null): string {
  return price === null ? '' : String(price)
}
