import { FC, useContext, useMemo } from 'react'

import { SwapContext } from '@/app/context/swapContext'
import { TokenContext } from '@/app/context/tokenContext'

type Props = {
  onClick: () => Promise<void>
}
export const SwapButton: FC<Props> = ({ onClick }) => {
  const { currencies: swapInfo, pathLoading, isFullPath } = useContext(SwapContext)
  const { currencies: tokenInfo } = useContext(TokenContext)

  const swapFrom = useMemo(() => swapInfo.from, [swapInfo])

  const tokenFrom = useMemo(
    () => tokenInfo.find((c) => c.issuer === swapFrom.issuer && c.currency === swapFrom.currency),
    [swapFrom.currency, swapFrom.issuer, tokenInfo]
  )!

  const hasSufficientFunds = useMemo(() => swapFrom.value <= tokenFrom?.balance, [swapFrom.value, tokenFrom?.balance])

  const ButtonLabel = () => {
    if (pathLoading) {
      return <div className='h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent' />
    }
    if (!hasSufficientFunds) {
      return <>Insufficient funds</>
    }
    if (isFullPath === false) {
      return (
        <div className='relative'>
          <div>Swap</div>
          <div className='text-xs'>It may find better path.</div>
          <div className='absolute inset-y-0 -right-12 my-auto h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent' />
        </div>
      )
    }
    return <>Swap</>
  }

  return (
    <button
      className='btn-primary btn flex h-16 w-full items-center justify-center rounded-xl text-2xl normal-case md:w-[420px]'
      disabled={pathLoading || !hasSufficientFunds}
      onClick={onClick}
    >
      <ButtonLabel />
    </button>
  )
}
