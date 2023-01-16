import { useCallback, useContext, useEffect, useState } from 'react'
import { useOpenInWindow, UseOpenInWindowOptionsWithUrl } from 'use-open-window'
import type { Xumm } from 'xumm'
import { XummPostPayloadResponse } from 'xumm-sdk/dist/src/types'

import { PromiseType } from '@/@types/utils'
import { AuthContext } from '@/app/context/authContext'

const options: UseOpenInWindowOptionsWithUrl = {
  url: '' /* url to page to open */,
  centered: true /* default */,
  specs: {
    width: 600 /* window width */,
    height: 790 /* window height */,
    directories: 'no',
    titlebar: 'no',
    toolbar: 'no',
    location: 'no',
    status: 'no',
    menubar: 'no',
    scrollbars: 'no',
    resizable: 'no',
  },
}
type PayloadSubscription = PromiseType<PromiseType<ReturnType<NonNullable<Xumm['payload']>['subscribe']>>>

export const usePayloadOpen = () => {
  const { sdk } = useContext(AuthContext)
  const [subscription, setSubscription] = useState<PayloadSubscription | null>(null)
  const [handleWindowOpen, popup] = useOpenInWindow(options)
  const openWindow = useCallback(
    async (payload: XummPostPayloadResponse) => {
      const url = payload.next.always
      const uuid = payload.uuid
      if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
        location.replace(url)
      } else {
        handleWindowOpen(undefined as any, { ...options, url })
        if (!sdk) return
        const sub = await sdk?.subscribe(uuid)
        setSubscription(sub)
      }
    },
    [handleWindowOpen, sdk]
  )

  useEffect(() => {
    if (!subscription) return
    subscription.websocket.onmessage = (message) => {
      if (message.data.toString().match(/signed/)) {
        subscription.resolve()
      }
    }
    subscription.resolved?.then(() => {
      setSubscription(null)
      subscription.resolved
      setTimeout(() => popup?.close(), 750)
    })
  }, [popup, subscription])

  return { openWindow }
}
