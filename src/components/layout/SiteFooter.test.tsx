// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

function renderFooter() {
  return render(
    <MemoryRouter>
      <SiteFooter />
    </MemoryRouter>,
  );
}

describe("SiteFooter", () => {
  it("renders a contentinfo landmark with a light logo linking home", () => {
    renderFooter();

    const footer = screen.getByRole("contentinfo");
    const logo = within(footer).getByRole("link", {
      name: "NÓW Marketplace - strona główna",
    });

    expect(logo).toHaveAttribute("href", "/");
    expect(logo).toHaveClass("text-white");
  });

  it("groups links in labelled navigation regions with headings", () => {
    renderFooter();

    const shop = screen.getByRole("navigation", { name: "Kupuj" });
    expect(
      within(shop).getByRole("heading", { level: 2, name: "Kupuj" }),
    ).toBeInTheDocument();
    expect(
      within(shop).getByRole("link", { name: "Wszystkie produkty" }),
    ).toHaveAttribute("href", "/marketplace");
    expect(
      within(shop).queryByRole("link", { name: "Marketplace" }),
    ).not.toBeInTheDocument();
    expect(within(shop).getByRole("link", { name: "Dzieci" })).toHaveAttribute(
      "href",
      "/marketplace?category=fashion&subcategory=kids",
    );

    const account = screen.getByRole("navigation", { name: "Twoje konto" });
    expect(
      within(account).getByRole("link", { name: "Sprzedaj" }),
    ).toHaveAttribute("href", "/listing/create");
  });

  it("shows the copyright with the current year", () => {
    renderFooter();

    expect(
      screen.getByText(`© ${new Date().getFullYear()} NÓW Marketplace`),
    ).toBeInTheDocument();
  });
});
