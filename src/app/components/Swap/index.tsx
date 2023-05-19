'use client'
import { useContext } from 'react'

import { ConnectWallet } from '../Button/ConnectWallet'
import { SwapCurrencyButton } from '../Button/SwapCurrencyButton'

import { Currency } from './Currency'
// import { PathFlow } from './PathFlow'
import { PriceInfo } from './PriceInfo'
import { SwapButton } from './SwapButton'

import { AuthContext } from '@/app/context/authContext'
import { SwapContext } from '@/app/context/swapContext'
import { useSwap } from '@/hooks/useSwap'

const Swap = () => {
  const { loading, isConnected } = useContext(AuthContext)
  const { switchCurrencies, bestRoute, refetch } = useContext(SwapContext)
  const { swap } = useSwap()

  const handleSwap = async () => {
    const signed = await swap()
    if (signed) {
      refetch()
    }
  }

  return (
    <div className='mx-1 flex w-full flex-col items-center md:max-w-[450px]'>
      {!loading && !isConnected && (
        <div className='mt-8'>
          <ConnectWallet />
        </div>
      )}
      {!loading && isConnected && (
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
            <div className='-mt-4 -mb-2 text-xs text-gray-400'>
              <span>The swap price may vary at the time of transaction signing.</span>
            </div>
          </>
        </div>
      )}
      {/* {!!bestRoute && (
        <div className='mt-12' style={{ width: '500px', height: '500px' }}>
          <PathFlow path={bestRoute} />
        </div>
      )} */}
    </div>
  )
}

export default Swap
