import Link from 'next/link'
import { FC } from 'react'
import { overrideTailwindClasses } from 'tailwind-override'

import { LogoIcon } from '../Icon/Logo'

import { HeaderRightButton } from './HeaderRightButton'
import { MobileMenu } from './MenuList/MobileMenu'
import { PCMenu } from './MenuList/PCMenu'

type Props = {
  className?: string
}
const Header: FC<Props> = ({ className }) => {
  return (
    <header className={overrideTailwindClasses('navbar bg-base-100 ' + className)}>
      <div className='navbar-start'>
        <Link href='/' className='flex'>
          <LogoIcon className='h-12 w-12' />
          <div>
            <div className='btn-ghost btn flex-col items-start text-xl normal-case'>
              XRPSwap
              <span className='hidden text-xs font-light sm:inline'>Swap XRP Ledger tokens</span>
            </div>
          </div>
        </Link>
      </div>
      <div className='navbar-center hidden md:flex'>
        <ul className='menu menu-horizontal px-1'>
          <PCMenu />
        </ul>
      </div>
      <div className='navbar-end'>
        <HeaderRightButton />
      </div>
      <MobileMenu />
    </header>
  )
}

export default Header
