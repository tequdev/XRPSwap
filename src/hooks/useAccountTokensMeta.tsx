import { useContext, useEffect, useMemo, useState } from 'react'

import { useAccountReserve } from './useAccountReserve'

import { CurrencyInfo } from '@/@types/xrpl'
import { AuthContext } from '@/app/context/authContext'
import { getBalances } from '@/libs/xrpl'
import { convertCurrencyCode } from '@/utils/xrpl'

type Token = {
  issuer: string
  currency: string
  name: string
  balance: number
}
type Meta = {
  issuer: string
  currency: string
  token_name?: string
  logo_file?: string
}

const XRP: CurrencyInfo = {
  issuer: '',
  currency: 'XRP',
  name: 'XRP',
  icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
  balance: 100000000000,
}

type Response = { info: CurrencyInfo[]; loading: boolean }

export const useAccountTokensMeta = (): Response => {
  const [loading, setLoading] = useState(true)
  const { state, isConnected } = useContext(AuthContext)
  const reserve = useAccountReserve()
  const [tokens, setTokens] = useState<Token[]>([])
  const [meta, setMeta] = useState<Meta[]>([])

  useEffect(() => {
    if (!isConnected) return
    getBalances(state!.account!).then((res) => {
      const lines = res.map((line) => ({
        issuer: line.issuer || '',
        currency: line.currency,
        name: convertCurrencyCode(line.currency),
        balance: parseFloat(line.value),
      }))
      setTokens(lines)
    })
  }, [isConnected, state])

  useEffect(() => {
    const targetTokens = tokens.filter((l) => l.currency !== 'XRP')
    fetch('https://api.onthedex.live/public/v1/token/meta', {
      method: 'POST',
      body: JSON.stringify({ tokens: targetTokens }),
    }).then(async (res) => {
      const metaJson = await res.json()
      const metas = metaJson.meta as Meta[]
      setMeta(metas)
      setLoading(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens.length])

  const tokensMeta = useMemo(() => {
    if (tokens.length === 0) {
      return [XRP]
    }
    return tokens.map((line) => {
      const m = meta.find((m) => m.issuer === line.issuer && m.currency === line.currency)
      return {
        issuer: line.issuer,
        currency: line.currency,
        name: m?.token_name || line.name,
        icon: line.currency !== 'XRP' ? m?.logo_file : 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
        balance: line.currency !== 'XRP' ? line.balance : line.balance - reserve,
      }
    })
  }, [meta, reserve, tokens])

  return { info: tokensMeta, loading }
}
