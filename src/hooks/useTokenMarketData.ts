import { useEffect, useMemo, useState } from 'react'

import { usePagenation } from './usePagenation'

import { TokensMarketData } from '@/@types/xrpl'
import { getTokensMarketData } from '@/libs/xrpl'

export const useTokenMarketData = (data: TokensMarketData[]) => {
  const [tokensMarketData, setTokensMarketData] = useState<TokensMarketData[]>(data)
  const { page, next, prev } = usePagenation()
  const perPage = 25

  useEffect(() => {
    const f = async () => {
      const data = await getTokensMarketData({ page, per_page: perPage })
      setTokensMarketData(data)
    }
    f()
  }, [page])

  const hasNextPage = useMemo(() => tokensMarketData.length === perPage, [tokensMarketData.length])
  const hasPrevPage = useMemo(() => page > 1, [page])

  return {
    page,
    perPage,
    data: tokensMarketData,
    next,
    prev,
    hasNextPage,
    hasPrevPage,
  }
}
