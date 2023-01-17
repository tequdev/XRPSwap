'use client'
import { useContext } from 'react'

import { AccountInfo } from './AccountInfo'
import { ConnectWallet } from './ConnectWallet'

import { AuthContext } from '@/app/context/authContext'

export const HeaderRightButton = () => {
  const { state, loading } = useContext(AuthContext)
  return (
    <>
      {!loading && !state?.account && <ConnectWallet />}
      {!loading && state?.account && <AccountInfo />}
    </>
  )
}
