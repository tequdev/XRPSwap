'use client'
import { createContext, FC } from 'react'

import { CurrencyInfo } from '@/@types/xrpl'
import { useAccountTokensMeta } from '@/hooks/useAccountTokensMeta'

type ContextState = {
  currencies: CurrencyInfo[]
  loading: boolean
  refetch: () => void
}

export const TokenContext = createContext<ContextState>({} as any)

const TokenContextProvider: FC<{ children: React.ReactElement }> = ({ children }) => {
  const { info: currencies, loading, refetch } = useAccountTokensMeta()

  return (
    <TokenContext.Provider
      value={{
        currencies,
        loading,
        refetch,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

export default TokenContextProvider
