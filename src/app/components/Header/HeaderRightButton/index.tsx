'use client'
import { useContext } from 'react'

import { AccountInfo } from './AccountInfo'
import { ConnectWallet } from './ConnectWallet'

import { AuthContext } from '@/app/context/authContext'

export const HeaderRightButton = () => {
  const { isConnected, loading } = useContext(AuthContext)
  return (
    <>
      {!loading && !isConnected && <ConnectWallet />}
      {!loading && isConnected && <AccountInfo />}
    </>
  )
}
