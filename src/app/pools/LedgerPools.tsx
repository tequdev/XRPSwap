'use client'
import { Suspense, use } from 'react'

import Pool from '../components/Pool'

import { getLedgerPools } from '@/libs/xrpl'

const LedgerPools = () => {
  const ammAssets = use(getLedgerPools())

  return (
    <div className='grid grid-cols-2 gap-4'>
      {ammAssets.map((asset, index) => (
        <div key={index} className='col-span-1'>
          <Suspense fallback={<>Loading</>}>
            <Pool asset={asset.asset} asset2={asset.asset2} />
          </Suspense>
        </div>
      ))}
    </div>
  )
}

export default LedgerPools
