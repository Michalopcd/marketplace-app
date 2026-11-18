type ClassValue = string | false | null | undefined

/**
 * Joins truthy class names – a tiny local alternative to `clsx`.
 * It does NOT resolve conflicting Tailwind utilities (e.g. `w-full` vs `w-auto`):
 * the winner depends on CSS order, not string order. Components therefore accept
 * `className` only for additive classes such as margins or positioning.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
