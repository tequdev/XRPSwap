'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'

import { SwapIcon } from '../../Icon/Swap'
import { TokenIcon } from '../../Icon/Token'

import { AuthContext } from '@/app/context/authContext'

export const PCMenu = () => {
  const pathname = usePathname()
  const { state, loading } = useContext(AuthContext)

  return (
    <>
      <li className={pathname === '/' ? 'border-b-2 border-gray-600' : ''}>
        <Link href='/' className='pl-2 pb-2'>
          <SwapIcon className='h-6 w-6 text-black' />
          Swap
        </Link>
      </li>
      <li className={pathname === '/tokens' ? 'border-b-2 border-gray-600' : ''}>
        <Link href='/tokens' className='pl-2 pb-2'>
          <TokenIcon className='h-6 w-6 text-black' />
          Tokens
        </Link>
      </li>
    </>
  )
}
