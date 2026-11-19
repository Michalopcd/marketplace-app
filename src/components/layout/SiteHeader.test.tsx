// @vitest-environment jsdom
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./SiteHeader";

function renderHeader(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SiteHeader />
    </MemoryRouter>,
  );
}

const getTrigger = () => screen.getByRole("button", { name: "Otwórz menu" });

function openMenu() {
  fireEvent.click(getTrigger());

  return screen.getByRole("dialog", {
    name: "Menu",
  }) as HTMLDialogElement;
}

function expectSingleLink(name: string, href: string) {
  expect(
    within(screen.getByRole("banner")).getByRole("link", { name }),
  ).toHaveAttribute("href", href);
}

describe("SiteHeader", () => {
  it("renders a banner with the logo linking home", () => {
    renderHeader();

    expectSingleLink("NÓW Marketplace - strona główna", "/");
  });

  it("renders primary links and marks the active route with aria-current", () => {
    renderHeader("/marketplace");

    const nav = screen.getByRole("navigation", {
      name: "Główna nawigacja",
    });

    expect(
      within(nav).getByRole("link", { name: "Marketplace" }),
    ).toHaveAttribute("aria-current", "page");

    expect(
      within(nav).getByRole("link", { name: "Strona główna" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("links categories to a pre-filtered marketplace, splitting fashion by audience", () => {
    renderHeader();

    const nav = screen.getByRole("navigation", {
      name: "Kategorie",
    });

    expect(within(nav).getByRole("link", { name: "Kobiety" })).toHaveAttribute(
      "href",
      "/marketplace?category=fashion&subcategory=women",
    );

    expect(
      within(nav).getByRole("link", { name: "Elektronika" }),
    ).toHaveAttribute("href", "/marketplace?category=electronics");

    expect(
      within(nav).queryByRole("link", { name: "Moda" }),
    ).not.toBeInTheDocument();
  });

  it("exposes header actions with accessible names", () => {
    renderHeader();

    expectSingleLink("Ulubione", "/favorites");
    expectSingleLink("Zaloguj się", "/auth/login");
    expectSingleLink("Sprzedaj", "/listing/create");
  });

  describe("mobile menu", () => {
    it("is closed initially and linked to its trigger", () => {
      renderHeader();

      const trigger = getTrigger();

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      const dialog = document.getElementById(
        trigger.getAttribute("aria-controls") ?? "",
      );

      expect(dialog?.tagName).toBe("DIALOG");
    });

    it("opens as a dialog and updates aria-expanded", () => {
      renderHeader();

      const dialog = openMenu();

      expect(dialog).toHaveAttribute("open");
      expect(getTrigger()).toHaveAttribute("aria-expanded", "true");

      expect(
        within(dialog).getByRole("link", { name: "Sprzedaj" }),
      ).toHaveAttribute("href", "/listing/create");

      expect(
        within(dialog).getByRole("link", { name: "Ulubione" }),
      ).toHaveAttribute("href", "/favorites");
    });

    it("closes with the close button", () => {
      renderHeader();

      const dialog = openMenu();

      fireEvent.click(
        within(dialog).getByRole("button", {
          name: "Zamknij menu",
        }),
      );

      expect(dialog).not.toHaveAttribute("open");
      expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
    });

    it.each(["Marketplace", "NÓW Marketplace - strona główna", "Sprzedaj"])(
      'closes after choosing the "%s" link',
      (name) => {
        renderHeader();

        const dialog = openMenu();

        fireEvent.click(within(dialog).getByRole("link", { name }));

        expect(dialog).not.toHaveAttribute("open");
        expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
      },
    );

    it("syncs state when the dialog closes", () => {
      renderHeader();

      const dialog = openMenu();

      act(() => {
        dialog.close();
      });

      expect(dialog).not.toHaveAttribute("open");
      expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on a backdrop click but not on a click inside the panel", () => {
      renderHeader();

      const dialog = openMenu();

      fireEvent.click(
        within(dialog).getByRole("navigation", {
          name: "Menu mobilne",
        }),
      );

      expect(dialog).toHaveAttribute("open");

      fireEvent.click(dialog);

      expect(dialog).not.toHaveAttribute("open");
    });
  });
});
