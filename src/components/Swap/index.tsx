import { useContext } from 'react'

import { SwapCurrencyButton } from '../Button/SwapCurrencyButton'

import { ConnectWallet } from './ConnectWallet'
import { Currency } from './Currency'
import { PathFlow } from './PathFlow'
import { Slippage } from './Slippage'
import { SwapButton } from './SwapButton'

import { AuthContext } from '@/context/authContext'
import { SwapContext } from '@/context/swapContext'
import { useSwap } from '@/hooks/useSwap'

export const Swap = () => {
  const { state } = useContext(AuthContext)
  const { switchCurrencies, bestRoute, bestPrice, swapPrice } = useContext(SwapContext)
  const { swap } = useSwap()

  const handleSwap = async () => {
    console.log(await swap())
  }
  return (
    <div className='w-full max-w-[450px]'>
      <div className='card flex flex-col gap-6 rounded-xl bg-base-200 p-4 shadow-xl'>
        {!state && <ConnectWallet />}
        {state && (
          <>
            <div className='relative flex flex-col gap-4'>
              <Currency type='from' />
              <div className='absolute inset-1/2 m-auto'>
                <SwapCurrencyButton onClick={switchCurrencies} />
              </div>
              <Currency type='to' />
            </div>
            <div className='-my-4 flex items-center justify-between'>
              <Slippage />
              <div>
                <div>SwapPrice: {swapPrice}</div>
                <div>BestPrice: {bestPrice}</div>
              </div>
            </div>
            <SwapButton onClick={handleSwap} />
          </>
        )}
      </div>
      {!!bestRoute && (
        <>
          <div className='mt-12' />
          <PathFlow path={bestRoute} />
        </>
      )}
    </div>
  )
}
