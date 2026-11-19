
import { Link } from 'react-router'
import { cn } from '../../utils/cn'
import { APP_NAME } from '../../utils/constants'
import { PATHS } from '../../utils/paths'

interface Props {
  light?: boolean
  className?: string
}

export function Logo({ light = false, className }: Props) {
  return (
    <Link
      to={PATHS.home}
      aria-label={`${APP_NAME} - strona główna`}
      className={cn(
        'inline-flex min-h-11 items-center font-logo text-[35px] font-bold leading-none tracking-[-0.05em] transition-opacity hover:opacity-80 md:text-[39px]',
        light ? 'text-white' : 'text-ink',
        className,
      )}
    >
      NÓW
    </Link>
  )
}

