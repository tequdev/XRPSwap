'use client'

import { useAccount, ConnectButton } from '@xrpl-wallet-standard/react'

import { AccountInfo } from './AccountInfo'

const HeaderRightButton = () => {
  const account = useAccount()
  return (
    <>
      {!account && <ConnectButton />}
      {!!account && <AccountInfo />}
    </>
  )
}

export default HeaderRightButton
