import { AMMInfoRequest, AMMInfoResponse, Client } from 'xrpl'
import { IssuedCurrency } from 'xrpl/dist/npm/models/common'

import { IssuedCurrencyInfo } from '@/@types/xrpl'
import { convertCurrencyCode } from '@/utils/xrpl'
// const server = 'wss://amm.devnet.rippletest.net:51233'
const server = 'wss://xrpl.ws'
const client = new Client(server)

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

export const getTokens = async (address: string): Promise<IssuedCurrencyInfo[]> => {
  await client.connect()
  const response = await client.request({
    account: address,
    command: 'account_lines',
  })

  const lines = response.result.lines.map((line) => ({
    issuer: line.account,
    currency: convertCurrencyCode(line.currency),
  }))
  const responseMeta = await fetch('https://api.onthedex.live/public/v1/token/meta', {
    method: 'POST',
    body: JSON.stringify({ tokens: lines }),
  })
  const metaJson = await responseMeta.json()
  const metas = metaJson.meta as any[]
  return lines.map((line) => {
    const meta = metas.find((m) => m.issuer === line.issuer && m.currency === line.currency)
    return {
      issuer: line.issuer,
      currency: line.currency,
      name: meta?.token_name || line.currency,
      icon: meta?.logo_file,
    }
  })
}
