import type { ListingFilters } from "../types/listing";
import {
  CATEGORIES,
  CONDITIONS,
  FASHION_SUBCATEGORIES,
  MAX_SEARCH_QUERY_LENGTH,
  SORT_OPTIONS,
} from "./constants";
import { DEFAULT_LISTING_FILTERS, getPriceRangeError } from "./listingFilters";

/**
 * URL ⇄ ListingFilters. The URL is the source of truth for marketplace filters,
 * so links can be shared and survive reloads. Keys equal the ListingFilters
 * field names – the format marketplacePath() already produces.
 */

/** Canonical key order, so the same filters always produce the same URL. */
const FILTER_KEYS = [
  "query",
  "category",
  "subcategory",
  "condition",
  "minPrice",
  "maxPrice",
  "sortBy",
] as const satisfies readonly (keyof ListingFilters)[];

export function isOneOf<T extends string>(
  values: readonly T[],
  value: unknown,
): value is T {
  return (values as readonly unknown[]).includes(value);
}

/** Plain non-negative decimal ("50", "89.99"); rejects "-5", "1e3", "0x10", "12,50". */
const PRICE_PATTERN = /^\d+(\.\d+)?$/;

function parsePrice(raw: string | null): number | null {
  if (raw === null || !PRICE_PATTERN.test(raw)) return null;

  const price = Number(raw);

  return Number.isFinite(price) ? price : null;
}

/** Parses an allowed option or returns null. */
function parseOption<T extends string>(
  values: readonly T[],
  raw: string | null,
): T | null {
  return isOneOf(values, raw) ? raw : null;
}

/**
 * Enforces the data model on any filters: a subcategory only with fashion
 * (CLAUDE.md → Model danych), no inverted price range, a trimmed, capped query.
 */
export function normalizeListingFilters(
  filters: ListingFilters,
): ListingFilters {
  const hasValidPriceRange =
    getPriceRangeError(filters.minPrice, filters.maxPrice) === null;

  return {
    ...filters,
    query: filters.query.trim().slice(0, MAX_SEARCH_QUERY_LENGTH),
    subcategory: filters.category === "fashion" ? filters.subcategory : null,
    minPrice: hasValidPriceRange ? filters.minPrice : null,
    maxPrice: hasValidPriceRange ? filters.maxPrice : null,
  };
}

/** Never throws: unknown or malformed values fall back to "no constraint". */
export function parseListingFilters(params: URLSearchParams): ListingFilters {
  return normalizeListingFilters({
    query: params.get("query") ?? "",
    category: parseOption(CATEGORIES, params.get("category")),
    subcategory: parseOption(FASHION_SUBCATEGORIES, params.get("subcategory")),
    condition: parseOption(CONDITIONS, params.get("condition")),
    minPrice: parsePrice(params.get("minPrice")),
    maxPrice: parsePrice(params.get("maxPrice")),
    sortBy:
      parseOption(SORT_OPTIONS, params.get("sortBy")) ??
      DEFAULT_LISTING_FILTERS.sortBy,
  });
}

/** Normalized filters as URL params; defaults and empty values are omitted. */
export function serializeListingFilters(
  filters: ListingFilters,
): URLSearchParams {
  const normalized = normalizeListingFilters(filters);
  const params = new URLSearchParams();

  for (const key of FILTER_KEYS) {
    const value = normalized[key];

    if (
      value !== null &&
      value !== "" &&
      value !== DEFAULT_LISTING_FILTERS[key]
    ) {
      params.set(key, String(value));
    }
  }

  return params;
}
