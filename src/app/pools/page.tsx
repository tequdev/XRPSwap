import PageTitle from '../components/common/PageTitle'

import AccountPools from './AccountPools'
import LedgerPools from './LedgerPools'

const Pools = async () => {
  return (
    <>
      <PageTitle>Pools</PageTitle>
      <div className='flex justify-center'>
        {/* Search Pool */}
        <LedgerPools />
        {/* Your Pools */}
        <AccountPools />
      </div>
    </>
  )
}

export default Pools
