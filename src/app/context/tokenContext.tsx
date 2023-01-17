'use client'
import { createContext, FC, useContext, useEffect, useState } from 'react'

import { AuthContext } from './authContext'

import { CurrencyInfo } from '@/@types/xrpl'
import { getAccountTokensMeta } from '@/libs/xrpl'

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
  const [loading, setLoading] = useState(true)
  const { state, isConnected } = useContext(AuthContext)
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([XRP])

  useEffect(() => {
    const f = async () => {
      if (!isConnected) return
      const tokenCurrencies = await getAccountTokensMeta(state!.account!)
      setCurrencies([...tokenCurrencies])
      setLoading(false)
    }
    f()
  }, [isConnected, state])

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
