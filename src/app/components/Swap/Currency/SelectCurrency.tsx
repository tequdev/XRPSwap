import { FC, useCallback, useContext, useMemo } from 'react'
import { useModal } from 'react-hooks-use-modal'

import { SelectCurrencyModal } from './SelectCurrencyModal'

import { CurrencyAmount, CurrencyInfo } from '@/@types/xrpl'
import { SwapContext } from '@/app/context/swapContext'
import { convertCurrencyCode } from '@/utils/xrpl'

type Props = {
  current: CurrencyAmount
  type: 'from' | 'to'
}

export const SelectCurrency: FC<Props> = ({ type, current }) => {
  const [Modal, open, close] = useModal('root', {
    focusTrapOptions: {
      preventScroll: false,
    },
  })
  const { currencies, setCurrencyFrom, setCurrencyTo } = useContext(SwapContext)
  const currency = useMemo(() => (type === 'from' ? currencies.from : currencies.to), [currencies, type])

  const setCurrency = useCallback(
    (currencyProp: CurrencyInfo) => {
      const currency = { ...currencyProp, value: 1 }
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
      {currency.currency && (
        <button className='btn-outline btn-secondary btn rounded-xl px-4 py-2 text-xl' onClick={open}>
          {convertCurrencyCode(currency.currency)}
        </button>
      )}
      {!currency.currency && (
        <button className='btn-success btn flex flex-col rounded-xl px-4 py-2' onClick={open}>
          Select
        </button>
      )}
      <Modal>
        <SelectCurrencyModal current={current} onSelect={onSelectCurrency} onClose={close} />
      </Modal>
    </>
  )
}
