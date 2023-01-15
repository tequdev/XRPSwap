import { Swap } from '@/app/components/Swap'
import { SwapContextProvider } from '@/app/context/swapContext'

const Home = () => {
  return (
    <>
      <div className='mb-10 text-center text-5xl md:mb-6'>Swap</div>
      <div className='flex justify-center'>
        <SwapContextProvider>
          <Swap />
        </SwapContextProvider>
      </div>
    </>
  )
}

export default Home
