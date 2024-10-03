import { useWallet } from '@xrpl-wallet-standard/react'
import Image from 'next/image'
import { FC, useContext, useMemo } from 'react'

import { CheckIcon } from '../Icon/Check'

import { TokensMarketData } from '@/@types/xrpl'
import { TokenContext } from '@/app/context/tokenContext'
import { useSetTrustLine } from '@/hooks/useSetTrustLine'
import { significantDigits } from '@/utils/number'
import { parseCurrencyCode } from '@/utils/xrpl'

type Props = {
  index: number
  data: TokensMarketData
}

const Token: FC<Props> = ({ index, data }) => {
  const { status } = useWallet()
  const isConnected = status === 'connected'
  const { currencies, refetch } = useContext(TokenContext)
  const { setTrustLine } = useSetTrustLine()

  const hasTrustLined = useMemo(() => {
    return currencies.some((c) => c.issuer === data.issuer && c.currency === parseCurrencyCode(data.currency))
  }, [currencies, data.currency, data.issuer])

  const handleSetTrustLine = async () => {
    const payload = await setTrustLine({
      issuer: data.issuer,
      currency: parseCurrencyCode(data.currency),
      value: data.supply.toString(),
    })
  }

  return (
    <div className='card m-2 flex flex-col gap-6 rounded-xl bg-base-200 p-6 pt-8 shadow-xl'>
      <div className='flex'>
        <div className='w-full'>
          <div className='absolute top-2 left-4 font-bold'>#{index}</div>
          <div className='flex w-full justify-between'>
            <div className='flex items-center'>
              <div className='mr-2 flex h-8 w-8 items-center justify-center'>
                {data.logo && <Image src={data.logo} alt={data.currency} unoptimized height={32} width={32} />}
              </div>
              <div className='text-2xl'>{data.currency}</div>
            </div>
            <div className='text-3xl'>${significantDigits(data.price, 4)}</div>
          </div>
          <div className='ml-8 pl-2 text-sm text-gray-400'>{data.currency !== data.name ? data.name : data.issuer}</div>
          <div className='flex flex-col md:flex-row'>
            <div className='stat place-items-center pb-0 md:pb-4'>
              <div className='stat-title'>Market Cap</div>
              <div className='stat-value text-xl'>${data.market_cap.toLocaleString()}</div>
              <div className='stat-desc hidden md:block'>&nbsp;</div>
            </div>
            <div className='stat place-items-center'>
              <div className='stat-title'>Volume</div>
              <div className='stat-value text-xl'>${data.volume.toLocaleString()}</div>
              <div className='stat-desc'>24h</div>
            </div>
            <div className='stat place-items-center pt-0 md:pt-4'>
              <div className='stat-title'>Trades</div>
              <div className='stat-value text-xl'>{data.trades.toLocaleString()}</div>
              <div className='stat-desc'>24h</div>
            </div>
          </div>
          <div className='card-actions justify-end'>
            {isConnected && hasTrustLined && (
              <button className='btn-disabled btn-primary btn-sm btn text-gray-200'>
                <CheckIcon className='mr-1 h-6 w-6' />
                Trustline
              </button>
            )}
            {isConnected && !hasTrustLined && (
              <button className='btn-outline btn-primary btn-sm btn' onClick={handleSetTrustLine}>
                Set Trustline
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Token
