import { useContext, useEffect, useState } from 'react'
import { Currency } from 'xrpl/dist/npm/models/common'

import { AuthContext } from '@/app/context/authContext'
import { getAccountLpTokensIssuer, getAmmAccountPairs } from '@/libs/xrpl'

type AmmAsset = {
  asset: Currency
  asset2: Currency
}

export const useAccountPools = () => {
  const { state, sdk, isConnected } = useContext(AuthContext)
  const [ammAccounts, setAmmAccounts] = useState<string[]>([])
  const [ammAssets, setAmmAssets] = useState<AmmAsset[]>([])

  useEffect(() => {
    const f = async () => {
      if (state?.account) {
        const ammAccounts = await getAccountLpTokensIssuer(state.account)
        setAmmAccounts(ammAccounts)
        const assets = await Promise.all(
          ammAccounts.map((account) => {
            return getAmmAccountPairs(account)
          })
        )
        setAmmAssets(assets)
      }
    }
    f()
  }, [state?.account])

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
