import { use, useContext } from 'react'
import { AMMInfoResponse, convertHexToString, dropsToXrp } from 'xrpl'
import { Currency } from 'xrpl/dist/npm/models/common'

import { LiquidityModal } from './LiquidityModal'

import { AMMInfo } from '@/@types/xrpl'
import { AuthContext } from '@/app/context/authContext'
import { client } from '@/libs/xrpl'
import { significantDigits } from '@/utils/number'

const getAmmInfo = async (asset: Currency, asset2: Currency): Promise<AMMInfo> => {
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
const Pool = ({ asset: _asset, asset2: _asset2 }: Props) => {
  const { state } = useContext(AuthContext)
  const ammInfo = use(getAmmInfo(_asset, _asset2))
  const { amount: _amount, amount2: _amount2, lp_token } = ammInfo

  const amount1 = typeof _amount === 'string' ? { currency: 'XRP', value: dropsToXrp(_amount) } : _amount
  const amount2 = typeof _amount2 === 'string' ? { currency: 'XRP', value: dropsToXrp(_amount2) } : _amount2

  const amountSum = parseFloat(amount1.value) + parseFloat(amount2.value)
  const amount1per = Math.round((parseFloat(amount1.value) / amountSum) * 100)
  const amount2per = Math.round((parseFloat(amount2.value) / amountSum) * 100)

  const currencyName = (currency: string) => {
    if (currency.length === 3) return currency
    return convertHexToString(currency)
  }

  const amount1Name = currencyName(amount1.currency)
  const amount2Name = currencyName(amount2.currency)

  return (
    <div className='card shadow-xl'>
      <div className='card-body items-center text-center'>
        <h2 className='card-title'>
          {amount1Name}-{amount2Name} Pool
        </h2>
        <div
          // eslint-disable-next-line tailwindcss/classnames-order, tailwindcss/no-custom-classname
          className={`stats mb-2 bg-gradient-to-r from-blue-200 from-[${amount1per}%] to-red-200 to-[${amount2per}%] shadow`}
        >
          <div className='stat place-items-center'>
            <div className='stat-title'>{amount1Name}</div>
            <div className='stat-value text-secondary'>{parseFloat(amount1.value).toLocaleString()}</div>
          </div>
          <div className='stat place-items-center'>
            <div className='stat-title'>{amount2Name}</div>
            <div className='stat-value text-secondary'>{parseFloat(amount2.value).toLocaleString()}</div>
          </div>
        </div>
        <div className='text-sm'>
          {significantDigits(parseFloat(amount1.value) / parseFloat(amount2.value), 6)} {amount1Name}/{amount2Name}
        </div>
        <div className='text-sm'>
          {significantDigits(parseFloat(amount2.value) / parseFloat(amount1.value), 6)} {amount2Name}/{amount1Name}
        </div>
        <div className='text-sm'>{significantDigits(parseFloat(lp_token.value), 6)} LPTokens</div>

        <div className='card-actions mt-4 justify-end'>{state?.account && <LiquidityModal ammInfo={ammInfo} />}</div>
      </div>
    </div>
  )
}

export default Pool
