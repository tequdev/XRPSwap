import { useContext, useEffect } from 'react'

import { SwapContext } from '@/context/swapContext'
import { useSlippageInput } from '@/hooks/useSlippageInput'

export const Slippage = () => {
  const { setSlippage } = useContext(SwapContext)
  const { value, slippage, onChange, onBlur } = useSlippageInput()

  useEffect(() => {
    setSlippage(slippage)
  }, [setSlippage, slippage])

  return (
    <div>
      <label htmlFor='slippage' className='text-sm font-medium'>
        Slippage tolerance
      </label>
      <div className='flex'>
        <input
          id='slippage'
          type='text'
          inputMode='numeric'
          pattern='^([1-9]\d*|0)(.\d+)?$'
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className='input-bordered input input-sm w-full max-w-xs rounded-none rounded-l-md focus:-outline-offset-2'
        />
        <span className='inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900'>
          %
        </span>
      </div>
    </div>
  )
}
