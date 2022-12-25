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
  authorization: { Authorization: string } | undefined
}

export const AuthContext = createContext<Context>(null as any)

const AuthContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Context['state'] | undefined | null>(null)

  const loading = useMemo(() => state === null, [state])

  useEffect(() => {
    xumm.on('retrieved', async () => {
      const xummState = await xumm.state()
      setState(xummState)
    })
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
    return xumm.logout()
  }, [])

  const authorization = useMemo(
    () => (state?.jwt ? { Authorization: `bearer ${state?.jwt}` } : undefined),
    [state?.jwt]
  )

  return (
    <AuthContext.Provider value={{ connect, disconnect, state, loading, authorization }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
