import { describe, expect, it } from 'vitest'
import { buttonClassName } from './buttonStyles'

describe('buttonClassName', () => {
  it('uses primary variant by default', () => {
    const result = buttonClassName()

    expect(result).toContain('bg-forest')
    expect(result).toContain('min-h-12')
  })

  it('gives filled and outlined buttons the same 8px radius and a smooth hover', () => {
    for (const variant of ['primary', 'secondary'] as const) {
      const classes = buttonClassName({ variant }).split(' ')

      expect(classes).toContain('rounded-lg')
      expect(classes).toContain('transition')
    }

    const primary = buttonClassName().split(' ')
    expect(primary).toContain('hover:bg-forest-dark')
    expect(primary).toContain('hover:not-disabled:-translate-y-px')
  })

  it('keeps the same shape for small and full-width primary buttons', () => {
    const shape = (classes: string) =>
      classes.split(' ').filter((c) => c.startsWith('rounded') || c.startsWith('bg-'))

    expect(shape(buttonClassName({ size: 'sm' }))).toEqual(
      shape(buttonClassName({ fullWidth: true })),
    )
  })

  it('supports secondary variant', () => {
    const result = buttonClassName({ variant: 'secondary' })

    expect(result).toContain('bg-transparent')
    expect(result).toContain('text-forest')
  })

  it('supports small size', () => {
    const result = buttonClassName({ size: 'sm' })

    expect(result).toContain('min-h-11')
    expect(result).toContain('px-4')
  })

  it('supports full width', () => {
    const result = buttonClassName({ fullWidth: true })

    expect(result).toContain('w-full')
  })

  it('does not stretch text variant', () => {
    const result = buttonClassName({
      variant: 'text',
      fullWidth: true,
    })

    expect(result.split(' ')).not.toContain('w-full')
  })

  it('supports additional classes', () => {
    const result = buttonClassName({ className: 'mt-4' })

    expect(result).toContain('mt-4')
  })
})
