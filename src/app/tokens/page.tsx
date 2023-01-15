import { TokenList } from '@/app/components/TokenList'
import { getTokensMarketData } from '@/libs/xrpl'

const Tokens = async () => {
  const tokens = await getTokensMarketData()
  return (
    <>
      <div className='mb-10 text-center text-5xl md:mb-6'>xLedger Tokens</div>
      <div className='flex justify-center'>
        <TokenList tokens={tokens} />
      </div>
    </>
  )
}

export default Tokens
