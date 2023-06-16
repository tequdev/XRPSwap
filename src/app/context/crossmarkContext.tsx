'use client'
import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react'

type Context = {
  account: string | undefined
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  sign: (json: Record<string, any>) => Promise<any>
  loading: boolean
  isConnected: boolean
}

export const CrossmarkContext = createContext<Context>(null as any)

const CrossmarkContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string>()

  const [loading, setLoading] = useState(false)

  useEffect(() => {}, [])

  const connect = useCallback(async () => {
    if (!window.crossmark) {
      return alert('Crossmark is not enabled')
    }
    setLoading(true)
    const signin = window.crossmark?.sign({ TransactionType: 'SignIn' })
    await signin
      .then((res) => {
        setLoading(false)
        setAddress(res.data.address)
      })
      .catch(() => {
        setLoading(false)
      })
    return
  }, [])

  const sign = async (json: Record<string, any>) => {
    if (!window.crossmark) {
      return alert('Crossmark is not enabled')
    }
    return window.crossmark.sign(json)
  }

  const disconnect = useCallback(async () => {
    setAddress(undefined)
  }, [])

  const isConnected = useMemo(() => !!address, [address])

  return (
    <CrossmarkContext.Provider
      value={{
        account: address,
        connect,
        disconnect,
        sign,
        loading,
        isConnected,
      }}
    >
      {children}
    </CrossmarkContext.Provider>
  )
}

export default CrossmarkContextProvider
