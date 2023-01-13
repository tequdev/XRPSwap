import { parseCurrencyCode } from './xrpl'

describe('parseCurrencyCode', () => {
  const tests = [
    {
      input: '',
      output: '',
    },
    {
      input: 'XRP',
      output: 'XRP',
    },
    {
      input: 'MyAwesomeCurrency',
      output: '4D79417765736F6D6543757272656E6379000000',
    },
    {
      input: ' An XRPL NFT????????',
      output: '20416E205852504C204E46543F3F3F3F3F3F3F3F',
    },
    // {
    //   input: 'FakeXRP',
    //   output: 'xrp',
    // },
    // {
    //   input: 'FakeXRP',
    //   output: 'xrP',
    // },
    {
      input: 'CSC',
      output: 'CSC',
    },
    // {
    //   input: 'FakeXRP',
    //   output: '5852500000000000000000000000000000000000',
    // },
    // {
    //   input: 'An XRPL NFT?',
    //   output: '021D001703B37004416E205852504C204E46543F',
    // },
    {
      input: 'JerryCoin',
      output: '4A65727279436F696E0000000000000000000000',
    },
  ]
  it.each(tests)('%s', ({ input, output }) => {
    expect(parseCurrencyCode(input)).toBe(output)
  })
})
