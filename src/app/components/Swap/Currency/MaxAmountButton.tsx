import { FC } from 'react'

type Props = {
  onClick: () => void
}
export const MaxAmountButton: FC<Props> = ({ onClick }) => {
  return (
    <button className='btn-info btn-sm btn w-[40px] rounded-xl' onClick={onClick}>
      MAX
    </button>
  )
}
