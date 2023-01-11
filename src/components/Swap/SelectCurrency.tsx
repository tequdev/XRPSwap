import { FC, useCallback, useContext, useMemo } from 'react'
import { useModal } from 'react-hooks-use-modal'

import { SelectCurrencyModal } from './SelectCurrencyModal'

import { CurrencyAmount, CurrencyInfo } from '@/@types/xrpl'
import { SwapContext } from '@/context/swapContext'

type Props = {
  current: CurrencyAmount
  type: 'from' | 'to'
}

export const SelectCurrency: FC<Props> = ({ type, current }) => {
  const [Modal, open, close] = useModal('root')
  const { currencies, setCurrencyFrom, setCurrencyTo } = useContext(SwapContext)
  const currency = useMemo(() => (type === 'from' ? currencies.from : currencies.to), [currencies, type])

  const setCurrency = useCallback(
    (currencyProp: CurrencyInfo) => {
      const currency = { ...currencyProp, value: 0 }
      type === 'from' ? setCurrencyFrom(currency) : setCurrencyTo(currency)
    },
    [setCurrencyFrom, setCurrencyTo, type]
  )

  const onSelectCurrency = (currency: CurrencyInfo) => {
    setCurrency(currency)
    close()
  }
  return (
    <>
      <button className=' rounded-xl bg-blue-100 px-4 py-2 text-xl' onClick={open}>
        {currency.name}
      </button>
      <Modal>
        <SelectCurrencyModal current={current} onSelect={onSelectCurrency} />
      </Modal>
    </>
  )
}
