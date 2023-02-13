import { FC } from 'react'
import { AMMInfoResponse, dropsToXrp } from 'xrpl'
import { Currency } from 'xrpl/dist/npm/models/common'

import { client } from '@/libs/xrpl'
import { significantDigits } from '@/utils/number'

const getAmmInfo = async (asset: Currency, asset2: Currency) => {
  const response = (await client.send({
    command: 'amm_info',
    asset,
    asset2,
  })) as AMMInfoResponse['result']
  return response.amm
}

type Props = {
  asset: Currency
  asset2: Currency
}
const Pool: FC<Props> = async ({ asset: _asset, asset2: _asset2 }) => {
  const ammInfo = await getAmmInfo(_asset, _asset2)
  const { amount: _amount, amount2: _amount2, lp_token } = ammInfo

  const amount1 = typeof _amount === 'string' ? { currency: 'XRP', value: dropsToXrp(_amount) } : _amount
  const amount2 = typeof _amount2 === 'string' ? { currency: 'XRP', value: dropsToXrp(_amount2) } : _amount2

  return (
    <div className='card shadow-xl'>
      <div className='card-body items-center text-center'>
        <h2 className='card-title'>
          {amount1.currency}-{amount2.currency} Pool
        </h2>
        <div className='stats mb-2 shadow'>
          <div className='stat place-items-center'>
            <div className='stat-title'>{amount1.currency}</div>
            <div className='stat-value  text-secondary'>{parseFloat(amount1.value).toLocaleString()}</div>
          </div>
          <div className='stat place-items-center'>
            <div className='stat-title'>{amount2.currency}</div>
            <div className='stat-value text-secondary'>{parseFloat(amount2.value).toLocaleString()}</div>
          </div>
        </div>
        <div className='text-sm'>
          {significantDigits(parseFloat(amount1.value) / parseFloat(amount2.value), 6)} {amount1.currency}/
          {amount2.currency}
        </div>
        <div className='text-sm'>
          {significantDigits(parseFloat(amount2.value) / parseFloat(amount1.value), 6)} {amount2.currency}/
          {amount1.currency}
        </div>
        <div className='text-sm'>{significantDigits(parseFloat(lp_token.value), 6)} LPTokens</div>

        <div className='card-actions mt-4 justify-end'>
          <button className='btn-outline btn-primary btn w-32'>Deposit</button>
          <button className='btn-outline btn-primary btn w-32'>Withdraw</button>
        </div>
      </div>
    </div>
  )
}

export default Pool
