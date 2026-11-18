import { Link } from 'react-router'

export function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold text-neutral-500">Błąd 404</p>
      <h1 className="text-3xl font-bold">Nie znaleziono strony</h1>
      <p className="text-base text-neutral-600">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-md px-4 font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Wróć na stronę główną
      </Link>
    </section>
  )
}
