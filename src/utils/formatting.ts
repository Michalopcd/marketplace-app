import { CURRENCY, LOCALE } from './constants'

const wholePriceFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
})

const fractionalPriceFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Warsaw',
})

/** Formats a PLN amount: whole amounts without decimals ("120 zł"), others with two ("149,50 zł"). */
export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new RangeError('Invalid price amount')
  }
  const formatter = Number.isInteger(amount)
    ? wholePriceFormatter
    : fractionalPriceFormatter
  return formatter.format(amount)
}

const pluralRules = new Intl.PluralRules(LOCALE)

const OFFER_FORMS: Record<Intl.LDMLPluralRule, string> = {
  zero: 'ofert',
  one: 'oferta',
  two: 'oferty',
  few: 'oferty',
  many: 'ofert',
  other: 'oferty',
}

/** Polish count of offers: "1 oferta", "3 oferty", "5 ofert", "22 oferty". */
export function formatOfferCount(count: number): string {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('Invalid offer count')
  }

  return `${count} ${OFFER_FORMS[pluralRules.select(count)]}`
}

/** Formats an ISO 8601 date, e.g. "2026-11-02T10:00:00.000Z" → "2 listopada 2026". */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid ISO date: ${isoDate}`)
  }
  return dateFormatter.format(date)
}
