import { useEffect, useState } from 'react'
import { Currency } from 'xrpl/dist/npm/models/common'

import { getLedgerPools } from '@/libs/xrpl'

type AmmAsset = {
  asset: Currency
  asset2: Currency
}

export const useLedgerPool = () => {
  const [ammAssets, setAmmAssets] = useState<AmmAsset[]>([])

  useEffect(() => {
    const f = async () => {
      const assets = await getLedgerPools()
      setAmmAssets(assets)
    }
    f()
  }, [])

  return {
    ammAssets,
    // page,
    // perPage,
    // data: tokensMarketData,
    // next,
    // prev,
    // hasNextPage,
    // hasPrevPage,
  }
}
