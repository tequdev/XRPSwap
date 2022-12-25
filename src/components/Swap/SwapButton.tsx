import { FC } from 'react'

type Props = {
  onClick: () => Promise<void>
}
export const SwapButton: FC<Props> = ({ onClick }) => {
  return (
    <button
      className='flex h-16 w-[420px] items-center justify-center rounded-xl bg-blue-500 text-2xl text-white'
      onClick={onClick}
    >
      Swap
    </button>
  )
}
