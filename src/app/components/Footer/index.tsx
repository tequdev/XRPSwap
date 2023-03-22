import { LogoIcon } from '../Icon/Logo'

import Socials from './Socials'

const Footer = () => {
  return (
    <footer className='footer grid grid-cols-12 items-center justify-between gap-y-2 bg-base-200 p-4 pb-[calc(env(safe-area-inset-bottom)+6rem)] text-base-content md:flex md:px-12 md:pb-4'>
      <div className='col-span-12 flex w-full items-center justify-between'>
        <div className='flex items-center'>
          <LogoIcon className='h-12 w-12' />
          <span className='ml-1 text-2xl font-semibold'>XRPSwap</span>
          <p className='ml-4 hidden md:inline'>Copyright © 2023 XRPSwap - All right reserved</p>
        </div>
        <div className='block md:hidden'>
          <Socials />
        </div>
      </div>
      <div className='hidden md:block'>
        <Socials />
      </div>
      <div className='col-span-12 flex w-full justify-center md:hidden'>
        <p className='inline text-center md:hidden'>Copyright © 2023 XRPSwap - All right reserved</p>
      </div>
    </footer>
  )
}

export default Footer
