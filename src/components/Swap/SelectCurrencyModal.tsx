import { FC, useContext } from 'react'
import { overrideTailwindClasses } from 'tailwind-override'
import { Currency } from 'xrpl/dist/npm/models/common'

import { SwapContext } from '@/context/swapContext'
import { TokenContext } from '@/context/tokenContext'

type Props = {
  onSelect: (currency: Currency) => void
  current: Currency
}

// const CURRENCIES: Currency[] = [
//   { currency: 'XRP' },
//   // { currency: 'JPY', issuer: 'rE5xha1LiHpS6rS7z8RrWGYWKh5pqBUn87' }
//   { currency: 'CSC', issuer: 'rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr' },
// ]

export const SelectCurrencyModal: FC<Props> = ({ onSelect }) => {
  const { currencies: allCurrencies } = useContext(TokenContext)
  const { currencies } = useContext(SwapContext)
  return (
    <div className='h-96 w-[420px] overflow-y-auto rounded-3xl border-4 border-white bg-white px-6 py-8'>
      {allCurrencies.map((data, index) => {
        const currency = data.currency
        const issuer = (data as any)?.issuer
        const key = currency + issuer
        const isUsed = currencies.some(
          (c) => c.currency === currency && (currency === 'XRP' || (c as any).issuer === issuer)
        )
        return (
          <div
            key={key}
            className={overrideTailwindClasses(
              'my-1 flex gap-2 ' + (isUsed ? 'opacity-50' : 'cursor-pointer hover:bg-slate-100')
            )}
            onClick={() => (isUsed ? null : onSelect(data))}
          >
            <div className='flex h-12 w-12 items-center justify-center'>
              <img src={data.icon} alt={data.name} />
            </div>
            <div className='truncate'>
              <span className='block text-lg font-bold'>{data.name}</span>
              <span className='block text-xs text-gray-500'>{issuer}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
