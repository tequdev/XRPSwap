import { useCallback, useContext } from 'react'
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common'

import { AuthContext } from '@/app/context/authContext'

export const useSetTrustLine = () => {
  const { state, sdk, isConnected } = useContext(AuthContext)

  const setTrustLine = useCallback(
    async (trustLineAmount: IssuedCurrencyAmount) => {
      if (!isConnected) return Promise.resolve(null)
      const payload = {
        TransactionType: 'TrustSet',
        Account: state!.account,
        LimitAmount: trustLineAmount,
        Flags: 131072
      } as const
      return sdk?.create(payload).then((payload) => payload)
    },
    [isConnected, sdk, state]
  )

  return { setTrustLine }
}
