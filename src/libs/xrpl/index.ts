import { AMMInfoRequest, AMMInfoResponse, Client } from 'xrpl'
import { IssuedCurrency } from 'xrpl/dist/npm/models/common'

import { CurrencyInfo } from '@/@types/xrpl'
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
