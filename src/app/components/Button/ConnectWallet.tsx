import Image from 'next/image'
import { useContext } from 'react'

import walletconnect from '../../../../public/connects/walletconnect.svg'
import xumm from '../../../../public/connects/xumm.png'

import { AuthContext } from '@/app/context/authContext'

export const ConnectWallet = () => {
  const { connect } = useContext(AuthContext)
  return (
    <>
      <label htmlFor='my-modal' className='btn-primary btn'>
        <span className='sm:hidden'>Connect</span>
        <span className='hidden sm:inline'>Connect Wallet </span>
      </label>

      <input type='checkbox' id='my-modal' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='text-center text-2xl font-bold'>Select Wallet</h3>
          <div className='flex flex-col items-center p-4'>
            <button className='m-2 w-72' onClick={() => connect('xumm')}>
              <label htmlFor='my-modal'>
                <Image className='cursor-pointer' src={xumm} alt='xumm' />
              </label>
            </button>
            <button className='m-2 w-72 cursor-pointer' onClick={() => connect('walletconnect')}>
              <label htmlFor='my-modal'>
                <Image className='cursor-pointer' src={walletconnect} alt='walletconnect' />
              </label>
            </button>
          </div>
          <div className='modal-action'>
            <label htmlFor='my-modal' className='btn'>
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
