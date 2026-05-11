const FaviconHead = () => {
  const isStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging'
  const isDev = process.env.NODE_ENV === 'development'

  const prefix = isDev ? '/dev-' : isStaging ? '/staging-' : '/'
  const manifestPath = isDev
    ? '/dev-manifest.json'
    : isStaging
      ? '/staging-manifest.json'
      : '/manifest.json'

  return (
    <>
      <link href={prefix + 'favicon-32x32.png'} rel="shortcut icon" type="image/x-icon" />
      <link href={prefix + 'apple-touch-icon.png'} rel="apple-touch-icon" />
      <link rel="apple-touch-icon" sizes="57x57" href={prefix + 'apple-icon-57x57.png'} />
      <link rel="apple-touch-icon" sizes="60x60" href={prefix + 'apple-icon-60x60.png'} />
      <link rel="apple-touch-icon" sizes="72x72" href={prefix + 'apple-icon-72x72.png'} />
      <link rel="apple-touch-icon" sizes="76x76" href={prefix + 'apple-icon-76x76.png'} />
      <link rel="apple-touch-icon" sizes="114x114" href={prefix + 'apple-icon-114x114.png'} />
      <link rel="apple-touch-icon" sizes="120x120" href={prefix + 'apple-icon-120x120.png'} />
      <link rel="apple-touch-icon" sizes="144x144" href={prefix + 'apple-icon-144x144.png'} />
      <link rel="apple-touch-icon" sizes="152x152" href={prefix + 'apple-icon-152x152.png'} />
      <link rel="apple-touch-icon" sizes="180x180" href={prefix + 'apple-icon-180x180.png'} />
      <link rel="icon" type="image/png" sizes="192x192" href={prefix + 'android-icon-192x192.png'} />
      <link rel="icon" href={prefix + 'favicon.ico'} />
      <link rel="icon" type="image/png" sizes="32x32" href={prefix + 'favicon-32x32.png'} />
      <link rel="icon" type="image/png" sizes="96x96" href={prefix + 'favicon-96x96.png'} />
      <link rel="icon" type="image/png" sizes="16x16" href={prefix + 'favicon-16x16.png'} />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16-light.png"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16-dark.png"
        media="(prefers-color-scheme: dark)"
      />
      <link rel="manifest" href={manifestPath} />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content={prefix + 'ms-icon-144x144.png'} />
      <meta name="theme-color" content="#ffffff" />
    </>
  )
}

export default FaviconHead
