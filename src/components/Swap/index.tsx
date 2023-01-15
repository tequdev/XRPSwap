'use client'
import { useContext } from 'react'

import { SwapCurrencyButton } from '../Button/SwapCurrencyButton'

import { ConnectWallet } from './ConnectWallet'
import { Currency } from './Currency'
// import { PathFlow } from './PathFlow'
import { PriceInfo } from './PriceInfo'
import { SwapButton } from './SwapButton'

import { AuthContext } from '@/app/context/authContext'
import { SwapContext } from '@/app/context/swapContext'
import { usePayloadOpen } from '@/hooks/usePayloadOpen'
import { useSwap } from '@/hooks/useSwap'

export const Swap = () => {
  const { state } = useContext(AuthContext)
  const { switchCurrencies, bestRoute } = useContext(SwapContext)
  const { swap } = useSwap()
  const { openWindow } = usePayloadOpen()

  const handleSwap = async () => {
    const payload = await swap()
    if (payload) {
      openWindow(payload.next.always)
    }
  }
  return (
    <div className='flex w-full max-w-[450px] flex-col items-center'>
      {!state && (
        <div className='mt-8'>
          <ConnectWallet />
        </div>
      )}
      {state && (
        <div className='card flex flex-col justify-center gap-6 rounded-xl bg-base-200 p-4 shadow-xl'>
          <>
            <div className='relative flex flex-col gap-4'>
              <Currency type='from' />
              <div className='absolute inset-1/2 m-auto'>
                <SwapCurrencyButton onClick={switchCurrencies} />
              </div>
              <Currency type='to' />
            </div>
            <div className='collapse-arrow !min-h-6 collapse -my-4'>
              <input type='checkbox' className='!min-h-6' />
              <div className='collapse-title !min-h-6 py-2 text-sm'>Show Price Info</div>
              <div className='collapse-content'>
                <PriceInfo />
              </div>
            </div>
            <SwapButton onClick={handleSwap} />
          </>
        </div>
      )}
      {/* {!!bestRoute && (
        <>
          <div className='mt-12' />
          <PathFlow path={bestRoute} />
        </>
      )} */}
    </div>
  )
}
