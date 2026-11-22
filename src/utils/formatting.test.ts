import { describe, expect, it } from "vitest";
import { formatDate, formatOfferCount, formatPrice } from "./formatting";

/** Intl uses non-breaking spaces; normalize them so expectations stay readable. */
const normalizeSpaces = (value: string) => value.replace(/\s/g, " ");

describe("formatPrice", () => {
  it("formats whole amounts without decimals", () => {
    expect(normalizeSpaces(formatPrice(120))).toBe("120 zł");
  });

  it("formats fractional amounts with two decimals", () => {
    expect(normalizeSpaces(formatPrice(89.99))).toBe("89,99 zł");
    expect(normalizeSpaces(formatPrice(399.5))).toBe("399,50 zł");
  });

  it("groups thousands", () => {
    expect(normalizeSpaces(formatPrice(12450))).toBe("12 450 zł");
  });

  it("throws on invalid price amounts", () => {
    expect(() => formatPrice(NaN)).toThrow(RangeError);
    expect(() => formatPrice(Infinity)).toThrow(RangeError);
    expect(() => formatPrice(-Infinity)).toThrow(RangeError);
  });
});
it("throws on invalid offer counts", () => {
  expect(() => formatOfferCount(-1)).toThrow(RangeError);
  expect(() => formatOfferCount(2.5)).toThrow(RangeError);
  expect(() => formatOfferCount(NaN)).toThrow(RangeError);
  expect(() => formatOfferCount(Infinity)).toThrow(RangeError);
});

describe("formatOfferCount", () => {
  it.each([
    [0, "0 ofert"],
    [1, "1 oferta"],
    [2, "2 oferty"],
    [4, "4 oferty"],
    [5, "5 ofert"],
    [12, "12 ofert"],
    [22, "22 oferty"],
    [25, "25 ofert"],
  ])('formats %i as "%s"', (count, expected) => {
    expect(formatOfferCount(count)).toBe(expected);
  });
});

describe("formatDate", () => {
  it("formats an ISO date in Polish", () => {
    expect(formatDate("2026-11-02T10:00:00.000Z")).toBe("2 listopada 2026");
  });

  it("throws on an invalid date", () => {
    expect(() => formatDate("not-a-date")).toThrow(RangeError);
  });
});
