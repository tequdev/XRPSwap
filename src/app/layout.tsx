'use client'
import 'tailwindcss/tailwind.css'

import { TokenContextProvider } from './context/tokenContext'

import { Footer } from '@/app/components/Footer'
import { Header } from '@/app/components/Header'
import AuthContextProvider from '@/app/context/authContext'

const MyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className='text-[14px] md:text-[16px]'>
      <body>
        <AuthContextProvider>
          <Header className='h-16 px-4 md:px-12' />
          <TokenContextProvider>
            <main className='min-h-[calc(100vh-4rem)] py-16 md:py-28'>
              {children}
              <div id='root' />
            </main>
          </TokenContextProvider>
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  )
}

export default MyApp
