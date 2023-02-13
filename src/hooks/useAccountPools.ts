import { useContext, useEffect, useState } from 'react'

import { AuthContext } from '@/app/context/authContext'
import { getAccountLpTokens } from '@/libs/xrpl'

export const useAccountPools = () => {
  const { state, sdk, isConnected } = useContext(AuthContext)
  const [lpTokens, setLpTokens] = useState<string[]>([])

  useEffect(() => {
    const f = async () => {
      if (state?.account) {
        const tokens = await getAccountLpTokens(state.account)
        setLpTokens(tokens)
      }
    }
    f()
  }, [state?.account])

  return {
    // page,
    // perPage,
    // data: tokensMarketData,
    // next,
    // prev,
    // hasNextPage,
    // hasPrevPage,
  }
}
