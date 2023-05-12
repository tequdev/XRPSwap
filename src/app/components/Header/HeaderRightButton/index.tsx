'use client'
import { useContext } from 'react'

import { AccountInfo } from './AccountInfo'
import { ConnectWallet } from './ConnectWallet'

import { XummContext } from '@/app/context/xummContext'

const HeaderRightButton = () => {
  const { isConnected, loading } = useContext(XummContext)
  return (
    <>
      {!loading && !isConnected && <ConnectWallet />}
      {!loading && isConnected && <AccountInfo />}
    </>
  )
}

export default HeaderRightButton
