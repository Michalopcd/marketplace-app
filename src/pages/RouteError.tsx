import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

/** Fallback for errors thrown while rendering a route (replaces React Router's default screen). */
export function RouteError() {
  const error = useRouteError()
  const status = isRouteErrorResponse(error) ? error.status : null

  return (
    <main
      id="main-content"
      className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center"
    >
      {status !== null && (
        <p className="text-sm font-semibold text-neutral-500">Błąd {status}</p>
      )}
      <h1 className="text-3xl font-bold">Coś poszło nie tak</h1>
      <p className="text-base text-neutral-600">
        Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.
      </p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-md px-4 font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Wróć na stronę główną
      </Link>
    </main>
  )
}
