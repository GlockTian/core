import Container from '@mui/material/Container'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { PageWrapper } from '../PageWrapper'
import { ShareDialog } from '../ShareDialog'
import { VideoGrid } from '../VideoGrid/VideoGrid'
import { useVideo } from '../../libs/videoContext'
import { useVideoChildren } from '../../libs/useVideoChildren'
import { ContainerDescription } from './ContainerDescription'
import { ContainerHero } from './ContainerHero'

// Usually Series or Collection Videos
export function VideoContainerPage(): ReactElement {
  const { snippet, slug, variant } = useVideo()
  const { loading, children } = useVideoChildren(variant?.slug)
  const router = useRouter()
  const [shareDialog, setShareDialog] = useState<boolean>(false)
  const routeArray: string[] = []

  function handleOpenDialog(): void {
    setShareDialog(true)
  }

  function handleCloseDialog(): void {
    setShareDialog(false)
  }

  if (router != null) {
    Object.values(router?.query).forEach((value) => {
      if (typeof value === 'string') {
        routeArray.push(value)
      }
    })
  }

  return (
    <PageWrapper hero={<ContainerHero openDialog={handleOpenDialog} />}>
      <Container maxWidth="xxl">
        <Stack
          spacing={{ xs: 4, md: 11 }}
          py={{ xs: 7, md: 17 }}
          direction="column"
        >
          <ContainerDescription
            value={snippet[0].value}
            openDialog={handleOpenDialog}
          />
          <ShareDialog open={shareDialog} onClose={handleCloseDialog} />
          <Box>
            {loading ? (
              <VideoGrid loading variant="expanded" />
            ) : (
              <VideoGrid
                containerSlug={slug}
                videos={children}
                variant="expanded"
              />
            )}
          </Box>
        </Stack>
      </Container>
    </PageWrapper>
  )
}
