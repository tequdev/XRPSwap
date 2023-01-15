import { AccountInfoRequest, AccountInfoResponse, Client, ServerInfoRequest, ServerInfoResponse } from 'xrpl'

import { CurrencyInfo, TokensMarketData } from '@/@types/xrpl'
import { convertCurrencyCode } from '@/utils/xrpl'
// const server = 'wss://s.altnet.rippletest.net:51233/'
// const server = 'wss://amm.devnet.rippletest.net:51233'
const server = 'wss://xrpl.ws'
export const client = new Client(server, { connectionTimeout: 10000 })
export const client2 = new Client(server, { connectionTimeout: 10000 })

export const getAccountTokensMeta = async (address: string): Promise<CurrencyInfo[]> => {
  await client.connect()
  const [response, accountInfoResponse, serverInfoResponse] = await Promise.all([
    client.getBalances(address),
    client.request<AccountInfoRequest, AccountInfoResponse>({
      command: 'account_info',
      account: address,
      ledger_index: 'validated',
    }),
    client.request<ServerInfoRequest, ServerInfoResponse>({ command: 'server_info' }),
  ])
  const { reserve_base_xrp: baseReserve, reserve_inc_xrp: incReserve } = serverInfoResponse.result.info
    .validated_ledger || {
    reserve_base_xrp: 10,
    reserve_inc_xrp: 2,
  }
  const ownerCount = accountInfoResponse.result.account_data.OwnerCount

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
      balance: line.currency !== 'XRP' ? line.balance : line.balance - (baseReserve + incReserve * ownerCount),
    }
  })
}

type TokensMarketDataOption = {
  page: number
  per_page: number
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
export const getTokensMarketData = async ({ page, per_page }: TokensMarketDataOption): Promise<TokensMarketData[]> => {
  const param = new URLSearchParams({
    min_trades: '1',
    per_page: per_page.toString(),
    page: page.toString(),
  })
  const response = await fetch(`https://api.onthedex.live/public/v1/daily/tokens?${param}`, {
    next: { revalidate: 10 },
  })
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
    supply: token.supply,
    logo: token.logo_file || undefined,
  }))
}
