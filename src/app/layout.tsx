'use client'
import 'tailwindcss/tailwind.css'

import TokenContextProvider from './context/tokenContext'
import { AuthProvider } from './providers/AuthProvider'

import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

const MyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className='text-[14px] md:text-[16px]'>
      <body>
        <AuthProvider>
          <Header className='h-16 px-4 md:px-12' />
          <TokenContextProvider>
            <main className='min-h-[calc(100vh-4rem)] py-8 md:py-20'>
              {children}
              <div id='root' />
            </main>
          </TokenContextProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

export default MyApp
