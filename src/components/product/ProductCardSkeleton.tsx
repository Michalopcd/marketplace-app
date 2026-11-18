const shimmer =
  'block animate-shimmer motion-reduce:animate-none bg-[linear-gradient(90deg,var(--color-skeleton)_25%,var(--color-skeleton-highlight)_50%,var(--color-skeleton)_75%)] bg-[length:200%_100%]'

/** Placeholder with the same footprint as `ProductCard`. Hidden from assistive tech. */
export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2.5">
      <span className={`${shimmer} aspect-[4/5]`} />
      <span className={`${shimmer} mt-1 h-2 w-[58%]`} />
      <span className={`${shimmer} h-3.5 w-[82%]`} />
      <span className={`${shimmer} h-2 w-[42%]`} />
    </div>
  )
}
