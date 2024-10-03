import { useAccount, useSignAndSubmitTransaction } from '@xrpl-wallet-standard/react'
import { useCallback } from 'react'
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common'


export const useSetTrustLine = () => {
  const account = useAccount()
  const signAndSubmitTransaction = useSignAndSubmitTransaction()

  const setTrustLine = useCallback(
    async (trustLineAmount: IssuedCurrencyAmount) => {
      if (!account) return Promise.resolve(null)
      const payload = {
        TransactionType: 'TrustSet',
        Account: account.address,
        LimitAmount: trustLineAmount,
      } as const
      return await signAndSubmitTransaction(payload, 'xrpl:mainnet')
    },
    [account, signAndSubmitTransaction]
  )

  return { setTrustLine }
}
