import { Link, type LinkProps } from 'react-router'
import { buttonClassName, type ButtonStyleOptions } from './buttonStyles'

type ButtonLinkProps = LinkProps & ButtonStyleOptions

/** Router link styled as a button – use for navigation, `Button` for actions. */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      className={buttonClassName({ variant, size, fullWidth, className })}
    />
  )
}
