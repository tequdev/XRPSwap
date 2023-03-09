'use client'
import React, { ChangeEventHandler, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { MaxAmountButton } from './MaxAmountButton'
import { SelectCurrency } from './SelectCurrency'

import { SwapContext } from '@/app/context/swapContext'
import { TokenContext } from '@/app/context/tokenContext'

type Props = {
  type: 'from' | 'to'
}
export const Currency: FC<Props> = ({ type }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { currencies, setValueFrom, setValueTo, pathLoading } = useContext(SwapContext)
  const { currencies: currencyDataList } = useContext(TokenContext)
  const currency = useMemo(() => (type === 'from' ? currencies.from : currencies.to), [currencies, type])
  const [value, setDefaultValue] = useState(currency.value || '')

  const tokenBalance = useMemo(
    () => currencyDataList.find((c) => c.issuer === currency.issuer && c.currency === currency.currency)?.balance,
    [currency.currency, currency.issuer, currencyDataList]
  )

  const setValue = useCallback(
    (value: number) => (type === 'from' ? setValueFrom(value) : setValueTo(value)),
    [setValueFrom, setValueTo, type]
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
        if (currency.name === 'XRP' && RegExp(/^[0-9]+[.,]?[0-9]{7}$/).test(value)) {
          return
        }
        if (parseFloat(value) > (tokenBalance || 0)) {
          setDefaultValue(value)
          setTimeout(() => {
            setDefaultValue(tokenBalance || 0)
            inputRef?.current?.blur()
          }, 300)
          return
        }
        setDefaultValue(value)
        setValue(parseFloat(value))
      }
    },
    [currency.name, setValue, tokenBalance]
  )

  const setMax = useCallback(() => {
    if (tokenBalance === undefined) return
    setDefaultValue(tokenBalance)
    setValue(tokenBalance)
  }, [setValue, tokenBalance])

  return (
    <div>
      <div className='flex h-[4.5rem] items-center rounded-xl bg-white px-4'>
        <div className='box-border flex w-full items-center justify-between'>
          <div>
            <input
              ref={inputRef}
              type='text'
              inputMode='decimal'
              className={`w-full appearance-none text-3xl text-gray-600 outline-none ${
                type === 'to' && pathLoading && 'animate-pulse text-gray-400'
              }`}
              value={value}
              placeholder='0'
              pattern='^[0-9]*[.,]?[0-9]*$'
              onChange={onChangeValue}
            />
          </div>
          <div className='ml-1 flex items-center'>
            {type === 'from' && (
              <div className='mr-1 items-center'>
                <MaxAmountButton onClick={setMax} />
              </div>
            )}
            <SelectCurrency current={currency} type={type} />
          </div>
        </div>
      </div>
    </div>
  )
}
