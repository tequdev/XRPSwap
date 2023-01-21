import { significantDigits } from './number'

describe('significantDigits', () => {
  const tests = [
    [0, '0'],
    [1, '1.000'],
    [10, '10.00'],
    [1234, '1,234'],
    [12345, '12,345'],
    [1234.56, '1,234'],
    [12.3, '12.30'],
    [12.3456, '12.34'],
    [0.1, '0.1000'],
    [0.10001, '0.1000'],
    [0.1230456, '0.1230'],
    [0.0001, '0.0001000'],
    [0.000123456, '0.0001234'],
    [0.00102304, '0.001023'],
  ] as const
  it.each(tests)('%s', (input, output) => {
    expect(significantDigits(input, 4)).toBe(output)
  })
})
