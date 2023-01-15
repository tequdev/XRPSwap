import { Swap } from '@/app/components/Swap'
import { SwapContextProvider } from '@/app/context/swapContext'

const Home = () => {
  return (
    <div className='py-28'>
      <div className='mb-6 text-center text-5xl'>xLedger Swap</div>
      <div className='flex justify-center'>
        <SwapContextProvider>
          <Swap />
        </SwapContextProvider>
      </div>
    </div>
  )
}

export default Home
