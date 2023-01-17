import { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}
const PageTitle: FC<Props> = ({ children }) => {
  return <div className='mb-10 text-center text-3xl md:mb-6 md:text-5xl'>{children}</div>
}

export default PageTitle
