import { useOpenInWindow, UseOpenInWindowOptionsWithUrl } from 'use-open-window'

const options: UseOpenInWindowOptionsWithUrl = {
  url: '' /* url to page to open */,
  centered: true /* default */,
  specs: {
    width: 600 /* window width */,
    height: 790 /* window height */,
    directories: 'no',
    titlebar: 'no',
    toolbar: 'no',
    location: 'no',
    status: 'no',
    menubar: 'no',
    scrollbars: 'no',
    resizable: 'no',
  },
}

export const usePayloadOpen = () => {
  const [handleWindowOpen] = useOpenInWindow(options)
  const openWindow = (url: string) => {
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
      // ; (window).replace({ path: url }, '', url)
      location.replace(url)
    } else {
      handleWindowOpen(undefined as any, { ...options, url })
    }
  }
  return { openWindow }
}
