import BigNumber from 'bignumber.js'
import { useContext, useMemo, useState } from 'react'
import { dropsToXrp } from 'xrpl'

import { AMMInfo } from '@/@types/xrpl'
import { TokenContext } from '@/app/context/tokenContext'
import { keepRatio } from '@/utils/number'
import { parseCurrencyName, parseCurrencyUnique } from '@/utils/xrpl'

type BoxProps = {
  type: 'Withdraw' | 'Deposit'
  ammInfo: AMMInfo
  onClose: () => void
}
const OperationType: ['double', 'single'] = ['double', 'single']
const DepositOrWithdrawBox = ({ type, ammInfo, onClose }: BoxProps) => {
  const { currencies: accountCurrencies } = useContext(TokenContext)
  const [operationType, setOperationType] = useState<typeof OperationType[number]>('double')
  const [range, setRange] = useState(0)
  const [userOperationAmounts, setUserOperationAmounts] = useState<Record<'amount1' | 'amount2', number>>({
    amount1: 0,
    amount2: 0, // use only for Double type
  })
  const [singleAsset, setSingleAsset] = useState<'asset1' | 'asset2'>('asset1')

  const ammPairUniqueName = useMemo(() => {
    const amount1Name = parseCurrencyName(ammInfo.amount)
    const amount2Name = parseCurrencyName(ammInfo.amount2)
    return { asset1: amount1Name, asset2: amount2Name }
  }, [ammInfo.amount, ammInfo.amount2])

  const onChangeRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const range = parseInt(e.target.value)
    setRange(range)
    if (operationType === 'double') {
      const userAmounts = keepRatio(
        [(userAmount1Balance * range) / 100, (userAmount2Balance * range) / 100],
        [ammAssetRatio.amount1Balance, ammAssetRatio.amount2Balance]
      )
      setUserOperationAmounts({
        amount1: userAmounts[0],
        amount2: userAmounts[1],
      })
    } else {
      setUserOperationAmounts({
        amount1: (userAmount1Balance * range) / 100,
        amount2: (userAmount2Balance * range) / 100,
      })
    }
  }

  const getCurrencyName = (amount: AMMInfo['amount']) => {
    if (typeof amount === 'string') return 'XRP'
    return amount.currency
  }
  const userAmount1Balance = accountCurrencies.find(
    (currency) => parseCurrencyUnique(currency) === parseCurrencyUnique(ammInfo.amount)
  )!.balance

  const userAmount2Balance = accountCurrencies.find(
    (currency) => parseCurrencyUnique(currency) === parseCurrencyUnique(ammInfo.amount2)
  )!.balance

  const ammAssetRatio = useMemo(() => {
    const ammAmount1Balance = typeof ammInfo.amount === 'string' ? dropsToXrp(ammInfo.amount) : ammInfo.amount.value
    const ammAmount2Balance = typeof ammInfo.amount2 === 'string' ? dropsToXrp(ammInfo.amount2) : ammInfo.amount2.value
    return {
      amount1Balance: BigNumber(ammAmount1Balance).toNumber(),
      amount2Balance: BigNumber(ammAmount2Balance).toNumber(),
    }
  }, [ammInfo.amount, ammInfo.amount2])

  const withdraw = () => {}

  const deposit = () => {}

  return (
    <>
      <h3 className='text-center text-xl font-bold'>{type} Liquidity</h3>
      <div className='btn-group grid grid-cols-2'>
        {OperationType.map((opType) => (
          <button
            key={opType}
            className={`${opType === operationType ? 'btn-active' : 'btn-outline'} btn`}
            onClick={() => setOperationType(opType)}
          >
            {opType} asset {type}
          </button>
        ))}
      </div>

      {operationType === 'single' && (
        //  Select Single Currency
        <div className='btn-group grid grid-cols-2'>
          <button
            className={`${singleAsset === 'asset1' ? 'btn-secondary btn-active' : 'btn-outline'} btn-sm btn`}
            onClick={() => setSingleAsset('asset1')}
          >
            {getCurrencyName(ammInfo.amount)}
          </button>
          <button
            className={`${singleAsset === 'asset2' ? 'btn-secondary btn-active' : 'btn-outline'} btn-sm btn`}
            onClick={() => setSingleAsset('asset2')}
          >
            {getCurrencyName(ammInfo.amount2)}
          </button>
        </div>
      )}

      <div className='card-body'>
        {(operationType === 'double' || (operationType === 'single' && singleAsset === 'asset1')) && (
          <>
            {/* Amount1 */}
            <div className='text-lg'>{getCurrencyName(ammInfo.amount)}</div>
            {/* Amount1 to Deposit/Withdraw */}
            <div className='text-2xl font-semibold'>{userOperationAmounts.amount1}</div>
            <div className='text-sm'>{userAmount1Balance}</div>
          </>
        )}

        {(operationType === 'double' || (operationType === 'single' && singleAsset === 'asset2')) && (
          <>
            {/* Amount2 */}
            <div className='text-lg'>{getCurrencyName(ammInfo.amount2)}</div>
            {/* Amount2 to Deposit/Withdraw */}
            <div className='text-2xl font-semibold'>{userOperationAmounts.amount2}</div>
            <div className='text-sm'>{userAmount2Balance}</div>
          </>
        )}

        <input type='range' value={range} min='0' max='100' className='range range-primary' onChange={onChangeRange} />
      </div>

      <div className='card-actions justify-between'>
        <button className='btn-outline btn-error btn' onClick={onClose}>
          close
        </button>
        <button className='btn-primary btn' onClick={() => (type === 'Deposit' ? deposit() : withdraw())}>
          {type}
        </button>
      </div>
    </>
  )
}

type Props = {
  ammInfo: AMMInfo
  onClose: () => void
}

export const DepositBox = (props: Props) => <DepositOrWithdrawBox type='Deposit' {...props} />
export const WithdrawBox = (props: Props) => <DepositOrWithdrawBox type='Withdraw' {...props} />
