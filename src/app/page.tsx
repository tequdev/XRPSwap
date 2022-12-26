'use client'
import { Swap } from '@/components/Swap'
import { SwapContextProvider } from '@/context/swapContext'
import { TokenContextProvider } from '@/context/tokenContext'

const Home = () => {
  return (
    <div className='py-28'>
      <div className='mb-6 text-center text-5xl'>xLedger Swap</div>
      <div className='flex justify-center'>
        <TokenContextProvider>
          <SwapContextProvider>
            <Swap />
          </SwapContextProvider>
        </TokenContextProvider>
      </div>
    </div>
  )
}

export default Home
