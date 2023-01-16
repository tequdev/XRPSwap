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

export const TokenContextProvider: FC<{ children: React.ReactElement }> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const { state } = useContext(AuthContext)
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([XRP])

  useEffect(() => {
    if (state) {
      const f = async () => {
        const tokenCurrencies = await getAccountTokensMeta(state.me.account)
        setCurrencies([...tokenCurrencies])
        setLoading(false)
      }
      f()
    }
  }, [state])

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
