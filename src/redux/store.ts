import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { listingsReducer } from './slices/listingsSlice'

/* Further slices (auth, user, favorites, search) are added in the sprints that need them. */
const rootReducer = combineReducers({
  listings: listingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

/** Store factory – lets tests create isolated stores with preloaded state. */
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
