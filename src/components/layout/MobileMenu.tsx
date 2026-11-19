import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router";
import { CloseIcon, MenuIcon, PlusIcon } from "../icons/icons";
import { ButtonLink } from "../ui/ButtonLink";
import { Logo } from "./Logo";
import {
  CATEGORY_LINKS,
  FAVORITES_LINK,
  LOGIN_LINK,
  PRIMARY_LINKS,
  SELL_LINK,
} from "./navigationLinks";

const DESKTOP_QUERY = "(min-width: 48rem)";

const DRAWER_LINKS = [
  ...PRIMARY_LINKS,
  ...CATEGORY_LINKS,
  FAVORITES_LINK,
  LOGIN_LINK,
];

const iconButtonClassName =
  "group grid size-11 place-items-center rounded-lg text-ink transition-all duration-200 hover:bg-mint hover:text-forest active:bg-mint active:scale-90 motion-reduce:transition-none";

export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  const open = () => {
    dialogRef.current?.showModal();
    setIsOpen(true);
  };

  const close = () => {
    dialogRef.current?.close();
  };

  // Close the menu when switching to desktop layout.
  useEffect(() => {
    if (!isOpen) return;

    const query = window.matchMedia(DESKTOP_QUERY);

    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        dialogRef.current?.close();
      }
    };

    query.addEventListener("change", closeOnDesktop);

    return () => {
      query.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

  // Close on backdrop click or navigation.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    const { target, currentTarget } = event;

    const isLink = target instanceof Element && target.closest("a") !== null;

    if (target === currentTarget || isLink) {
      close();
    }
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={open}
        aria-label="Otwórz menu"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={`${iconButtonClassName} -ml-2.5 md:hidden`}
      >
        <MenuIcon
          size={24}
          className="transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none"
        />
      </button>

      {/* Mobile navigation drawer */}
      <dialog
        ref={dialogRef}
        id={menuId}
        aria-label="Menu"
        onClose={() => setIsOpen(false)}
        onClick={handleClick}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(85vw,340px)] max-w-none -translate-x-full bg-white p-0 text-ink transition-[translate,overlay,display] transition-discrete duration-300 backdrop:bg-ink/35 backdrop:backdrop-blur-[2px] open:translate-x-0 starting:open:-translate-x-full md:hidden"
      >
        <div className="flex h-full flex-col overflow-y-auto p-6">
          {/* Logo and close button */}
          <div className="flex items-center justify-between border-b border-line pb-5">
            <Logo />

            <button
              type="button"
              onClick={close}
              aria-label="Zamknij menu"
              className={iconButtonClassName}
            >
              <CloseIcon
                size={24}
                className="transition-transform duration-200 group-hover:rotate-90 group-active:rotate-90 motion-reduce:transition-none"
              />
            </button>
          </div>

          {/* Navigation links */}
          <nav aria-label="Menu mobilne" className="pt-5">
            <ul className="space-y-1">
              {DRAWER_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex min-h-12 items-center border-b border-forest/30 px-3 py-3 text-base font-medium text-ink transition-colors duration-200 hover:border-forest hover:bg-mint hover:text-forest"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sell button */}
          <ButtonLink to={SELL_LINK.to} fullWidth className="mt-7">
            <PlusIcon />
            {SELL_LINK.label}
          </ButtonLink>
        </div>
      </dialog>
    </>
  );
}
