import { describe, it, expect } from 'vitest'

describe('Project setup', () => {
  it('should have a working test environment', () => {
    expect(true).toBe(true)
  })

  it('should have jsdom environment available', () => {
    expect(typeof document).toBe('object')
    expect(typeof window).toBe('object')
  })
})
