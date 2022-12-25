import { createContext, FC, useContext, useEffect, useState } from 'react'

import { AuthContext } from './authContext'

import { IssuedCurrencyInfo } from '@/@types/xrpl'
import { getTokens } from '@/libs/xrpl'

type ContextState = {
  currencies: IssuedCurrencyInfo[]
}

export const TokenContext = createContext<ContextState>({} as any)

export const TokenContextProvider: FC<{ children: React.ReactElement }> = ({ children }) => {
  const { state } = useContext(AuthContext)
  const [currencies, setCurrencies] = useState<IssuedCurrencyInfo[]>([])

  useEffect(() => {
    const XRP: IssuedCurrencyInfo = {
      currency: 'XRP',
      issuer: '',
      name: 'XRP',
      icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
    }
    if (state) {
      const f = async () => {
        const currencies = await getTokens(state.me.account)
        setCurrencies([XRP, ...currencies])
      }
      f()
    }
  }, [state])

  return (
    <TokenContext.Provider
      value={{
        currencies,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
