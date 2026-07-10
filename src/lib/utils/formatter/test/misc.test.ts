import { amountToRawAmount, notNullish, rawAmountToAmount } from '../misc'

describe('rawAmountToAmount', () => {
  test('converts raw amount with decimals', () => {
    expect(rawAmountToAmount(1234500000000000000n, 18)).toBe('1.2345')
    expect(rawAmountToAmount(123n, 0)).toBe('123')
  })

  test('supports very small and negative values', () => {
    expect(rawAmountToAmount(1n, 18)).toBe('0.000000000000000001')
    expect(rawAmountToAmount(-12345n, 2)).toBe('-123.45')
  })
})

describe('amountToRawAmount', () => {
  test('converts amount to raw amount with decimals', () => {
    expect(amountToRawAmount('1.2345', 18)).toBe(1234500000000000000n)
    expect(amountToRawAmount('123', 0)).toBe(123n)
  })

  test('rounds toward zero for extra decimals', () => {
    expect(amountToRawAmount('1.239', 2)).toBe(123n)
    expect(amountToRawAmount('-1.239', 2)).toBe(-123n)
  })
})

describe('notNullish', () => {
  test('removes null and undefined only', () => {
    expect(notNullish(0)).toBe(true)
    expect(notNullish('')).toBe(true)
    expect(notNullish(false)).toBe(true)
    expect(notNullish(null)).toBe(false)
    expect(notNullish(undefined)).toBe(false)

    const list = [0, '', false, null, undefined, 'ok']
    expect(list.filter(notNullish)).toEqual([0, '', false, 'ok'])
  })
})
