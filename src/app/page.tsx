import PageTitle from './components/common/PageTitle'

import Swap from '@/app/components/Swap'
import SwapContextProvider from '@/app/context/swapContext'

const Home = () => {
  return (
    <>
      <PageTitle>Swap</PageTitle>
      <div className='flex justify-center'>
        <SwapContextProvider>
          <Swap />
        </SwapContextProvider>
      </div>
    </>
  )
}

export default Home
