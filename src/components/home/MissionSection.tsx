
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { MISSION } from './homeContent'

const HEADING_ID = 'mission-heading'

/**
 * Forest-green mission section.
 * Responsive layout with a decorative visual element.
 */
export function MissionSection() {
  return (
    <section aria-labelledby={HEADING_ID} className="md:py-[98px]">
      <Container className="grid overflow-hidden bg-forest text-white max-md:w-full md:grid-cols-[0.9fr_1.1fr] lg:min-h-[390px]">
        <div className="flex flex-col justify-center px-6 pt-14 pb-12 md:py-[60px] md:pr-[10%] md:pl-[13%]">
          <Eyebrow tone="light" className="mb-5">
            {MISSION.eyebrow}
          </Eyebrow>

          <h2
            id={HEADING_ID}
            className="font-display text-[34px] leading-[1.1] tracking-[-0.025em] md:text-[42px]"
          >
            <span className="block">
              {MISSION.titleLines[0]}
            </span>{' '}
            <span className="block">
              {MISSION.titleLines[1]}
            </span>
          </h2>

          <p className="mt-5 max-w-[480px] text-sm leading-[1.75] text-white/80">
            {MISSION.description}
          </p>
        </div>

        <div className="relative flex min-h-[225px] flex-col justify-center border-t border-white/15 bg-[radial-gradient(circle_at_10%_100%,#486c51_0,transparent_43%)] px-6 py-11 after:absolute after:top-[31px] after:right-[29px] after:h-[92px] after:w-[63px] after:rotate-[28deg] after:rounded-[100%_0_100%_0] after:border after:border-white/20 md:order-first md:min-h-0 md:border-t-0 md:border-r md:px-[75px] md:py-[60px] md:after:top-[42px] md:after:right-[38px] md:after:h-[120px] md:after:w-20">
          <div className="flex flex-col">
            <p className="max-w-md font-display text-[36px] leading-tight md:text-[44px]">
              {MISSION.highlight}
            </p>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/80">
              {MISSION.highlightDescription}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
