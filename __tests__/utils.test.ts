import { describe, it, expect } from 'vitest'
import { formatCurrency, formatNumber } from '../lib/utils'

describe('Utility Functions', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000')
    expect(formatCurrency(1234.56)).toBe('$1,235')
    expect(formatCurrency(0)).toBe('$0')
  })

  it('should format numbers correctly', () => {
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber(0)).toBe('0')
  })
})
