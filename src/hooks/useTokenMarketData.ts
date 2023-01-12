import { useEffect, useState } from 'react'

import { usePagenation } from './usePagenation'

import { TokensMarketData } from '@/@types/xrpl'
import { getTokensMarketData } from '@/libs/xrpl'

export const useTokenMarketData = () => {
  const [tokensMarketData, setTokensMarketData] = useState<TokensMarketData[]>([])
  const { page, next, prev } = usePagenation()

  useEffect(() => {
    const f = async () => {
      const data = await getTokensMarketData({ page })
      setTokensMarketData(data)
    }
    f()
  }, [page])

  return {
    data: tokensMarketData,
    next,
    prev,
  }
}
