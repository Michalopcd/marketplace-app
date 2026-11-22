import { Outlet } from 'react-router'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

const MAIN_CONTENT_ID = 'main-content'

/** App shell: skip link, header, routed page and footer as semantic landmarks. */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only rounded-xs bg-white px-4 py-2.5 text-sm font-semibold shadow-overlay focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Przejdź do treści
      </a>
      <SiteHeader />
      {/* tabIndex lets the skip link move focus into <main> in every browser. */}
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
