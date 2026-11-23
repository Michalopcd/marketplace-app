import { describe, expect, it } from "vitest";
import type { ListingFilters } from "../types/listing";
import { CATEGORY_ENTRIES } from "./categories";
import { CONDITIONS, MAX_SEARCH_QUERY_LENGTH, SORT_OPTIONS } from "./constants";
import { DEFAULT_LISTING_FILTERS } from "./listingFilters";
import {
  isOneOf,
  normalizeListingFilters,
  parseListingFilters,
  serializeListingFilters,
} from "./listingFiltersParams";
import { marketplacePath } from "./paths";

const parse = (search: string) =>
  parseListingFilters(new URLSearchParams(search));

const withFilters = (patch: Partial<ListingFilters>): ListingFilters => ({
  ...DEFAULT_LISTING_FILTERS,
  ...patch,
});

describe("isOneOf", () => {
  it("accepts only listed values", () => {
    expect(isOneOf(CONDITIONS, "good")).toBe(true);
    expect(isOneOf(CONDITIONS, "broken")).toBe(false);
    expect(isOneOf(CONDITIONS, null)).toBe(false);
  });
});

describe("parseListingFilters", () => {
  it("returns the defaults for an empty query string", () => {
    expect(parse("")).toEqual(DEFAULT_LISTING_FILTERS);
  });

  it("reads every filter", () => {
    expect(
      parse(
        "?query=kurtka&category=fashion&subcategory=women&condition=good&minPrice=50&maxPrice=300&sortBy=price-asc",
      ),
    ).toEqual({
      query: "kurtka",
      category: "fashion",
      subcategory: "women",
      condition: "good",
      minPrice: 50,
      maxPrice: 300,
      sortBy: "price-asc",
    });
  });

  it("reads every navigation link built by marketplacePath", () => {
    for (const { filter } of CATEGORY_ENTRIES) {
      const search = new URL(marketplacePath(filter), "http://localhost")
        .searchParams;

      expect(parseListingFilters(search)).toEqual(
        withFilters({
          category: filter.category,
          subcategory: "subcategory" in filter ? filter.subcategory : null,
        }),
      );
    }
  });

  it.each(SORT_OPTIONS)("reads sortBy=%s", (sortBy) => {
    expect(parse(`?sortBy=${sortBy}`).sortBy).toBe(sortBy);
  });

  it("ignores unknown enum values", () => {
    expect(parse("?category=cars&condition=broken&sortBy=abc")).toEqual(
      DEFAULT_LISTING_FILTERS,
    );

    expect(parse("?category=fashion&subcategory=pets")).toEqual(
      withFilters({ category: "fashion" }),
    );
  });

  it.each([
    "-5",
    "abc",
    "Infinity",
    "",
    "  ",
    "1e3",
    "0x10",
    "12,50",
    "9".repeat(400),
  ])('ignores an invalid price "%s"', (raw) => {
    const filters = parse(
      `?minPrice=${encodeURIComponent(raw)}&maxPrice=${encodeURIComponent(raw)}`,
    );

    expect(filters.minPrice).toBeNull();
    expect(filters.maxPrice).toBeNull();
  });

  it("accepts whole and decimal prices, including 0", () => {
    expect(parse("?minPrice=0&maxPrice=89.99")).toMatchObject({
      minPrice: 0,
      maxPrice: 89.99,
    });
  });

  it("drops a subcategory outside fashion", () => {
    expect(parse("?category=home&subcategory=men")).toEqual(
      withFilters({ category: "home" }),
    );

    expect(parse("?subcategory=men")).toEqual(DEFAULT_LISTING_FILTERS);
  });

  it("ignores an inverted price range but keeps the rest", () => {
    expect(parse("?minPrice=300&maxPrice=50&condition=new")).toEqual(
      withFilters({ condition: "new" }),
    );
  });

  it("trims the query and caps its length", () => {
    expect(parse("?query=%20%20kurtka%20").query).toBe("kurtka");

    expect(parse(`?query=${"a".repeat(150)}`).query).toHaveLength(
      MAX_SEARCH_QUERY_LENGTH,
    );
  });

  it("uses the first value of a duplicated parameter", () => {
    expect(parse("?category=home&category=sports").category).toBe("home");
  });

  it("ignores unrelated parameters", () => {
    expect(parse("?utm_source=newsletter&q=kurtka")).toEqual(
      DEFAULT_LISTING_FILTERS,
    );
  });
});

describe("normalizeListingFilters", () => {
  it("keeps valid filters unchanged", () => {
    const filters = withFilters({
      category: "fashion",
      subcategory: "kids",
      minPrice: 10,
      maxPrice: 10,
    });

    expect(normalizeListingFilters(filters)).toEqual(filters);
  });

  it("removes the subcategory when the category is not fashion", () => {
    expect(
      normalizeListingFilters(
        withFilters({ category: "sports", subcategory: "men" }),
      ),
    ).toEqual(withFilters({ category: "sports" }));
  });

  it("removes both price bounds when min > max", () => {
    expect(
      normalizeListingFilters(withFilters({ minPrice: 20, maxPrice: 10 })),
    ).toEqual(DEFAULT_LISTING_FILTERS);
  });

  it("trims and caps the query", () => {
    expect(
      normalizeListingFilters(withFilters({ query: ` ${"b".repeat(120)} ` }))
        .query,
    ).toBe("b".repeat(MAX_SEARCH_QUERY_LENGTH));
  });
});

describe("serializeListingFilters", () => {
  it("produces an empty string for the defaults", () => {
    expect(serializeListingFilters(DEFAULT_LISTING_FILTERS).toString()).toBe(
      "",
    );
  });

  it("omits default values and uses a stable key order", () => {
    const filters = withFilters({
      sortBy: "price-desc",
      maxPrice: 300,
      condition: "good",
      subcategory: "women",
      category: "fashion",
      query: "płaszcz",
    });

    expect(serializeListingFilters(filters).toString()).toBe(
      new URLSearchParams([
        ["query", "płaszcz"],
        ["category", "fashion"],
        ["subcategory", "women"],
        ["condition", "good"],
        ["maxPrice", "300"],
        ["sortBy", "price-desc"],
      ]).toString(),
    );
  });

  it("matches the navigation link format", () => {
    expect(
      serializeListingFilters(
        withFilters({
          category: "fashion",
          subcategory: "men",
        }),
      ).toString(),
    ).toBe("category=fashion&subcategory=men");
  });

  it("keeps a 0 price bound", () => {
    expect(
      serializeListingFilters(withFilters({ minPrice: 0 })).toString(),
    ).toBe("minPrice=0");
  });

  it("normalizes before writing", () => {
    expect(
      serializeListingFilters(
        withFilters({
          category: "home",
          subcategory: "men",
          minPrice: 9,
          maxPrice: 1,
        }),
      ).toString(),
    ).toBe("category=home");
  });

  it.each<Partial<ListingFilters>>([
    {},
    { query: "kurtka zimowa" },
    { category: "fashion" },
    {
      category: "fashion",
      subcategory: "kids",
      condition: "like-new",
    },
    {
      category: "electronics",
      minPrice: 0.5,
      maxPrice: 2450,
      sortBy: "price-asc",
    },
    {
      maxPrice: 99.99,
      sortBy: "price-desc",
    },
  ])("round-trips %o", (patch) => {
    const filters = withFilters(patch);

    expect(parseListingFilters(serializeListingFilters(filters))).toEqual(
      filters,
    );
  });
});
