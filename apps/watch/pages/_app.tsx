import { ReactElement, useEffect } from 'react'
import { AppProps as NextJsAppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@core/shared/ui/ThemeProvider'
import { ThemeMode, ThemeName } from '@core/shared/ui/themes'
import { ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import TagManager from 'react-gtm-module'
import { datadogRum } from '@datadog/browser-rum'
import { DefaultSeo } from 'next-seo'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'
import { createEmotionCache } from '@core/shared/ui/createEmotionCache'

import 'swiper/swiper.min.css'
import '../public/fonts/fonts.css'
import { useApolloClient } from '../src/libs/apolloClient'

const clientSideEmotionCache = createEmotionCache({ prepend: false })

type WatchAppProps = NextJsAppProps & {
  emotionCache?: EmotionCache
}

export default function WatchApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache
}: WatchAppProps): ReactElement {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_GTM_ID != null &&
      process.env.NEXT_PUBLIC_GTM_ID !== ''
    )
      TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID })

    if (
      process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID != null &&
      process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID !== '' &&
      process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN != null &&
      process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN !== ''
    )
      datadogRum.init({
        applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
        clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        site: 'datadoghq.com',
        service: 'watch',
        env: process.env.NEXT_PUBLIC_VERCEL_ENV,
        version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
        sampleRate: 100,
        trackInteractions: true,
        defaultPrivacyLevel: 'mask-user-input'
      })

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles != null) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])
  const initialPageProps = pageProps as {
    initialApolloState?: NormalizedCacheObject
  }
  const client = useApolloClient({
    initialState: initialPageProps.initialApolloState
  })

  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <DefaultSeo
          titleTemplate="%s | Jesus Film Project"
          defaultTitle="Watch | Jesus Film Project"
          description="Free Gospel Video Streaming Library. Watch, learn and share the gospel in over 2000 languages."
        />
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider
          themeName={ThemeName.website}
          themeMode={ThemeMode.light}
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider>
  )
}
