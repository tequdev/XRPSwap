import { FC } from 'react'

type Props = {
  onClick: () => void
}
export const MaxAmountButton: FC<Props> = ({ onClick }) => {
  return (
    <button className='h-8 w-[40px] rounded-xl bg-blue-500 text-sm text-white' onClick={onClick}>
      MAX
    </button>
  )
}
