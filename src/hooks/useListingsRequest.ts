import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  fetchListings,
  selectListingsError,
  selectListingsStatus,
} from '../redux/slices/listingsSlice'

export interface ListingsRequest {
  /** True until the first fetch settles (`idle` counts, so there is no flash of empty state). */
  isLoading: boolean
  error: string | null
  retry: () => void
}

/**
 * Loads listings once per app session and exposes the request state.
 * Safe to call from several components: the thunk skips duplicate in-flight requests.
 */
export function useListingsRequest(): ListingsRequest {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectListingsStatus)
  const error = useAppSelector(selectListingsError)

  useEffect(() => {
    if (status === 'idle') void dispatch(fetchListings())
  }, [status, dispatch])

  return {
    isLoading: status === 'idle' || status === 'loading',
    error: status === 'failed' ? error : null,
    retry: () => void dispatch(fetchListings()),
  }
}
