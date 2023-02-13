import PageTitle from '../components/common/PageTitle'

import AccountPools from './AccountPools'

const Pools = async () => {
  // const tokens = await getTokensMarketData()
  // useAccountPools()
  return (
    <>
      <PageTitle>Pools</PageTitle>
      <div className='flex justify-center'>
        {/* Search Pool */}
        {/* Your Pools */}
        <AccountPools />
      </div>
    </>
  )
}

export default Pools
