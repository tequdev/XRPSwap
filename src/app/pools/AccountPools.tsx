'use client'
import { Suspense } from 'react'

import Pool from '../components/Pool'

import { useAccountPools } from '@/hooks/useAccountPools'

const AccountPools = () => {
  const { ammAssets } = useAccountPools()
  console.log(ammAssets)
  return (
    <>
      {/* dev start */}
      {/* <Suspense fallback={<>Loading</>}>
        <Pool asset={{ currency: 'XRP' }} asset2={{ currency: 'JPY', issuer: 'r9ipnvUgT4ZYVbiNib4sLCzJ3RGzxfXp6y' }} />
      </Suspense> */}
      {/* dev end */}
      {ammAssets.map((asset, index) => (
        <Suspense key={index} fallback={<>Loading</>}>
          <Pool asset={asset.asset} asset2={asset.asset2} />
        </Suspense>
      ))}
    </>
  )
}

export default AccountPools
