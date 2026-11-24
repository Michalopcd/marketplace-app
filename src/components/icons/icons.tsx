import { IconBase, type IconProps } from './IconBase'

/* Navigation icons from the NÓW Figma Make icon set. */

export function MenuIcon(props: IconProps) {
  return (
    <IconBase size={22} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase size={22} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <IconBase size={18} {...props}>
      <path d="M12 5v14M5 12h14" strokeWidth={1.8} />
    </IconBase>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.5" strokeWidth={1.6} />
      <path d="M4.8 20c.6-4 3-6 7.2-6s6.6 2 7.2 6" strokeWidth={1.6} />
    </IconBase>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </IconBase>
  )
}

export function FilterIcon(props: IconProps) {
  return (
    <IconBase size={18} {...props}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </IconBase>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase size={18} {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <IconBase size={16} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5M12 16h.01" />
    </IconBase>
  )
}

export function ArrowIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </IconBase>
  )
}
