import { AMMInfoRequest, AMMInfoResponse, Client } from 'xrpl'
import { IssuedCurrency } from 'xrpl/dist/npm/models/common'

import { CurrencyInfo, TokensMarketData } from '@/@types/xrpl'
import { convertCurrencyCode } from '@/utils/xrpl'
// const server = 'wss://s.altnet.rippletest.net:51233/'
// const server = 'wss://amm.devnet.rippletest.net:51233'
const server = 'wss://xrpl.ws'
export const client = new Client(server)

type GetAmmInfoProps = Pick<AMMInfoRequest, 'asset' | 'asset2'>

export const getAmmInfo = async ({ asset, asset2 }: GetAmmInfoProps) => {
  await client.connect()
  const response = await client.request<AMMInfoRequest, AMMInfoResponse>({
    command: 'amm_info',
    asset,
    asset2,
  })
  return response.result['amm'] as any
}

export const getAmmBalance = async (ammAddress: string, currency: any) => {
  await client.connect()
  if (typeof currency === 'string') {
    const value = await client.getXrpBalance(ammAddress)
    return parseFloat(value)
  }
  const response = await client.getBalances(ammAddress)
  const value = response.find(
    (res) => res.currency === currency.currency && res.issuer === (currency as IssuedCurrency).issuer
  )!.value
  return parseFloat(value)
}

export const getAccountTokensMeta = async (address: string): Promise<CurrencyInfo[]> => {
  await client.connect()
  const response = await client.getBalances(address)

  const lines = response.map((line) => ({
    issuer: line.issuer || '',
    currency: line.currency,
    name: convertCurrencyCode(line.currency),
    balance: parseFloat(line.value),
  }))
  const responseMeta = await fetch('https://api.onthedex.live/public/v1/token/meta', {
    method: 'POST',
    body: JSON.stringify({ tokens: lines.filter((l) => l.currency !== 'XRP') }),
  })
  const metaJson = await responseMeta.json()
  const metas = metaJson.meta as any[]
  return lines.map((line) => {
    const meta = metas.find((m) => m.issuer === line.issuer && m.currency === line.currency)
    return {
      issuer: line.issuer,
      currency: line.currency,
      name: meta?.token_name || line.name,
      icon: line.currency !== 'XRP' ? meta?.logo_file : 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
      balance: line.balance,
    }
  })
}

type TokensMarketDataOption = {
  page: number
}
type TokensMarketDataResponse = {
  tokens: {
    currency: string
    issuer: string
    token_name?: string | null
    volume_token: number
    volume_usd: number
    num_trades: number
    market_cap: number
    last_trade_at: string
    price_mid_usd: number
    supply: number
    logo_file?: string | null
  }[]
}
export const getTokensMarketData = async ({ page }: TokensMarketDataOption): Promise<TokensMarketData[]> => {
  const response = await fetch('https://api.onthedex.live/public/v1/daily/tokens')
  const json = (await response.json()) as TokensMarketDataResponse
  return json.tokens.map((token) => ({
    issuer: token.issuer,
    currency: token.currency,
    name: token.token_name || token.currency,
    volume: token.volume_usd,
    market_cap: token.market_cap,
    last_trade_at: token.last_trade_at,
    price: token.price_mid_usd,
    trades: token.num_trades,
    logo: token.logo_file || undefined,
  }))
}
