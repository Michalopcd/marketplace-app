/**
 * Every image shipped in `public/images/`, as root-relative URLs (`/images/...`).
 * Uses Vite's glob at build time, so tests can check for broken image paths
 * without Node file-system APIs. The modules are never loaded.
 */
const PUBLIC_IMAGES = new Set(
  Object.keys(import.meta.glob('/public/images/**/*.webp')).map((path) =>
    path.replace(/^\/public/, ''),
  ),
)

export function isShippedImage(src: string): boolean {
  return PUBLIC_IMAGES.has(src)
}
