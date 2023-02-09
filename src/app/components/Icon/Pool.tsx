import { FC } from 'react'

type Props = {
  className?: string
}
export const PoolIcon: FC<Props> = ({ className }) => {
  return (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
      <path d='M18.546 1h-13.069l-5.477 8.986v13.014h24v-13.014l-5.454-8.986zm-11.946 2h10.82l3.642 6h-4.476l-3 3h-3.172l-3-3h-4.471l3.657-6zm15.4 18h-20v-10h4.586l3 3h4.828l3-3h4.586v10z' />
    </svg>
  )
}
