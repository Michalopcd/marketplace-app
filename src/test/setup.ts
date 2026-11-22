import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

/**
 * jsdom polyfills (DOM tests only).
 * jsdom does not fully implement the dialog API or matchMedia.
 */
if (typeof window !== "undefined") {
  const dialogProto = window.HTMLDialogElement.prototype;

  if (!dialogProto.showModal) {
    dialogProto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }

  if (!dialogProto.close) {
    dialogProto.close = function close(this: HTMLDialogElement) {
      if (!this.hasAttribute("open")) return;

      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }

  if (!window.matchMedia) {
    window.matchMedia = (query: string): MediaQueryList => {
      const list = new EventTarget() as MediaQueryList;

      return Object.assign(list, {
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
      });
    };
  }
}
