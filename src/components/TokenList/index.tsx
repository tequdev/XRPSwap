import { Token } from './Token'

import { useTokenMarketData } from '@/hooks/useTokenMarketData'

export const TokenList = () => {
  const { data } = useTokenMarketData()
  return (
    <div className='w-full max-w-[700px]'>
      {data.map((token) => {
        return <Token key={`${token.currency}.${token.issuer}`} data={token} />
      })}
    </div>
  )
}
