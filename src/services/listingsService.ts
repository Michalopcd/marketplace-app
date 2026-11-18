import { mockListings } from '../data/mockListings'
import type { Listing } from '../types/listing'

/**
 * Mock data source for listings (Sprint 1–2).
 * Keeps the async contract of the future Firestore service so callers won't change.
 */
export const MOCK_LATENCY_MS = 300

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getListings(
  latencyMs: number = MOCK_LATENCY_MS,
): Promise<Listing[]> {
  await wait(latencyMs)
  return structuredClone([...mockListings])
}
