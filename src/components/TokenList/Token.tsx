import Image from 'next/image'
import { FC } from 'react'

import { TokensMarketData } from '@/@types/xrpl'
import { useSetTrustLine } from '@/hooks/useSetTrustLine'
import { parseCurrencyCode } from '@/utils/xrpl'

type Props = {
  index: number
  data: TokensMarketData
}

export const Token: FC<Props> = ({ index, data }) => {
  const { setTrustLine } = useSetTrustLine()
  const handleSetTrustLine = async () => {
    console.log(
      await setTrustLine({
        issuer: data.issuer,
        currency: parseCurrencyCode(data.currency),
        value: data.supply.toString(),
      })
    )
  }
  return (
    <div className='card my-2 flex flex-col gap-6 rounded-xl bg-base-200 p-6 pt-8 shadow-xl'>
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
            <div className='text-3xl'>${data.price.toFixed(2)}</div>
          </div>
          <div className='ml-8 pl-2 text-sm text-gray-400'>{data.currency !== data.name ? data.name : data.issuer}</div>
          <div className='flex'>
            <div className='stat place-items-center'>
              <div className='stat-title'>Market Cap</div>
              <div className='stat-value text-xl'>${data.market_cap.toLocaleString()}</div>
              <div className='stat-desc'>&nbsp;</div>
            </div>
            <div className='stat place-items-center'>
              <div className='stat-title'>Volume</div>
              <div className='stat-value text-xl'>${data.volume.toLocaleString()}</div>
              <div className='stat-desc'>24h</div>
            </div>
            <div className='stat place-items-center'>
              <div className='stat-title'>Trades</div>
              <div className='stat-value text-xl'>{data.trades.toLocaleString()}</div>
              <div className='stat-desc'>24h</div>
            </div>
          </div>
          <div className='card-actions justify-end'>
            <button className='btn-primary btn-sm btn' onClick={handleSetTrustLine}>
              Set Trustline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
