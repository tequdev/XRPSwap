'use client'
import 'tailwindcss/tailwind.css'

import { ClientContextProvider } from '@xrpl-walletconnect/react'

import AuthContextProvider from './context/authContext'
import CrossmarkContextProvider from './context/crossmarkContext'
import TokenContextProvider from './context/tokenContext'
import XummContextProvider from './context/xummContext'

import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!
const realyUrl = process.env.NEXT_PUBLIC_RELAY_URL!
const metadata = {
  name: 'XRPSwap',
  description: 'Swap your XRP Ledger Tokens',
  url: 'https://XRPSw.app',
  icons: [],
}

const MyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className='text-[14px] md:text-[16px]'>
      <body>
        <CrossmarkContextProvider>
          <XummContextProvider>
            <ClientContextProvider projectId={projectId} relayUrl={realyUrl} metadata={metadata}>
              <AuthContextProvider>
                <Header className='h-16 px-4 md:px-12' />
                <TokenContextProvider>
                  <main className='min-h-[calc(100vh-4rem)] py-8 md:py-20'>
                    {children}
                    <div id='root' />
                  </main>
                </TokenContextProvider>
                <Footer />
              </AuthContextProvider>
            </ClientContextProvider>
          </XummContextProvider>
        </CrossmarkContextProvider>
      </body>
    </html>
  )
}

export default MyApp
