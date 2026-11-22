import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "../../utils/cn";
import { HeartIcon } from "../icons/HeartIcon";
import { PlusIcon, UserIcon } from "../icons/icons";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavItemLink } from "./NavItemLink";
import {
  FAVORITES_LINK,
  LOGIN_LINK,
  SELL_LINK,
  SHOP_LINKS,
  type NavItem,
} from "./navigationLinks";

interface Props {
  item: NavItem;
  icon: ReactNode;
  className?: string;
}

function ActionLink({ item, icon, className }:Props) {
  return (
    <Link
      to={item.to}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-200 hover:bg-mint hover:text-forest",
        className,
      )}
    >
      {icon}
      <span className="sr-only lg:not-sr-only">{item.label}</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header>
      {/* min-h (not h) and px edge offsets keep the bar intact when users enlarge text. */}
      <Container className="relative flex min-h-[61px] items-center justify-between md:min-h-20 md:justify-start md:gap-10">
        <MobileMenu />

        {/* The logo is the way home on every screen size. */}
        <Logo className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0" />

        <div className="-mr-[10px] flex items-center gap-1 md:mr-0 md:ml-auto md:gap-6">
          <ActionLink
            item={FAVORITES_LINK}
            icon={<HeartIcon />}
            className="max-md:hidden"
          />

          <ActionLink item={LOGIN_LINK} icon={<UserIcon />} />

          <ButtonLink to={SELL_LINK.to} size="sm" className="max-md:hidden">
            <PlusIcon />
            {SELL_LINK.label}
          </ButtonLink>
        </div>
      </Container>

      <nav
        aria-label="Kategorie"
        className="hidden border-y border-line md:block"
      >
        <Container>
          {/*
            No scroll container (it clipped focus outlines). The row fits on one line at
            every `md+` width; with enlarged text or zoom it wraps instead of overflowing.
          */}
          <ul className="flex min-h-11 flex-wrap items-center gap-x-6 lg:gap-x-8">
            {SHOP_LINKS.map((item) => (
              <li key={item.to}>
                <NavItemLink
                  item={item}
                  // -mx/px widen the hit area of short labels ("Dom", "Inne") to ≥ 44 px
                  // without moving them; the underline stays exactly under the text.
                  className={(isActive) =>
                    cn(
                      "relative -mx-2.5 inline-flex min-h-11 items-center px-2.5 text-xs font-semibold transition-colors duration-200 after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:transition-colors after:duration-200",
                      isActive
                        ? "text-forest after:bg-forest"
                        : "hover:text-forest hover:after:bg-forest",
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
