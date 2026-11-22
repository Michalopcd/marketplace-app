import { Link } from "react-router";
import { APP_NAME } from "../../utils/constants";
import { Container } from "../ui/Container";
import { Logo } from "./Logo";
import { FOOTER_GROUPS } from "./navigationLinks";

export function SiteFooter() {
  return (
    <footer className="bg-pine text-white">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-[2fr_1fr_1fr] md:gap-14 md:py-[68px]">
        <div className="col-span-2 md:col-span-1">
          <Logo light />
          <p className="mt-4 max-w-60 font-display text-lg leading-snug text-mist">
            Dobre rzeczy zostają z nami na dłużej.
          </p>
        </div>

        {FOOTER_GROUPS.map(({ title, items }) => (
          <nav key={title} aria-label={title}>
            <h2 className="mb-3 text-[11px] font-bold tracking-[0.14em] uppercase">
              {title}
            </h2>
            <ul>
              {items.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    // min-w-11: short labels ("Dom", "Inne") still get a 44×44 px target.
                    className="inline-flex min-h-11 min-w-11 items-center text-sm text-mist transition-colors duration-200 hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <Container className="flex min-h-14 flex-wrap items-center justify-between gap-x-4 border-t border-white/10 text-xs text-mist">
        <p>
          © {new Date().getFullYear()} {APP_NAME}
        </p>
        <p>Polska / PLN</p>
      </Container>
    </footer>
  );
}
