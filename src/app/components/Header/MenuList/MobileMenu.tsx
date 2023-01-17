import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { overrideTailwindClasses } from 'tailwind-override'

import { SwapIcon } from '../../Icon/Swap'
import { TokenIcon } from '../../Icon/Token'

export const MobileMenu = () => {
  const pathname = usePathname()
  return (
    <div
      className={overrideTailwindClasses(
        'btm-nav z-50 m-2  w-auto rounded-3xl border-[1px] border-gray-200 pb-0 md:hidden ' +
          'mb-[calc(env(safe-area-inset-bottom)+8px)]'
      )}
    >
      <button
        className={overrideTailwindClasses('text-gray-300 ' + (pathname === '/' ? 'text-black ' : '') + 'rounded-3xl')}
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
  )
}
