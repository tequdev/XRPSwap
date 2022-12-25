import 'tailwindcss/tailwind.css'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import AuthContextProvider from '@/context/authContext'

const MyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        <Header />
        <main>
          <AuthContextProvider>{children}</AuthContextProvider>
          <div id='root' />
        </main>
        <Footer />
      </body>
    </html>
  )
}

export default MyApp
