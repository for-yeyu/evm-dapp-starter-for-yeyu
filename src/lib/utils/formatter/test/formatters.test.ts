import { describe, expect, it } from 'vitest'
import { formatLongText, formatNumber, formatTime } from '../formatters'

describe('formatTime', () => {
  it.each([null, undefined])('returns a placeholder for %s', value => {
    expect(formatTime(value)).toBe('-')
  })

  it('formats a valid timestamp', () => {
    const result = formatTime(Date.UTC(2024, 0, 2, 3, 4, 5))

    expect(result).toContain('2024')
    expect(result).not.toBe('-')
  })

  it('formats a timestamp in UTC', () => {
    expect(formatTime(Date.UTC(2024, 0, 2, 3, 4, 5), { utc: true })).toContain('UTC')
  })

  it('formats a timestamp in the short format', () => {
    expect(formatTime(Date.UTC(2024, 0, 2, 3, 4, 5), { short: true })).toContain('2024-01-02')
  })
})

describe('formatNumber', () => {
  test('type works', () => {
    expect(formatNumber('1.234', { type: 'standard' })).toBe('1.234')
    expect(formatNumber('-1.234', { type: 'standard' })).toBe('-1.234')
    expect(formatNumber('Infinity', { type: 'standard' })).toBe('Infinity')
    expect(formatNumber('-Infinity', { type: 'standard' })).toBe('-Infinity')

    expect(formatNumber('1.234', { type: 'compact' })).toBe('1.234')
    expect(formatNumber('12345678', { type: 'compact', precision: 6 })).toBe('12.3457m')
    expect(formatNumber('1234567890123456', { type: 'compact', precision: 6 })).toBe('1.23457e15')
    expect(formatNumber('-1234567890123456', { type: 'compact', precision: 6 })).toBe('-1.23457e15')
    expect(formatNumber('Infinity', { type: 'compact' })).toBe('Infinity')
    expect(formatNumber('-Infinity', { type: 'compact' })).toBe('-Infinity')
    expect(formatNumber('999999', { type: 'compact', precision: 6 })).toBe('999.999k')
    expect(formatNumber('9999999', { type: 'compact', precision: 6 })).toBe('10m')

    expect(formatNumber('1.234', { type: 'percent' })).toBe('123.4%')
    expect(formatNumber('-1.234', { type: 'percent' })).toBe('-123.4%')
    expect(formatNumber('Infinity', { type: 'percent' })).toBe('Infinity%')
    expect(formatNumber('-Infinity', { type: 'percent' })).toBe('-Infinity%')
    expect(formatNumber('Infinity', { decimals: 2 })).toBe('Infinity')
  })

  test('forceApproxSymbol works', () => {
    expect(formatNumber('1', { forceApproxSymbol: true })).toBe('~1')
  })

  test('forceSign works', () => {
    expect(formatNumber('1', { forceSign: true })).toBe('+1')
    expect(formatNumber('1', { forceSign: false })).toBe('1')
    expect(formatNumber('0', { forceSign: true })).toBe('+0')
    expect(formatNumber('0', { forceSign: false })).toBe('0')
    expect(formatNumber('-1', { forceSign: true })).toBe('-1')
    expect(formatNumber('-1', { forceSign: false })).toBe('-1')
  })

  test('lowerLimit works', () => {
    expect(formatNumber('0.01', { lowerLimit: 1e-2 })).toBe('0.01')
    expect(formatNumber('0.01', { lowerLimit: 1e-1 })).toBe('<0.1')
    expect(formatNumber('-0.01', { lowerLimit: 1e-2 })).toBe('-0.01')
    expect(formatNumber('-0.01', { lowerLimit: 1e-1 })).toBe('>-0.1')
  })

  test('upperLimit works', () => {
    expect(formatNumber('1000000', { upperLimit: 1e6 })).toBe('1,000,000')
    expect(formatNumber('1000000', { upperLimit: 1e5 })).toBe('>100,000')
    expect(formatNumber('-1000000', { upperLimit: 1e6 })).toBe('-1,000,000')
    expect(formatNumber('-1000000', { upperLimit: 1e5 })).toBe('<-100,000')
  })

  test('symbol works', () => {
    expect(formatNumber('1', { symbol: '$' })).toBe('$1')
    expect(formatNumber('1', { symbol: ['', '€'] })).toBe('1€')
  })

  test('precision works', () => {
    expect(formatNumber('1.234', { precision: 2 })).toBe('1.2')
  })

  test('precision and decimals work together', () => {
    expect(formatNumber('1.2345', { precision: 3, decimals: 2 })).toBe('1.23')
  })

  test('decimals works', () => {
    expect(formatNumber('1.234', { decimals: 2 })).toBe('1.23')
  })

  test('null rounding mode uses the default rounding mode', () => {
    expect(formatNumber('1.2345', { precision: 3, decimals: 3, roundingMode: null })).toBe('1.23')
  })

  test('roundingMode works', () => {
    expect(formatNumber('1.2345', { decimals: 3, roundingMode: 'up' })).toBe('1.235')
    expect(formatNumber('1.2345', { decimals: 3, roundingMode: 'down' })).toBe('1.234')
    expect(formatNumber('1.2345', { decimals: 3, roundingMode: 'half-up' })).toBe('1.235')
  })

  test('useGroupSeparator works', () => {
    expect(formatNumber('1234', { useGroupSeparator: true })).toBe('1,234')
    expect(formatNumber('1234', { useGroupSeparator: false })).toBe('1234')
  })

  test('trimTrailingZero works', () => {
    expect(formatNumber('1.234', { decimals: 5, trimTrailingZero: true })).toBe('1.234')
    expect(formatNumber('1.234', { decimals: 5, trimTrailingZero: false })).toBe('1.23400')
    expect(formatNumber('1.234', { precision: 5, trimTrailingZero: true })).toBe('1.234')
    expect(formatNumber('1.234', { precision: 5, trimTrailingZero: false })).toBe('1.2340')
  })

  test('defaultText works', () => {
    expect(formatNumber(1, { defaultText: 'NaN' })).toBe('1')
    expect(formatNumber(NaN, { defaultText: 'NaN' })).toBe('NaN')
    expect(formatNumber('', { defaultText: 'NaN' })).toBe('NaN')
    expect(formatNumber('abc', { defaultText: 'NaN' })).toBe('NaN')
    expect(formatNumber(null, { defaultText: 'NaN' })).toBe('NaN')
    expect(formatNumber(undefined, { defaultText: 'NaN' })).toBe('NaN')
  })
})

