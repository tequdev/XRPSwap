'use client'
import { useModal } from 'react-hooks-use-modal'

import { DepositBox, WithdrawBox } from './DepositOrWithdrawBox'

import { AMMInfo } from '@/@types/xrpl'

type Props = {
  ammInfo: AMMInfo
}

export const LiquidityModal = ({ ammInfo }: Props) => {
  const [DepositModal, depositOpen, depositClose] = useModal('root')
  const [WithdrapModal, withdrawOpen, withdrawClose] = useModal('root')

  return (
    <>
      <button className='btn-outline btn-primary btn w-32' onClick={depositOpen}>
        Deposit
      </button>
      <button className='btn-outline btn-primary btn w-32' onClick={withdrawOpen}>
        Withdraw
      </button>
      <DepositModal>
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body flex justify-center'>
            <DepositBox ammInfo={ammInfo} onClose={depositClose} />
          </div>
        </div>
      </DepositModal>
      <WithdrapModal>
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body flex justify-center'>
            <WithdrawBox ammInfo={ammInfo} onClose={withdrawClose} />
          </div>
        </div>
      </WithdrapModal>
    </>
  )
}
