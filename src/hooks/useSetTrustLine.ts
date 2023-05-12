import { useCallback, useContext } from 'react'
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common'

import { AuthContext } from '@/app/context/authContext'

export const useSetTrustLine = () => {
  const { account, signTransaction, isConnected } = useContext(AuthContext)

  const setTrustLine = useCallback(
    async (trustLineAmount: IssuedCurrencyAmount) => {
      if (!isConnected) return Promise.resolve(null)
      const payload = {
        TransactionType: 'TrustSet',
        Account: account,
        LimitAmount: trustLineAmount,
      } as const
      return signTransaction(payload)
    },
    [isConnected, signTransaction, account]
  )

  return { setTrustLine }
}
