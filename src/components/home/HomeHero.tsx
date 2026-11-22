import { PATHS } from "../../utils/paths";
import { ButtonLink } from "../ui/ButtonLink";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { HERO } from "./homeContent";

const HEADING_ID = "hero-heading";

/** Decorative leaf outline from the Figma Make hero. */
function LeafMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 90 90"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
    >
      <path d="M75 14C36 15 15 35 14 75c39 0 61-22 61-61Z" />
      <path d="M22 67c17-17 29-27 45-43" />
    </svg>
  );
}

/**
 * Boxed mint hero: text and buttons on the left,
 * photo with a badge on the right.
 * Stacked layout on mobile.
 */
export function HomeHero() {
  return (
    <section aria-labelledby={HEADING_ID} className="group/hero">
      <Container className="grid bg-mint max-md:w-full md:grid-cols-[0.91fr_1.09fr] lg:min-h-[590px]">
        <div className="flex flex-col justify-center px-6 pt-11 pb-9 md:px-[30px] md:py-12 lg:py-16 lg:pr-[52px] lg:pl-16">
          <Eyebrow className="mb-3.5 md:mb-5">{HERO.eyebrow}</Eyebrow>

          <h1
            id={HEADING_ID}
            className="max-w-[560px] font-display text-[49px] leading-[0.98] tracking-[-0.035em] lg:text-[clamp(54px,5vw,74px)] lg:leading-[0.97]"
          >
            <span className="block">{HERO.titleLead}</span>{" "}
            <em className="block text-fern">{HERO.titleAccent}</em>
          </h1>

          <p className="mt-5 max-w-[475px] text-sm leading-[1.8] text-muted lg:mt-[26px]">
            {HERO.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3.5 lg:mt-8 lg:items-center">
            <ButtonLink to={PATHS.marketplace} className="whitespace-nowrap">
              {HERO.primaryCta}
            </ButtonLink>

            <ButtonLink
              to={PATHS.createListing}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {HERO.secondaryCta}
            </ButtonLink>
          </div>
        </div>

        <div className="relative h-[347px] min-w-0 px-4 pb-4 md:h-auto md:py-[26px] md:pr-[26px] md:pl-0">
          {/* The text column determines the row height on desktop. */}
          <div className="relative h-full overflow-hidden">
            <img
              src={HERO.image.src}
              alt={HERO.image.alt}
              width={1200}
              height={1500}
              fetchPriority="high"
              className="absolute inset-0 size-full object-cover object-[center_45%] transition-transform duration-700 group-hover/hero:scale-[1.015] md:object-[center_41%]"
            />
          </div>

          {/* Yellow environmental badge */}
          <p className="absolute right-8 bottom-[31px] flex size-[92px] -rotate-[7deg] flex-col items-center justify-center rounded-full bg-sun text-center text-forest md:right-auto md:bottom-[78px] md:-left-[31px] md:size-[116px]">
            <span className="text-[9px] tracking-[0.08em] uppercase md:text-[10px]">
              {HERO.badge.lead}
            </span>{" "}
            <strong className="font-display text-sm font-normal md:text-[17px]">
              {HERO.badge.accent}
            </strong>
          </p>

          {/* Decorative leaf */}
          <LeafMark className="absolute top-[17px] right-8 w-[49px] text-white opacity-80 md:top-[41px] md:right-[42px] md:w-[65px]" />
        </div>
      </Container>
    </section>
  );
}
