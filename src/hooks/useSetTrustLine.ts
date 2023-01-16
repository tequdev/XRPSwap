import { useCallback, useContext } from 'react'
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common'

import { AuthContext } from '@/app/context/authContext'

export const useSetTrustLine = () => {
  const { state, sdk } = useContext(AuthContext)

  const setTrustLine = useCallback(
    async (trustLineAmount: IssuedCurrencyAmount) => {
      if (!state?.account) return Promise.resolve(null)
      const payload = {
        TransactionType: 'TrustSet',
        Account: state.account,
        LimitAmount: trustLineAmount,
      } as const
      return sdk?.create(payload).then((payload) => payload)
    },
    [sdk, state?.account]
  )

  return { setTrustLine }
}
