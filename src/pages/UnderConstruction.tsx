import { APP_NAME } from '../utils/constants'

/** Temporary index page – replaced by the HOME page in Sprint 1.4 (#4). */
export function UnderConstruction() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">{APP_NAME}</h1>
      <p className="text-base text-neutral-600">Strona w budowie.</p>
    </section>
  )
}
