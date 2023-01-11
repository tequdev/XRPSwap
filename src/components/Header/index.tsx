import Link from 'next/link'

export const Header = () => {
  const MenuList = () => {
    return (
      <>
        <li>
          <Link href='/'>Swap</Link>
        </li>
        <li>
          <Link href='/tokens'>Tokens</Link>
        </li>
      </>
    )
  }
  return (
    <header className='navbar bg-base-100'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <label tabIndex={0} className='btn-ghost btn lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h8m-8 6h16' />
            </svg>
          </label>
          <ul tabIndex={0} className='dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow'>
            <MenuList />
          </ul>
        </div>
        <Link href='/'>
          <span className='btn-ghost btn text-xl normal-case'>xLedger</span>
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1'>
          <MenuList />
        </ul>
      </div>
      <div className='navbar-end'>
        <Link href=''>
          <span className='btn-primary btn'>Get started</span>
        </Link>
      </div>
    </header>
  )
}
