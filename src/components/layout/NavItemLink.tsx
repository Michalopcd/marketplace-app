import { Link, useLocation } from 'react-router'
import { isNavTargetActive } from '../../utils/paths'
import type { NavItem } from './navigationLinks'

interface NavItemLinkProps {
  item: NavItem
  /** Full class list for each state – keeps conflicting utilities out of `cn`. */
  className: (isActive: boolean) => string
}

/**
 * Link that marks itself as the current page by path *and* category filters.
 * `NavLink` compares only the pathname, which would light up every category.
 */
export function NavItemLink({ item, className }: NavItemLinkProps) {
  const isActive = isNavTargetActive(item.to, useLocation())

  return (
    <Link
      to={item.to}
      aria-current={isActive ? 'page' : undefined}
      className={className(isActive)}
    >
      {item.label}
    </Link>
  )
}
