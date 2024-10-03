'use client'
import 'tailwindcss/tailwind.css'

import { CrossmarkWallet } from '@xrpl-wallet-adapter/crossmark'
import { WalletConnectWallet } from '@xrpl-wallet-adapter/walletconnect'
import { XamanWallet } from '@xrpl-wallet-adapter/xaman'
import { WalletProvider } from '@xrpl-wallet-standard/react'

import TokenContextProvider from './context/tokenContext'

import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

const wallets =
  typeof window === 'undefined'
    ? []
    : [
        new CrossmarkWallet(),
        new XamanWallet(process.env.NEXT_PUBLIC_XUMM_APIKEY!),
        new WalletConnectWallet({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
          networks: ['xrpl:1'],
        }),
      ]

const MyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className='text-[14px] md:text-[16px]'>
      <body>
        <WalletProvider registerWallets={wallets}>
          <Header className='h-16 px-4 md:px-12' />
          <TokenContextProvider>
            <main className='min-h-[calc(100vh-4rem)] py-8 md:py-20'>
              {children}
              <div id='root' />
            </main>
          </TokenContextProvider>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  )
}

export default MyApp
