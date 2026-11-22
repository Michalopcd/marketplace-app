import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { setupStore, type AppStore, type RootState } from '../redux/store'

interface Options {
  preloadedState?: Partial<RootState>
  store?: AppStore
  route?: string
}

/** Renders UI inside a fresh Redux store and a memory router (DOM tests only). */
export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, store = setupStore(preloadedState), route = '/' }: Options = {},
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
  }
}
