import { FC, useCallback, useContext, useMemo } from 'react'
import { useModal } from 'react-hooks-use-modal'
import { Currency as CurrencyType } from 'xrpl/dist/npm/models/common'

import { SelectCurrencyModal } from './SelectCurrencyModal'

import { SwapContext } from '@/context/swapContext'

type Props = {
  current: CurrencyType
  type: 'from' | 'to'
}

export const SelectCurrency: FC<Props> = ({ type, current }) => {
  const [Modal, open, close] = useModal('root')
  const { currencies, setCurrency1, setCurrency2 } = useContext(SwapContext)
  const currency = useMemo(() => currencies[type === 'from' ? 0 : 1], [currencies, type])

  const setCurrency = useCallback(
    (currency: CurrencyType) => (type === 'from' ? setCurrency1(currency) : setCurrency2(currency)),
    [setCurrency1, setCurrency2, type]
  )

  const onSelectCurrency = (currency: CurrencyType) => {
    setCurrency(currency)
    close()
  }
  return (
    <>
      <button className='rounded-xl bg-blue-100 px-4 py-2 text-xl' onClick={open}>
        {currency.currency}
      </button>
      <Modal>
        <SelectCurrencyModal current={current} onSelect={onSelectCurrency} />
      </Modal>
    </>
  )
}
