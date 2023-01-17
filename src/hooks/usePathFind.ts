import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PathFindStream } from 'xrpl'
import type { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common'
import { dropsToXrp } from 'xrpl/dist/npm/utils'

import { PathOption } from '@/@types/xrpl'
import { client, client2 } from '@/libs/xrpl'
import { parseToXrpAmount, parseAmountValue } from '@/utils/xrpl'

type Props = {
  account: string
  from: Amount
  to: Amount
}

export const usePathFind = ({ account: _account, from: _from, to: _to }: Props) => {
  const [enable, setEnable] = useState(false)
  const [active, setActive] = useState(false)
  const [account, setAccount] = useState(_account)
  const [from, setPathFrom] = useState<Amount>(_from)
  const [to, setPathTo] = useState<Amount>(_to)
  const [alternatives, setAlternatives] = useState<PathOption[]>([])
  const [pricePath, setPricePath] = useState<PathOption[]>([])
  const fromCurrencyType = useMemo(() => typeof from, [from])
  const fromCurrency = useMemo(
    () => (fromCurrencyType === 'string' ? '0' : { ...(from as IssuedCurrencyAmount), value: '0' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(from as IssuedCurrencyAmount).currency, (from as IssuedCurrencyAmount).issuer, fromCurrencyType]
  )

  const toCurrencyType = useMemo(() => typeof to, [to])
  const toCurrency = useMemo(
    () => (toCurrencyType === 'string' ? '0' : { ...(to as IssuedCurrencyAmount), value: '0' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(to as IssuedCurrencyAmount).currency, (to as IssuedCurrencyAmount).issuer, toCurrencyType]
  )

  useEffect(() => {
    setPricePath([])
    if (!enable) return
    client2.send({
      command: 'path_find',
      subcommand: 'create',
      source_account: account,
      destination_account: account,
      destination_amount: parseToXrpAmount(transformDestAmount(toCurrency)),
      send_max: parseToXrpAmount(transformMinAmount(fromCurrency)),
    })
  }, [account, enable, fromCurrency, toCurrency])

  useEffect(() => {
    if (!enable) return
    setAlternatives([])
    if (['', '0'].includes(parseAmountValue(parseToXrpAmount(from)))) {
      setActive(false)
      return
    }
    setActive(true)
    client.send({
      command: 'path_find',
      subcommand: 'create',
      source_account: account,
      destination_account: account,
      destination_amount: parseToXrpAmount(transformDestAmount(to)),
      send_max: parseToXrpAmount(from),
    })
  }, [account, enable, from, to])

  useEffect(() => {
    if (!enable) return
    const onPathFind = (stream: any) => {
      if (!stream.full_reply) return
      const alternatives = stream.alternatives as PathOption[]
      setAlternatives(alternatives)
    }
    const onPriceFind = (stream: PathFindStream) => {
      if (!stream.full_reply) return
      const alternatives = stream.alternatives as PathOption[]
      setPricePath(alternatives)
    }

    client.on('path', onPathFind as (stream: any) => void)
    client2.on('path', onPriceFind as (stream: any) => void)

    return () => {
      client.close()
      client2.close()
    }
  }, [enable])

  const routes = useCallback(
    (paths: PathOption[]) => {
      if (!active) return null

      if (paths.length === 0) return null
      const route = paths.sort((pathA, pathB) => {
        let pathAAmount
        let pathBAmount
        if (typeof pathA.destination_amount === 'string') {
          // XRP
          pathAAmount = pathA.destination_amount
          pathBAmount = pathB.destination_amount as string
        } else {
          // IOU
          pathAAmount = pathA.destination_amount.value
          pathBAmount = (pathB.destination_amount as IssuedCurrencyAmount).value
        }
        return parseFloat(pathAAmount) - parseFloat(pathBAmount)
      })
      return route
    },
    [active]
  )

  const bestRoute = useMemo(() => {
    const route = routes(alternatives)
    if (!route) return null
    return route[0]
  }, [alternatives, routes])

  const bestPrice = useMemo(() => {
    const route = routes(pricePath)
    if (!route) return 0
    const amountFrom = transformMinAmount(from)
    const amountTo = route[0].destination_amount
    const valueFrom = parseAmountValue(typeof amountFrom === 'string' ? amountFrom : amountFrom.value)
    const valueTo = parseAmountValue(typeof amountTo === 'string' ? dropsToXrp(amountTo) : amountTo.value)
    return parseFloat(valueTo) / parseFloat(valueFrom)
  }, [from, pricePath, routes])

  const swapPrice = useMemo(() => {
    const route = routes(alternatives)
    if (!route) return 0
    const amountFrom = from
    const amountTo = route[0].destination_amount
    const valueFrom = parseAmountValue(typeof amountFrom === 'string' ? amountFrom : amountFrom.value)
    const valueTo = parseAmountValue(typeof amountTo === 'string' ? dropsToXrp(amountTo) : amountTo.value)
    return parseFloat(valueTo) / parseFloat(valueFrom)
  }, [alternatives, from, routes])

  const setPathfindEnable = useCallback(() => setEnable(true), [])

  return { setAccount, setPathFrom, setPathTo, bestRoute, bestPrice, swapPrice, setPathfindEnable }
}

const transformDestAmount = (amount: Amount) => {
  if (typeof amount === 'string') {
    return '-1'
  }
  return { ...amount, value: '-1' as const }
}

const transformMinAmount = (amount: Amount) => {
  if (typeof amount === 'string') {
    return '0.000001'
  }
  // 1000000000000000e-96
  return { ...amount, value: (0.01).toString() }
}
