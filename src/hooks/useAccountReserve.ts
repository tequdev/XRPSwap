import { useContext, useEffect, useMemo, useState } from 'react'

import { AuthContext } from '@/app/context/authContext'
import { getAccountInfo, getServerInfo } from '@/libs/xrpl'

type ServerReserve = {
  baseReserve: number
  incReserve: number
}

export const useAccountReserve = () => {
  const { account } = useContext(AuthContext)
  const [serverReserve, setServerReserve] = useState<ServerReserve>({ baseReserve: 10, incReserve: 2 })
  const [ownerCount, setOwnerCount] = useState(0)

  useEffect(() => {
    getServerInfo().then((res) => {
      const validated_ledger = res.info.validated_ledger
      if (validated_ledger) {
        const { reserve_base_xrp: baseReserve, reserve_inc_xrp: incReserve } = validated_ledger
        setServerReserve({ baseReserve, incReserve })
      }
    })
  }, [])

  useEffect(() => {
    if (!account) return
    getAccountInfo(account).then((result) => {
      setOwnerCount(result.account_data.OwnerCount)
    })
  }, [account])

  const reserve = useMemo(
    () => serverReserve.baseReserve + serverReserve.incReserve * ownerCount,
    [ownerCount, serverReserve.baseReserve, serverReserve.incReserve]
  )

  return reserve
}
