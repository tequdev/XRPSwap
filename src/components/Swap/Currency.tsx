'use client'
import React, { ChangeEventHandler, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { SelectCurrency } from './SelectCurrency'

import { SwapContext } from '@/context/swapContext'

type Props = {
  type: 'from' | 'to'
}
export const Currency: FC<Props> = ({ type }) => {
  const { currencies, setValue1, setValue2, pathLoading } = useContext(SwapContext)
  const currency = useMemo(() => currencies[type === 'from' ? 0 : 1], [currencies, type])
  const [value, setDefaultValue] = useState(currency.value || '')

  const setValue = useCallback(
    (value: number) => (type === 'from' ? setValue1(value) : setValue2(value)),
    [setValue1, setValue2, type]
  )

  useEffect(() => {
    setDefaultValue(currency.value)
  }, [currency.value])

  const onChangeValue: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value
      if (value === '') {
        setDefaultValue('')
        setValue(0)
      } else if (RegExp(/^[0-9]+[.,]?[0-9]*$/).test(value)) {
        setDefaultValue(value)
        setValue(parseFloat(value))
      }
    },
    [setValue]
  )

  return (
    <div>
      <div className='flex h-[4.5rem] items-center rounded-xl bg-white px-4'>
        <div className='flex w-full justify-between'>
          <br />
          <input
            type='text'
            className={`appearance-none text-3xl text-gray-600 outline-none ${
              type === 'to' && pathLoading && 'animate-pulse text-gray-400'
            }`}
            value={value}
            placeholder='0'
            pattern='^[0-9]*[.,]?[0-9]*$'
            onChange={onChangeValue}
          />
          <SelectCurrency current={currency} type={type} />
        </div>
      </div>
    </div>
  )
}