describe('formatLongText', () => {
  it.each([null, undefined])('returns a placeholder for %s', value => {
    expect(formatLongText(value)).toBe('-')
  })

  test('works', () => {
    expect(formatLongText('12345678900987654321')).toBe('12345678...87654321')
    expect(formatLongText('12345678900987654321', { headTailLength: 40 })).toBe(
      '12345678900987654321',
    )
    expect(formatLongText('12345678900987654321', { headTailLength: 4 })).toBe('1234...4321')
    expect(formatLongText('12345678900987654321', { headLength: 4 })).toBe('1234...87654321')
    expect(formatLongText('12345678900987654321', { tailLength: 4 })).toBe('12345678...4321')
    expect(formatLongText('1234567😊900987654321')).toBe('1234567😊...87654321')
  })
})

describe('formatNumber exponent normalization', () => {
  it('normalizes a compact value that rounds into the next exponent', () => {
    expect(formatNumber('9999999999999999', { type: 'compact', decimals: 0 })).toBe('1e16')
  })

  it.each([
    ['9999500000000000', '1e16'],
    ['-9999500000000000', '-1e16'],
  ])('normalizes %s after decimal rounding', (value, expected) => {
    expect(formatNumber(value, { type: 'compact', decimals: 3 })).toBe(expected)
  })
})
