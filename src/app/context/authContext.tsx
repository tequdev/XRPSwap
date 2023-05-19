'use client'
import { mainnet, testnet, devnet } from '@xrpl-walletconnect/core'
import { useWalletConnectClient } from '@xrpl-walletconnect/react'
import React, { createContext, FC, useContext, useEffect } from 'react'

import { XummContext } from './xummContext'

import { usePayloadOpen } from '@/hooks/usePayloadOpen'

type Context = {
  runtime: 'browser' | 'xumm-xapp'
  connect: (string: 'xumm' | 'walletconnect') => Promise<void>
  disconnect: () => Promise<void>
  account: string | undefined
  signTransaction: (txJson: Record<string, any>) => Promise<boolean>
  loading: boolean
  isConnected: boolean
}

export const AuthContext = createContext<Context>(null as any)

const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'TESTNET'

const AuthContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    connect: connectWithXumm,
    disconnect: disconnectFromXumm,
    runtime: xummRuntime,
    state,
    loading: xummLoading,
    isConnected: isXummConnected,
    sdk,
  } = useContext(XummContext)
  const {
    connect: connectWithWalletConnect,
    disconnect: disconnectFromWalletConnect,
    signTransaction: signTransactionWithWalletconnect,
    isInitializing: walletconnectLoading,
    accounts: walletconnectAccounts,
    chains,
    setChains,
  } = useWalletConnectClient()
  const { openWindow, signed } = usePayloadOpen()

  const runtime: Context['runtime'] = xummRuntime.xapp ? 'xumm-xapp' : 'browser'

  useEffect(() => {
    let chain: typeof mainnet
    if (NETWORK === 'MAINNET') {
      chain = mainnet
    } else if (NETWORK === 'TESTNET') {
      chain = testnet
    } else if (NETWORK === 'DEVNET') {
      chain = devnet
    } else {
      throw new Error('Invalid NETWORK')
    }
    setChains([chain.id])
  }, [setChains])

  const connectedService = state?.account
    ? 'xumm'
    : walletconnectAccounts.length && walletconnectAccounts[0]
    ? 'walletconnect'
    : undefined

  const connect: Context['connect'] = async (service: 'xumm' | 'walletconnect') => {
    if (service === 'xumm') {
      await connectWithXumm()
    } else {
      await connectWithWalletConnect()
    }
  }

  const disconnect: Context['disconnect'] = async () => {
    if (isXummConnected) {
      await disconnectFromXumm()
    } else if (walletconnectAccounts.length) {
      await disconnectFromWalletConnect()
    }
  }

  const account: Context['account'] =
    state?.account || (walletconnectAccounts.length && walletconnectAccounts[0]) || undefined

  const signTransaction: Context['signTransaction'] = async (txjson) => {
    if (connectedService === 'xumm') {
      const payload = {
        txjson,
        options: {
          expire: 15,
        },
      } as const
      const createdPayload = await sdk?.create(payload as any).then((payload) => payload)
      if (createdPayload) {
        openWindow(createdPayload)
        return new Promise<boolean>((resolve) => {
          if (typeof signed === 'boolean') {
            resolve(signed)
          }
        })
      } else {
        return false
      }
    } else {
      const result = await signTransactionWithWalletconnect(chains[0], txjson)
      // TODO: check result
      return !!result
    }
  }

  const loading = xummLoading || walletconnectLoading

  const isConnected = !!account

  return (
    <AuthContext.Provider
      value={{
        runtime,
        connect,
        disconnect,
        account,
        signTransaction,
        loading,
        isConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
