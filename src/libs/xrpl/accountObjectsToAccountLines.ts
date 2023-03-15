import { AccountLinesResponse, AccountObjectsResponse } from 'xrpl'
import { RippleState } from 'xrpl/dist/npm/models/ledger'

type TrustLine = AccountLinesResponse['result']['lines'][number]
type AccountObject = AccountObjectsResponse['result']['account_objects'][number]

const objectFlags = {
  lsfLowReserve: 0x00010000,
  lsfHighReserve: 0x00020000,
  lsfLowNoRipple: 0x00100000,
  lsfHighNoRipple: 0x00200000,
}

/**
 * This function returns account_lines line results
 * based on account_objects (type = state) results,
 * » Returns only the account_lines to show based on:
 *   - Counts towards your reserve
 */
export const accountObjectsToAccountLines = (
  account: string,
  accountObjectArray: AccountObject[],
  suppressIncoming: boolean
): TrustLine[] => {
  const notInDefaultState = accountObjectArray.filter((obj): obj is RippleState => {
    return !!(
      obj.Flags &&
      obj.LedgerEntryType === 'RippleState' &&
      objectFlags[obj.HighLimit.issuer === account ? 'lsfHighReserve' : 'lsfLowReserve']
    )
  })

  const accountLinesFormatted = notInDefaultState.map((obj): TrustLine => {
    const parties = [obj.HighLimit, obj.LowLimit]
    const [self, counterparty] = obj.HighLimit.issuer === account ? parties : parties.reverse()

    const ripplingFlags = [
      (objectFlags.lsfHighNoRipple & obj.Flags) == objectFlags.lsfHighNoRipple,
      (objectFlags.lsfLowNoRipple & obj.Flags) == objectFlags.lsfLowNoRipple,
    ]
    const [no_ripple, no_ripple_peer] = obj.HighLimit.issuer === account ? ripplingFlags : ripplingFlags.reverse()

    const balance = obj.Balance.value === '0' ? obj.Balance.value : obj.Balance.value.slice(1)

    return {
      account: counterparty.issuer,
      balance,
      currency: self.currency,
      limit: self.value,
      limit_peer: counterparty.value,
      no_ripple,
      no_ripple_peer,
      // Dealing with Type Errors
      quality_in: 0,
      quality_out: 0,
    }
  })

  return accountLinesFormatted.filter((l) => {
    if (suppressIncoming) {
      if (l.limit === '0' && (l.balance === '0' || l.balance.slice(0, 1) === '-')) {
        return false
      }
    }
    return true
  })
}
