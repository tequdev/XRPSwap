'use client'
import { useContext } from 'react'

import { AccountInfo } from './AccountInfo'

import { ConnectWallet } from '@/app/components/Button/ConnectWallet'
import { AuthContext } from '@/app/context/authContext'

const HeaderRightButton = () => {
  const { isConnected, loading } = useContext(AuthContext)
  return (
    <>
      {!loading && !isConnected && <ConnectWallet />}
      {!loading && isConnected && <AccountInfo />}
    </>
  )
}

export default HeaderRightButton
