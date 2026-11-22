import { ButtonLink } from "./ButtonLink";
import { Eyebrow } from "./Eyebrow";

interface Props {
  /** Used by the section's `aria-labelledby`. */
  id: string;
  eyebrow: string;
  title: string;
  /** Optional "see more" link on the right. */
  action?: { label: string; to: string };
}

/** Eyebrow + h2 + optional text link on the right, as in the Figma Make sections. */
export function SectionHeading({ id, eyebrow, title, action }: Props) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 md:mb-9">
      <div>
        <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
        <h2
          id={id}
          className="font-display text-[30px] leading-[1.1] tracking-[-0.025em] md:text-[38px]"
        >
          {title}
        </h2>
      </div>

      {action && (
        <ButtonLink to={action.to} variant="text" className="shrink-0">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}
