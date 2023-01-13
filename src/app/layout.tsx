'use client'
import 'tailwindcss/tailwind.css'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import AuthContextProvider from '@/context/authContext'

const MyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        <AuthContextProvider>
          <Header />
          <main>
            {children}
            <div id='root' />
          </main>
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  )
}

export default MyApp
