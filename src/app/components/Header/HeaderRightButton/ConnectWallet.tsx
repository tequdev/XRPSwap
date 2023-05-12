import { useContext } from 'react'

import { XummContext } from '@/app/context/xummContext'

export const ConnectWallet = () => {
  const { connect } = useContext(XummContext)
  return (
    <button className='btn-primary btn' onClick={connect}>
      <span className='sm:hidden'>Connect</span>
      <span className='hidden sm:inline'>Connect Wallet </span>
    </button>
  )
}
