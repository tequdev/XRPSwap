import { useContext, useMemo } from 'react'

import { SwapContext } from '@/context/swapContext'

export const PriceInfo = () => {
  const { bestPrice, swapPrice } = useContext(SwapContext)
  const fixedSlippage = useMemo(() => ((1 - swapPrice / bestPrice) * 100).toFixed(2) + '%', [bestPrice, swapPrice])
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex w-full justify-around'>
          <div className='flex w-5/12 flex-col'>
            <label htmlFor='swapPrice' className='text-xs'>
              Swap Price
            </label>
            <span id='swapPrice'>{swapPrice.toLocaleString()}</span>
          </div>
          <div className='flex w-5/12 flex-col'>
            <label htmlFor='bestPrice' className='text-xs'>
              Best Price
            </label>
            <span id='bestPrice'>{bestPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className='mt-1 flex justify-end'>
        <div className='flex flex-col'>
          <label htmlFor='slippage' className='text-xs'>
            Slippage
          </label>
          <span id='slippage' className='text-xl font-semibold'>
            {fixedSlippage}
          </span>
        </div>
      </div>
    </>
  )
}
