import { useCallback, useContext, useEffect, useState } from 'react'
import { useOpenInWindow, UseOpenInWindowOptionsWithUrl } from 'use-open-window'
import type { Xumm } from 'xumm'
import { XummPostPayloadResponse } from 'xumm-sdk/dist/src/types'
import type { payloadEventData } from 'xumm-xapp-sdk'

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
  const [signed, setSigned] = useState<boolean>(false)
  const { sdk, runtime, xapp } = useContext(AuthContext)
  const [subscription, setSubscription] = useState<PayloadSubscription | null>(null)
  const [handleWindowOpen, popup] = useOpenInWindow(options)

  const xAppPayloadHandler = useCallback(() => {
    const handler = (event: payloadEventData) => {
      if (signed) return
      const result = event.reason === 'SIGNED'
      setSigned(result)
      return result
    }
    xapp?.on('payload', (event) => {
      const signed = handler(event)
      if (signed) {
        xapp?.off('payload', handler)
      }
    })
  }, [signed, xapp])

  const openWindow = useCallback(
    async (payload: XummPostPayloadResponse) => {
      const url = payload.next.always
      const uuid = payload.uuid
      if (runtime.xapp) {
        const openResult = await xapp?.openSignRequest({
          uuid: payload.uuid,
        })
        if (typeof openResult === 'boolean' && openResult) {
          xAppPayloadHandler()
        }
      } else if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
        location.replace(url)
      } else {
        handleWindowOpen(undefined as any, { ...options, url })
        if (!sdk) return
        const sub = await sdk?.subscribe(uuid)
        setSubscription(sub)
      }
    },
    [handleWindowOpen, runtime.xapp, sdk, xAppPayloadHandler, xapp]
  )

  useEffect(() => {
    if (!subscription || !runtime.browser) return
    subscription.websocket.onmessage = (message) => {
      if (message.data.toString().match(/signed/)) {
        const json = JSON.parse(message.data.toString())
        subscription.resolve(json.signed)
      }
    }
    subscription.resolved?.then((signed) => {
      setSubscription(null)
      setTimeout(() => popup?.close(), 750)
      setSigned(signed as boolean)
    })
  }, [popup, runtime.browser, subscription])

  return { openWindow, signed }
}
