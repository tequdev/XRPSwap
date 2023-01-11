import { FC } from 'react'

import { SwapCurrencyIcon } from '../Icon/SwapCurrency'

type Props = {
  onClick: () => void
}
export const SwapCurrencyButton: FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='btn-outline no-animation btn-circle btn -translate-x-1/2 -translate-y-1/2 transform border-[3px] border-solid border-gray-400 bg-white px-1'
    >
      <SwapCurrencyIcon className='h-7 w-7' />
    </button>
  )
}
