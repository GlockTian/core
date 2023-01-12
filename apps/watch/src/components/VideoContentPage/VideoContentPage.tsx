import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ReactElement, useState } from 'react'
import { NextSeo } from 'next-seo'

import 'video.js/dist/video-js.css'

import { VideoLabel } from '../../../__generated__/globalTypes'
import { useVideo } from '../../libs/videoContext'
import { PageWrapper } from '../PageWrapper'
import { ShareDialog } from '../ShareDialog'
import { DownloadDialog } from '../DownloadDialog'
import { ShareButton } from '../ShareButton'
import { VideoCard } from '../VideoCard'
import { VideosCarousel } from '../VideosCarousel'
import { VideoChildFields } from '../../../__generated__/VideoChildFields'
import { videos } from '../Videos/testData'
import { DownloadButton } from './DownloadButton'
import { VideoHero } from './VideoHero'
import { VideoContent } from './VideoContent/VideoContent'
import { VideoContentCarousel } from './VideoContentCarousel'

const children = [
  {
    id: '2_video-0-0',
    image:
      'https://images.unsplash.com/photo-1670140274562-2496ccaa5271?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80',
    title: [{ value: 'video title' }],
    snippet: [
      {
        value: 'video description'
      }
    ],
    children: [
      {
        id: 'child.id',
        slug: 'slug',
        image: 'image url',
        imageAlt: [{ value: 'image alt' }],
        variant: {
          duration: 1
        },
        title: [{ value: 'child title' }]
      } as unknown as VideoChildFields
    ],
    slug: 'video-slug'
  }
] as unknown as VideoChildFields[]

// Usually FeatureFilm, ShortFilm, Episode or Segment Videos
export function VideoContentPage(): ReactElement {
  const {
    id,
    title,
    snippet,
    image,
    imageAlt,
    slug,
    variant,
    container,
    label
  } = useVideo()
  const [hasPlayed, setHasPlayed] = useState(false)
  const [openShare, setOpenShare] = useState(false)
  const [openDownload, setOpenDownload] = useState(false)

  return (
    <>
      <NextSeo
        title={title[0].value}
        description={snippet[0].value ?? undefined}
        openGraph={{
          type: 'website',
          title: title[0].value,
          url: `${
            process.env.NEXT_PUBLIC_WATCH_URL ??
            'https://watch-jesusfilm.vercel.app'
          }/${slug}`,
          description: snippet[0].value ?? undefined,
          images:
            image != null
              ? [
                  {
                    url: image,
                    width: 1080,
                    height: 600,
                    alt: imageAlt[0].value,
                    type: 'image/jpeg'
                  }
                ]
              : []
        }}
        facebook={
          process.env.NEXT_PUBLIC_FACEBOOK_APP_ID != null
            ? { appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID }
            : undefined
        }
        twitter={{
          site: '@YourNextStepIs',
          cardType: 'summary_large_image'
        }}
      />
      <PageWrapper
        hideHeader
        hero={
          <VideoHero onPlay={() => setHasPlayed(true)} hasPlayed={hasPlayed} />
        }
      >
        <>
          <VideoContentCarousel
            playing={hasPlayed}
            onShareClick={() => setOpenShare(true)}
            onDownloadClick={() => setOpenDownload(true)}
          />
          <Container maxWidth="xxl" sx={{ mb: 24 }}>
            <Stack
              direction="row"
              spacing="40px"
              sx={{
                mx: 0,
                mt: { xs: 5, md: 10 },
                mb: { xs: 5, md: 10 },
                maxWidth: '100%'
              }}
            >
              <VideoContent />
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Stack
                  spacing={5}
                  mb={8}
                  direction={{ md: 'column', lg: 'row' }}
                >
                  <DownloadButton
                    variant="button"
                    onClick={() => setOpenDownload(true)}
                  />
                  <ShareButton
                    variant="button"
                    onClick={() => setOpenShare(true)}
                  />
                </Stack>
              </Box>
            </Stack>
            {variant != null && variant.downloads.length > 0 && (
              <DownloadDialog
                open={openDownload}
                onClose={() => {
                  setOpenDownload(false)
                }}
              />
            )}
            <ShareDialog open={openShare} onClose={() => setOpenShare(false)} />
          </Container>
          {/* TODO: Replace with proper related video components */}
          {container == null && label === VideoLabel.featureFilm && (
            <Stack sx={{ mb: 14 }}>
              <Container maxWidth="xxl">
                <Typography variant="h4" gutterBottom sx={{ mb: 6 }}>
                  {title[0].value} Scenes
                </Typography>
              </Container>
              <VideosCarousel
                videos={videos[19]}
                activeVideo={id}
                renderItem={(props: Parameters<typeof VideoCard>[0]) => {
                  return (
                    <VideoCard
                      {...props}
                      containerSlug={slug}
                      imageSx={{
                        ...props.imageSx,
                        border: '1px solid rgba(255, 255, 255, .12)',
                        borderRadius: '9px'
                      }}
                    />
                  )
                }}
              />
            </Stack>
          )}
        </>
      </PageWrapper>
    </>
  )
}
