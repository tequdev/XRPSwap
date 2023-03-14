import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PathFindStream } from 'xrpl'
import type { AnyJson } from 'xrpl-client'
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
  const [isFullPath, setIsFullPath] = useState<boolean>()
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

  const pathFindClose = useCallback(async (_client: typeof client) => {
    _client.send({
      command: 'path_find',
      subcommand: 'close',
    })
  }, [])

  const pathFindCreate = useCallback(
    async (_client: typeof client, call: AnyJson) => {
      _client.send({
        command: 'path_find',
        subcommand: 'create',
        source_account: account,
        destination_account: account,
        ...call,
      })
    },
    [account]
  )

  useEffect(() => {
    setPricePath([])
    if (!enable) return
    pathFindClose(client2).then(() => {
      pathFindCreate(client2, {
        destination_amount: parseToXrpAmount(transformDestAmount(toCurrency)),
        send_max: parseToXrpAmount(transformMinAmount(fromCurrency)),
      })
    })
    return () => {
      pathFindClose(client2)
    }
  }, [enable, fromCurrency, pathFindClose, pathFindCreate, toCurrency])

  useEffect(() => {
    if (!enable) return
    pathFindClose(client).then(() => {
      setAlternatives([])
      setIsFullPath(undefined)
      if (['', '0'].includes(parseAmountValue(parseToXrpAmount(from)))) {
        setActive(false)
        return
      }
      setActive(true)
      pathFindCreate(client, {
        destination_amount: parseToXrpAmount(transformDestAmount(to)),
        send_max: parseToXrpAmount(from),
      })
    })
    return () => {
      pathFindClose(client)
    }
  }, [enable, from, pathFindClose, pathFindCreate, to])

  useEffect(() => {
    if (!enable) return
    const onSwapPathFind = (stream: any) => {
      if (!stream.alternatives && !stream.result?.alternatives) {
        return
      }
      const alternatives = (stream.alternatives || stream.result.alternatives) as PathOption[]
      setAlternatives(alternatives || [])
      if (stream.full_reply !== true) {
        setIsFullPath(false)
      } else {
        setIsFullPath(true)
      }
    }
    const onBestPriceFind = (stream: PathFindStream) => {
      const alternatives = stream.alternatives as PathOption[]
      setPricePath(alternatives || [])
    }

    client.on('path', onSwapPathFind as (stream: any) => void)
    client2.on('path', onBestPriceFind as (stream: any) => void)

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

  return { setAccount, setPathFrom, setPathTo, bestRoute, bestPrice, swapPrice, setPathfindEnable, isFullPath }
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
