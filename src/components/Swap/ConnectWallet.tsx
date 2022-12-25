import { useContext } from 'react'

import { AuthContext } from '@/context/authContext'

export const ConnectWallet = () => {
  const { connect } = useContext(AuthContext)
  return (
    <button
      className='flex h-16 w-[420px] items-center justify-center rounded-xl bg-blue-500 text-2xl text-white'
      onClick={connect}
    >
      Connect Wallet
    </button>
  )
}
