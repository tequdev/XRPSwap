import 'tailwindcss/tailwind.css'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

const MyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export default MyApp
