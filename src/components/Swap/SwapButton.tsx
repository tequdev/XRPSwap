import { FC, useContext } from 'react'

import { SwapContext } from '@/context/swapContext'

type Props = {
  onClick: () => Promise<void>
}
export const SwapButton: FC<Props> = ({ onClick }) => {
  const { pathLoading } = useContext(SwapContext)
  return (
    <button
      className='flex h-16 w-[420px]  items-center justify-center rounded-xl bg-blue-500 text-2xl text-white disabled:bg-slate-400'
      disabled={pathLoading}
      onClick={onClick}
    >
      {pathLoading ? (
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
      ) : (
        'Swap'
      )}
    </button>
  )
}
