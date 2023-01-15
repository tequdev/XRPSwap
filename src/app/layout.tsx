'use client'
import 'tailwindcss/tailwind.css'

import { TokenContextProvider } from './context/tokenContext'

import { Footer } from '@/app/components/Footer'
import { Header } from '@/app/components/Header'
import AuthContextProvider from '@/app/context/authContext'

const MyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        <AuthContextProvider>
          <Header />
          <TokenContextProvider>
            <main>
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
