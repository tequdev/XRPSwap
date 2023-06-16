interface Window {
  crossmark?: {
    origin: any
    channelId: any
    active: any
    uuid: any
    connected: any
    target: any
    timestamp: any
    source: any
    activeRequests: any
    sign: (json: Record<string, any>) => Promise<{
      data: Record<string, any>
      id: string
      type: string
    }>
    isConnected: any
    isLocked: any
    isOpen: any
    version: any
  }
}
