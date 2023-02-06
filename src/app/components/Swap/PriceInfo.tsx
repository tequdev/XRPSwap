import { useContext, useMemo } from 'react'

import { SwapContext } from '@/app/context/swapContext'
import { significantDigits } from '@/utils/number'

export const PriceInfo = () => {
  const { bestPrice, swapPrice } = useContext(SwapContext)
  const slippage = useMemo(() => Math.abs((1 - swapPrice / bestPrice) * 100), [bestPrice, swapPrice])
  const fixedSlippage = useMemo(() => slippage.toFixed(2) + '%', [slippage])
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex w-full justify-around'>
          <div className='flex w-5/12 flex-col'>
            <label htmlFor='swapPrice' className='text-xs'>
              Swap Price
            </label>
            <span id='swapPrice'>{significantDigits(swapPrice, 4)}</span>
          </div>
          <div className='flex w-5/12 flex-col'>
            <label htmlFor='bestPrice' className='text-xs'>
              Best Price
            </label>
            <span id='bestPrice'>{significantDigits(bestPrice, 4)}</span>
          </div>
        </div>
      </div>
      <div className='mt-1 flex justify-end'>
        <div className='flex flex-col'>
          <label htmlFor='slippage' className='text-xs'>
            Slippage
          </label>
          <span id='slippage' className='text-xl font-semibold'>
            {(isFinite(slippage) && fixedSlippage) || (
              <div className='w-full text-center'>
                <span className='animate-ping text-center'>...</span>
              </div>
            )}
          </span>
        </div>
      </div>
    </>
  )
}
