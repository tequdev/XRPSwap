import { ClientContextProvider } from '@xrpl-walletconnect/react'

import AuthContextProvider from '../context/authContext'
import CrossmarkContextProvider from '../context/crossmarkContext'
import XummContextProvider from '../context/xummContext'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!
const realyUrl = process.env.NEXT_PUBLIC_RELAY_URL!
const metadata = {
  name: 'XRPSwap',
  description: 'Swap your XRP Ledger Tokens',
  url: 'https://XRPSw.app',
  icons: [],
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CrossmarkContextProvider>
      <XummContextProvider>
        <ClientContextProvider projectId={projectId} relayUrl={realyUrl} metadata={metadata}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ClientContextProvider>
      </XummContextProvider>
    </CrossmarkContextProvider>
  )
}
