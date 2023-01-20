import GoogleAnalytics from './components/common/GoogleAnalytics'

const Head = () => {
  const host = 'http://XRPSw.app'
  return (
    <>
      <title>XRPSwap</title>
      <meta name='viewport' content='viewport-fit=cover, initial-scale=1.0, width=device-width' />
      <meta name='description' content='Swap XRP Ledger tokens' />
      <meta property='og:type' key='og:type' content='website' />
      <meta property='og:url' key='og:url' content={host} />
      <meta property='og:title' key='og:title' content='XRPSwap' />
      <meta property='og:image' key='og:image' content={`${host}/api/ogp/twitter-card`} />
      <meta name='og:description' key='og:description' content='Swap XRP Ledger tokens' />
      <meta name='twitter:card' key='twitter:card' content='summary_large_image' />
      <link rel='icon' href='/favicon.svg' />
      <GoogleAnalytics />
    </>
  )
}

export default Head
