'use client'
import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react'
import { XummPkce } from 'xumm-oauth2-pkce'

import { PromiseType } from '@/@types/utils'

const xumm = new XummPkce(process.env.NEXT_PUBLIC_XUMM_APIKEY!)

type XummPkceState = NonNullable<PromiseType<NonNullable<ReturnType<XummPkce['state']>>>>

type Context = {
  connect: XummPkce['authorize']
  disconnect: XummPkce['logout']
  state: XummPkceState | undefined | null
  loading: boolean
}

export const AuthContext = createContext<Context>(null as any)

const AuthContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Context['state'] | undefined | null>(null)

  const loading = useMemo(() => state === null, [state])

  useEffect(() => {
    const handler = async () => {
      const xummState = await xumm.state()
      setState(xummState)
    }
    const errorHandler = (e: Error) => {
      console.error(e)
    }
    xumm.on('success', handler)
    xumm.on('error', errorHandler)
    xumm.on('retrieved', handler)
    handler()
    return () => {
      xumm.off('success', handler)
      xumm.off('error', errorHandler)
      xumm.off('retrieved', handler)
    }
  }, [])

  const connect = useCallback(() => {
    return xumm
      .authorize()
      ?.then((auth) => {
        setState(auth)
        return auth
      })
      .catch((e) => {
        console.error(e.message)
        return undefined
      })
  }, [])

  const disconnect = useCallback(() => {
    xumm.logout()
    // https://github.com/XRPL-Labs/XummPkce/pull/3
    setState(undefined)
  }, [])

  return <AuthContext.Provider value={{ connect, disconnect, state, loading }}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
