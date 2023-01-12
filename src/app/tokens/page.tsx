'use client'

import { TokenList } from '@/components/TokenList'

const Tokens = () => {
  return (
    <div className='py-28'>
      <div className='mb-6 text-center text-5xl'>xLedger Tokens</div>
      <div className='flex justify-center'>
        <TokenList />
      </div>
    </div>
  )
}

export default Tokens
