// 'use client'

import { TokenList } from '@/app/components/TokenList'

const Tokens = () => {
  return (
    <>
      <div className='mb-10 text-center text-5xl md:mb-6'>xLedger Tokens</div>
      <div className='flex justify-center'>
        <TokenList />
      </div>
    </>
  )
}

export default Tokens
