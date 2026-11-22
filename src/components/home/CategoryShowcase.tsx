import { Link } from "react-router";
import type { CategorySummary } from "../../redux/slices/listingsSlice";
import { formatOfferCount } from "../../utils/formatting";
import { marketplacePath, PATHS } from "../../utils/paths";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { CATEGORIES_SECTION } from "./homeContent";

const HEADING_ID = "categories-heading";

interface Props {
  categories: readonly CategorySummary[];
  /** Offer counts are shown only once listings have loaded successfully. */
  showCounts: boolean;
}

/**
 * Category cards: a swipeable row (scroll-snap) below `lg`, a 7-column grid above.
 * Each category has its own representative cover photo (see `CATEGORY_ENTRIES`).
 */
export function CategoryShowcase({ categories, showCounts }: Props) {
  return (
    <section aria-labelledby={HEADING_ID} className="py-[62px] md:py-[94px]">
      <Container>
        <SectionHeading
          id={HEADING_ID}
          eyebrow={CATEGORIES_SECTION.eyebrow}
          title={CATEGORIES_SECTION.title}
          action={{ label: CATEGORIES_SECTION.action, to: PATHS.marketplace }}
        />

        {/* Bleeds to the right screen edge while scrolling, like the Figma mobile layout. */}
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1.5 [scrollbar-width:none] max-md:-mr-4 max-md:pr-4 md:max-lg:-mr-8 md:max-lg:pr-8 lg:grid lg:grid-cols-7 lg:gap-[17px] lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {categories.map(({ key, label, filter, count, image }) => (
            <li key={key} className="w-[158px] flex-none snap-start lg:w-auto">
              {/*
                The scroll container would clip an outset focus outline, so focus is shown
                as an inset outline on the photo (drawn above it) plus an underlined name.
              */}
              <Link
                to={marketplacePath(filter)}
                className="group block focus-visible:outline-none"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-cream group-focus-visible:outline-[3px] group-focus-visible:outline-offset-[-3px] group-focus-visible:outline-forest">
                  <img
                    src={image}
                    alt=""
                    width={640}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-2.5 font-display text-base underline-offset-4 transition-colors duration-200 group-hover:text-forest group-focus-visible:text-forest group-focus-visible:underline md:mt-[15px] md:text-lg">
                  {label}
                </h3>
                <p className="mt-0.5 min-h-4 text-xs text-muted">
                  {showCounts ? formatOfferCount(count) : null}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
