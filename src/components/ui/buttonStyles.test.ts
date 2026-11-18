import { describe, expect, it } from 'vitest'
import { buttonClassName } from './buttonStyles'

describe('buttonClassName', () => {
  it('uses primary variant by default', () => {
    const result = buttonClassName()

    expect(result).toContain('bg-forest')
    expect(result).toContain('min-h-12')
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
