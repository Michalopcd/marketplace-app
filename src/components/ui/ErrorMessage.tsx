import { cn } from '../../utils/cn'
import { Button } from './Button'

interface ErrorMessageProps {
  title?: string
  message: string
  /** When provided, shows a retry button. */
  onRetry?: () => void
  retryLabel?: string
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function ErrorMessage({
  title = 'Coś poszło nie tak',
  message,
  onRetry,
  retryLabel = 'Spróbuj ponownie',
  headingLevel: Heading = 'h2',
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex min-h-80 flex-col items-center justify-center border border-line px-4 py-12 text-center',
        className,
      )}
    >
      <Heading className="font-display text-3xl">{title}</Heading>
      <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-danger">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-6">
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
