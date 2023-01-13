import { useContext } from 'react'

import { AuthContext } from '@/context/authContext'

export const ConnectWallet = () => {
  const { connect } = useContext(AuthContext)
  return (
    <button className='btn-primary btn' onClick={connect}>
      Connect Wallet
    </button>
  )
}
