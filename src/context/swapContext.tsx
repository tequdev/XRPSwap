import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react'
import { dropsToXrp } from 'xrpl'

import { AuthContext } from './authContext'
import { TokenContext } from './tokenContext'

import { CurrencyAmount, PathOption } from '@/@types/xrpl'
import { usePathFind } from '@/hooks/usePathFind'
import { parseCurrencyToAmount } from '@/utils/xrpl'

type Currencies = { from: CurrencyAmount; to: CurrencyAmount }
type ContextState = {
  currencies: Currencies
  setCurrencyFrom: (currency: CurrencyAmount) => void
  setCurrencyTo: (currency: CurrencyAmount) => void
  setValueFrom: (value: number) => void
  setValueTo: (value: number) => void
  switchCurrencies: () => void
  pathLoading: boolean
  bestRoute: PathOption | null
}

export const SwapContext = createContext<ContextState>({} as any)

export const SwapContextProvider: FC<{ children: React.ReactElement }> = ({ children }) => {
  const { state } = useContext(AuthContext)
  const { currencies: userCurrencies } = useContext(TokenContext)
  const [currencies, setCurrencies] = useState<Currencies>({
    from: { ...userCurrencies[0], value: 1 },
    to: { ...userCurrencies[1], value: 1 },
  })
  const { bestRoute, setAccount, setPathFrom, setPathTo } = usePathFind({
    account: state?.me.account || '',
    from: parseCurrencyToAmount(currencies.from),
    to: parseCurrencyToAmount(currencies.to),
  })

  useEffect(() => {
    setCurrencies({ from: { ...userCurrencies[0], value: 1 }, to: { ...userCurrencies[1], value: 1 } })
  }, [userCurrencies])

  useEffect(() => {
    setPathFrom(parseCurrencyToAmount(currencies.from))
    setPathTo(parseCurrencyToAmount(currencies.to))
  }, [currencies, setPathFrom, setPathTo])

  const setCurrencyFrom = (currency: Omit<CurrencyAmount, 'value'>) => {
    const currencyFrom: CurrencyAmount = {
      issuer: currency.issuer,
      currency: currency.currency,
      name: currency.name,
      value: 0,
    }
    setCurrencies({ from: currencyFrom, to: currencies.to })
  }

  const setCurrencyTo = (currency: CurrencyAmount) => {
    const currencyTo: CurrencyAmount = {
      issuer: currency.issuer,
      currency: currency.currency,
      name: currency.name,
      value: 0,
    }
    setCurrencies({ from: currencies.from, to: currencyTo })
  }

  const setValueFrom = (value: number) => {
    const currencyFrom = { ...currencies.from, value }
    const currencyTo = currencies.to
    if (value === 0) {
      currencyTo.value = 0
      setCurrencies({ from: currencyFrom, to: currencyTo })
    } else {
      setCurrencies({ from: currencyFrom, to: currencyTo })
    }
  }

  const setValueTo = (value: number) => {
    const currencyFrom = currencies.from
    const currencyTo = { ...currencies.to, value }
    setCurrencies({ from: currencyFrom, to: currencyTo })
  }

  const switchCurrencies = () => {
    setCurrencies({ from: currenciesResult.to, to: currenciesResult.from })
  }

  const currenciesResult = useMemo((): Currencies => {
    const bestRouteValue =
      typeof bestRoute?.destination_amount === 'string'
        ? dropsToXrp(bestRoute.destination_amount)
        : bestRoute?.destination_amount.value
    const destValue = bestRouteValue !== undefined ? parseFloat(parseFloat(bestRouteValue).toFixed(6)) : undefined
    return {
      ...currencies,
      to: {
        ...currencies.to,
        value: destValue || currencies.to.value,
      },
    }
  }, [bestRoute, currencies])

  const pathLoading = useMemo(() => bestRoute === null, [bestRoute])

  return (
    <SwapContext.Provider
      value={{
        currencies: currenciesResult,
        setCurrencyFrom,
        setCurrencyTo,
        setValueFrom,
        setValueTo,
        switchCurrencies,
        pathLoading,
        bestRoute,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}
