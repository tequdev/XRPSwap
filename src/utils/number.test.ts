import { significantDigits } from './number'

describe('significantDigits', () => {
  const tests = [
    [10, '10.00'],
    [12345, '12345'],
    [12.3, '12.30'],
    [0, '0'],
    [1234.56, '1234'],
    [12.3456, '12.34'],
    [0.000123456, '0.0001234'],
    [0.0001, '0.0001000'],
    [0.1230456, '0.1230'],
    [0.10001, '0.1000'],
    [0.00206601, '0.002066'],
  ] as const
  it.each(tests)('%s', (input, output) => {
    expect(significantDigits(input, 4)).toBe(output)
  })
})
