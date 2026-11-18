import { Outlet } from 'react-router'

/** App shell. Navigation and Footer are added in Sprint 1.3 (#3). */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
