'use client'
import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Xumm } from 'xumm'

import { PromiseType } from '@/@types/utils'

const xumm = new Xumm(process.env.NEXT_PUBLIC_XUMM_APIKEY!, process.env.XUMM_SECRET!)

type XummUser = { [P in keyof Xumm['user']]: PromiseType<Xumm['user'][P]> }

type Context = {
  runtime: Xumm['runtime']
  connect: Xumm['authorize']
  disconnect: Xumm['logout']
  state: XummUser | undefined | null
  sdk: Xumm['payload']
  xapp: Xumm['xapp']
  loading: boolean
  isConnected: boolean
}

export const AuthContext = createContext<Context>(null as any)

const AuthContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Context['state'] | undefined | null>(null)

  const loading = useMemo(() => false && state === null, [state])

  const getUser = useCallback(async () => {
    const user = xumm.user
    const promisedUserArray = await Promise.all(
      (Object.keys(user) as (keyof typeof user)[]).map(async (u) => {
        return { [u]: await user[u] }
      })
    )
    return Object.assign({}, ...promisedUserArray) as Promise<XummUser>
  }, [])

  useEffect(() => {
    const handler = async () => {
      setState(await getUser())
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
  }, [getUser])

  const connect = useCallback(() => {
    return (
      xumm
        .authorize()
        // .then((auth) => {
        //   setState(auth)
        //   return auth
        // })
        ?.catch((e) => {
          console.error(e.message)
          return undefined
        })
    )
  }, [])

  const disconnect = useCallback(async () => {
    if (xumm.runtime.xapp) {
      await xumm.xapp?.close()
    } else {
      await xumm.logout()
    }
    // https://github.com/XRPL-Labs/XummPkce/pull/3
    setState(undefined)
  }, [])

  const isConnected = useMemo(() => !!state?.account, [state?.account])

  return (
    <AuthContext.Provider
      value={{
        runtime: xumm.runtime,
        connect,
        disconnect,
        state,
        sdk: xumm.payload,
        xapp: xumm.xapp,
        loading,
        isConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
