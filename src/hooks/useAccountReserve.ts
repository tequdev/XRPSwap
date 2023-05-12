import { useContext, useEffect, useMemo, useState } from 'react'

import { XummContext } from '@/app/context/xummContext'
import { getAccountInfo, getServerInfo } from '@/libs/xrpl'

type ServerReserve = {
  baseReserve: number
  incReserve: number
}

export const useAccountReserve = () => {
  const { state } = useContext(XummContext)
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
    if (!state?.account) return
    getAccountInfo(state.account).then((result) => {
      setOwnerCount(result.account_data.OwnerCount)
    })
  }, [state?.account])

  const reserve = useMemo(
    () => serverReserve.baseReserve + serverReserve.incReserve * ownerCount,
    [ownerCount, serverReserve.baseReserve, serverReserve.incReserve]
  )

  return reserve
}
