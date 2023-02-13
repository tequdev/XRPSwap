// 'use client'

import { Suspense } from 'react'

import Pool from '../components/Pool'

const AccountPools = () => {
  // useAccountPools()
  return (
    <>
      <Suspense fallback={<>Loading</>}>
        <Pool asset={{ currency: 'XRP' }} asset2={{ currency: 'JPY', issuer: 'rfLpkj24oMFDyWV1mK4uEP454gFTeJfN2x' }} />
      </Suspense>
    </>
  )
}

export default AccountPools
