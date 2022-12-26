import { createContext, FC, useEffect, useMemo, useState } from 'react'
import { dropsToXrp } from 'xrpl'

import { CurrencyAmount, PathOption } from '@/@types/xrpl'
import { usePathFind } from '@/hooks/usePathFind'
import { parseCurrencyToAmount } from '@/utils/xrpl'

type ContextState = {
  currencies: [CurrencyAmount, CurrencyAmount]
  setCurrency1: (currency: CurrencyAmount) => void
  setCurrency2: (currency: CurrencyAmount) => void
  setValue1: (value: number) => void
  setValue2: (value: number) => void
  switchCurrencies: () => void
  pathLoading: boolean
  bestRoute: PathOption | null
}

export const SwapContext = createContext<ContextState>({} as any)

export const SwapContextProvider: FC<{ children: React.ReactElement }> = ({ children }) => {
  const [currencies, setCurrencies] = useState<[CurrencyAmount, CurrencyAmount]>([
    { currency: 'XRP', name: 'XRP', issuer: '', value: 1 },
    { currency: 'CSC', name: 'CSC', issuer: 'rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr', value: 1 },
  ])
  const { bestRoute, setAccount, setPathFrom, setPathTo } = usePathFind({
    account: 'rQQQrUdN1cLdNmxH4dHfKgmX5P4kf3ZrM',
    from: parseCurrencyToAmount(currencies[0]),
    to: parseCurrencyToAmount(currencies[1]),
  })

  useEffect(() => {
    setPathFrom(parseCurrencyToAmount(currencies[0]))
    setPathTo(parseCurrencyToAmount(currencies[1]))
  }, [currencies, setPathFrom, setPathTo])

  const setCurrency1 = (currency: Omit<CurrencyAmount, 'value'>) => {
    const currency0: CurrencyAmount = {
      issuer: currency.issuer,
      currency: currency.issuer,
      name: currency.name,
      value: 0,
    }
    setCurrencies([currency0, currencies[1]])
  }

  const setCurrency2 = (currency: CurrencyAmount) => {
    const currency1: CurrencyAmount = {
      issuer: currency.issuer,
      currency: currency.issuer,
      name: currency.name,
      value: 0,
    }
    setCurrencies([currencies[0], currency1])
  }

  const setValue1 = (value: number) => {
    const currency0 = { ...currencies[0], value }
    const currency1 = currencies[1]
    if (value === 0) {
      currency1.value = 0
      setCurrencies([currency0, currency1])
    } else {
      setCurrencies([currency0, currency1])
    }
  }
  const setValue2 = (value: number) => {
    const currency1 = { ...currencies[1], value }
    setCurrencies([currencies[0], currency1])
  }

  const switchCurrencies = () => {
    setCurrencies(currenciesResult.reverse() as [CurrencyAmount, CurrencyAmount])
  }

  const currenciesResult = useMemo((): [CurrencyAmount, CurrencyAmount] => {
    const bestRouteValue =
      typeof bestRoute?.destination_amount === 'string'
        ? dropsToXrp(bestRoute.destination_amount)
        : bestRoute?.destination_amount.value
    const destValue = bestRouteValue !== undefined ? parseFloat(parseFloat(bestRouteValue).toFixed(6)) : undefined
    return currencies.map(
      (c, i): CurrencyAmount => ({
        ...c,
        value: i === 1 ? destValue || c.value : c.value,
      })
    ) as [CurrencyAmount, CurrencyAmount]
  }, [bestRoute, currencies])

  const pathLoading = useMemo(() => bestRoute === null, [bestRoute])

  return (
    <SwapContext.Provider
      value={{
        currencies: currenciesResult,
        setCurrency1,
        setCurrency2,
        setValue1,
        setValue2,
        switchCurrencies,
        pathLoading,
        bestRoute,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}
