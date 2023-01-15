import { Swap } from '@/app/components/Swap'
import { SwapContextProvider } from '@/app/context/swapContext'
import { TokenContextProvider } from '@/app/context/tokenContext'

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
