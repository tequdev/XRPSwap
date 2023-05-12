import { useContext } from 'react'

import { AuthContext } from '@/app/context/authContext'

export const ConnectWallet = () => {
  const { connect } = useContext(AuthContext)
  return (
    // TODO: Select Wallet (Xumm/WalletConnect)
    <button className='btn-primary btn' onClick={() => connect('xumm')}>
      <span className='sm:hidden'>Connect</span>
      <span className='hidden sm:inline'>Connect Wallet </span>
    </button>
  )
}
