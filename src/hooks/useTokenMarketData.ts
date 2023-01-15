import { use, useMemo } from 'react'

import { usePagenation } from './usePagenation'

import { getTokensMarketData } from '@/libs/xrpl'

export const useTokenMarketData = () => {
  const { page, next, prev } = usePagenation()
  const perPage = 25
  const tokensMarketData = use(getTokensMarketData({ page, per_page: perPage }))

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
