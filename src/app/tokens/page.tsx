import PageTitle from '../components/common/PageTitle'

import { TokenList } from '@/app/components/TokenList'
import { getTokensMarketData } from '@/libs/xrpl'

const Tokens = async () => {
  const tokens = await getTokensMarketData()
  return (
    <>
      <PageTitle>Issued Tokens</PageTitle>
      <div className='flex justify-center'>
        <TokenList tokens={tokens} />
      </div>
    </>
  )
}

export default Tokens
