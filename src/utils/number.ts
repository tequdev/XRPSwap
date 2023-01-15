export const significantDigits = (value: number, n: number) => {
  if (value === 0) return '0'
  if (value > 1) {
    const str = value.toString()
    const splitted = str.split('.')
    const [integer, _decimal] = splitted
    if (splitted.length === 1) {
      if (integer.length > n - 1) return str // 1234→'1234'
      return str + '.' + '0'.repeat(n - integer.length) // 123→123.0
    }
    if (integer.length > n - 1) return integer // 1234.56→1234
    return str.slice(0, n + 1).padEnd(n + 1, '0') // 12.3→12.30
  }
  const reg = new RegExp(`(\\d+\\.0*[1-9][0-9]{${n - 1}}).*`)
  const replaced = value.toString().replace(reg, '$1')
  const [integer, decimal] = replaced.split('.')
  const nonZeroIndex = decimal.split('').findIndex((s) => s !== '0')
  return integer + '.' + decimal.padEnd(nonZeroIndex + 1 + n, '0').slice(0, nonZeroIndex + n)
}
