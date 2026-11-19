import { IconBase, type IconProps } from './IconBase'

interface HeartIconProps extends IconProps {
  filled?: boolean
}

export function HeartIcon({ filled = false, ...props }: HeartIconProps) {
  return (
    <IconBase {...props} fill={filled ? 'currentColor' : 'none'}>
      <path
        d="M20.8 5.7c-2.1-2.2-5.6-2.2-7.8 0L12 6.8l-1.1-1.1a5.48 5.48 0 0 0-7.8 7.7L12 22l8.8-8.6a5.48 5.48 0 0 0 0-7.7Z"
        strokeWidth={1.55}
      />
    </IconBase>
  )
}
