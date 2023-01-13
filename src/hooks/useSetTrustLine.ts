import { useCallback, useContext } from 'react'
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common'

import { AuthContext } from '@/context/authContext'

export const useSetTrustLine = () => {
  const { state } = useContext(AuthContext)

  const setTrustLine = useCallback(
    async (trustLineAmount: IssuedCurrencyAmount) => {
      if (!state) return Promise.resolve(null)
      const payload = {
        TransactionType: 'TrustSet',
        Account: state.me.account,
        LimitAmount: trustLineAmount,
      } as const
      console.log(payload)
      return state.sdk.payload.create(payload).then((payload) => payload)
    },
    [state]
  )

  return { setTrustLine }
}
