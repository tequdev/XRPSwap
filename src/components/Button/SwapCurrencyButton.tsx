import { FC } from 'react'

import { SwapCurrencyIcon } from '../Icon/SwapCurrency'

type Props = {
  onClick: () => void
}
export const SwapCurrencyButton: FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='-translate-x-1/2 -translate-y-1/2 transform rounded-2xl border-[3px] border-solid  border-gray-400 bg-white p-1 hover:bg-gray-100'
    >
      <SwapCurrencyIcon className='h-7 w-7' />
    </button>
  )
}
