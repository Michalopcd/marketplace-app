import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import { cn } from "../../utils/cn";
import { HeartIcon } from "../icons/HeartIcon";
import { PlusIcon, UserIcon } from "../icons/icons";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import {
  CATEGORY_LINKS,
  FAVORITES_LINK,
  LOGIN_LINK,
  PRIMARY_LINKS,
  SELL_LINK,
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
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-200 hover:bg-mint hover:text-forest",
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
      <Container className="relative flex h-[61px] items-center justify-between md:h-20 md:justify-start md:gap-10">
        <MobileMenu />

        <Logo className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0" />

        <nav aria-label="Główna nawigacja" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {PRIMARY_LINKS.map(({ label, to, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex min-h-11 items-center border-b-2 text-sm font-semibold transition-colors duration-200",
                      isActive
                        ? "border-forest text-forest"
                        : "border-transparent hover:border-forest hover:text-forest",
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="-mr-2.5 flex items-center gap-1 md:mr-0 md:ml-auto md:gap-6">
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
          <ul className="flex h-[42px] items-center gap-6 lg:gap-8">
            {CATEGORY_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-flex min-h-[42px] items-center border-b-2 border-transparent text-xs font-semibold transition-colors duration-200 hover:border-forest hover:text-forest"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
