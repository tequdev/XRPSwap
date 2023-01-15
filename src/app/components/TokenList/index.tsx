'use client'
import { Token } from './Token'

import { useTokenMarketData } from '@/hooks/useTokenMarketData'

export const TokenList = () => {
  const { page, perPage, data, next, prev, hasNextPage, hasPrevPage } = useTokenMarketData()
  return (
    <div className='w-full max-w-[700px]'>
      <div className='min-h-[40vh]'>
        {data.map((token, index) => (
          <Token key={`${token.currency}.${token.issuer}`} data={token} index={(page - 1) * perPage + index + 1} />
        ))}
      </div>
      <div className='my-8'>
        <div className='btn-group grid grid-cols-2'>
          <button className='btn-outline btn' disabled={!hasPrevPage} onClick={prev}>
            Prev
          </button>
          <button className='btn-outline btn' disabled={!hasNextPage} onClick={next}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
