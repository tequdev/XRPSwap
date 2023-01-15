import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { overrideTailwindClasses } from 'tailwind-override'

import { LogoIcon } from '../Icon/Logo'
import { SwapIcon } from '../Icon/Swap'
import { TokenIcon } from '../Icon/Token'

import { AccountInfo } from './AccountInfo'
import { ConnectWallet } from './ConnectWallet'

import { AuthContext } from '@/app/context/authContext'

export const Header = () => {
  const pathname = usePathname()
  const { state } = useContext(AuthContext)
  const MenuList = () => {
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
  return (
    <header className='navbar bg-base-100'>
      <div className='navbar-start'>
        <Link href='/' className='flex'>
          <LogoIcon className='h-12 w-12' />
          <div>
            <div className='btn-ghost btn flex-col items-start text-xl normal-case'>
              XRPSwap
              <span className='text-xs font-light'>Swap XRP Ledger tokens</span>
            </div>
          </div>
        </Link>
      </div>
      <div className='navbar-center hidden md:flex'>
        <ul className='menu menu-horizontal px-1'>
          <MenuList />
        </ul>
      </div>
      <div className='navbar-end'>
        {!state && <ConnectWallet />}
        {state && <AccountInfo />}
      </div>
      {/* eslint-disable-next-line tailwindcss/no-contradicting-classname */}
      <div
        className={overrideTailwindClasses(
          'btm-nav z-50 m-2  w-auto rounded-3xl border-[1px] border-gray-200 pb-0 md:hidden ' +
            'mb-[calc(env(safe-area-inset-bottom)+8px)]'
        )}
      >
        <button
          className={overrideTailwindClasses(
            'text-gray-300 ' + (pathname === '/' ? 'text-black ' : '') + 'rounded-3xl'
          )}
        >
          <Link href='/' className='flex flex-col items-center'>
            <SwapIcon className='h-8 w-8 text-current' />
            Swap
          </Link>
        </button>
        <button
          className={overrideTailwindClasses(
            'text-gray-300 ' + (pathname === '/tokens' ? 'text-black ' : '') + 'rounded-3xl'
          )}
        >
          <Link href='/tokens' className='flex flex-col items-center'>
            <TokenIcon className='h-8 w-8 text-current' />
            Tokens
          </Link>
        </button>
      </div>
    </header>
  )
}
