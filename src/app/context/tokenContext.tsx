'use client'
import { createContext, FC } from 'react'

import { CurrencyInfo } from '@/@types/xrpl'
import { useAccountTokensMeta } from '@/hooks/useAccountTokensMeta'

type ContextState = {
  currencies: CurrencyInfo[]
  loading: boolean
}

const XRP = {
  issuer: '',
  currency: 'XRP',
  name: 'XRP',
  icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
  balance: 100000000000,
}

export const TokenContext = createContext<ContextState>({} as any)

const TokenContextProvider: FC<{ children: React.ReactElement }> = ({ children }) => {
  const { info: currencies, loading } = useAccountTokensMeta()

  return (
    <TokenContext.Provider
      value={{
        currencies,
        loading,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

export default TokenContextProvider
