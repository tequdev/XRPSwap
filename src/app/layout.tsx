'use client'
import 'tailwindcss/tailwind.css'

import { Footer } from '@/app/components/Footer'
import { Header } from '@/app/components/Header'
import AuthContextProvider from '@/app/context/authContext'

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
