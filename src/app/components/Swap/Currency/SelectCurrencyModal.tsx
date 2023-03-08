import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useContext } from 'react'
import { overrideTailwindClasses } from 'tailwind-override'
import { Currency } from 'xrpl/dist/npm/models/common'

import { CloseIcon } from '../../Icon/Close'

import { CurrencyInfo } from '@/@types/xrpl'
import { SwapContext } from '@/app/context/swapContext'
import { TokenContext } from '@/app/context/tokenContext'

type Props = {
  onSelect: (currency: CurrencyInfo) => void
  onClose: () => void
  current: Currency
}

export const SelectCurrencyModal: FC<Props> = ({ onSelect, onClose }) => {
  const router = useRouter()
  const { currencies: allCurrencies, loading } = useContext(TokenContext)
  const { currencies } = useContext(SwapContext)
  return (
    <div className='mx-2 box-border h-[36rem] w-full min-w-[300px] rounded-3xl border-4 border-white bg-white px-4 py-6 shadow md:mx-auto md:w-[450px]'>
      <div className='flex h-12 justify-between text-2xl font-bold'>
        <div>Select Currency</div>
        <div>
          <button className='btn-ghost btn-square btn-sm btn' onClick={onClose}>
            <CloseIcon className='h-8 w-8' />
          </button>
        </div>
      </div>
      <div className='h-[calc(100%-48px)] overflow-y-auto overscroll-contain'>
        {loading && (
          <div className='flex h-full w-full items-center justify-center'>
            <div className='h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          </div>
        )}
        {!loading && (
          <>
            {allCurrencies.map((data, index) => {
              const currency = data.currency
              const issuer = (data as any)?.issuer
              const key = currency + issuer
              const isUsed = [currencies.from, currencies.to].some(
                (c) => c.currency === currency && (currency === 'XRP' || (c as any).issuer === issuer)
              )
              return (
                <div
                  key={key}
                  className={overrideTailwindClasses(
                    'my-1 flex gap-2 ' + (isUsed ? 'opacity-50' : 'cursor-pointer hover:md:bg-slate-100')
                  )}
                  onClick={() => (isUsed ? null : onSelect(data))}
                >
                  <div className='flex h-12 w-12 items-center justify-center'>
                    {data.icon && <Image src={data.icon} alt={data.name} unoptimized width={12 * 4} height={12 * 4} />}
                  </div>
                  <div className='truncate'>
                    <span className='block text-lg font-bold'>{data.name}</span>
                    <span className='block text-xs text-gray-500'>{issuer}</span>
                  </div>
                </div>
              )
            })}
            <div
              className={overrideTailwindClasses('my-1 flex gap-2 cursor-pointer hover:md:bg-slate-100')}
              onClick={() => router.push('/tokens')}
            >
              <div className='flex h-12 w-full items-center justify-center truncate'>
                <span className='block text-lg font-semibold text-current'>Find new tokens→</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
