import fetch from 'node-fetch'
import slugify from 'slugify'
import { omit } from 'lodash'
import {
  PrismaClient,
  Video,
  VideoType,
  VideoVariantDownloadQuality
} from '.prisma/api-videos-client'

const prisma = new PrismaClient()

interface MediaComponent {
  mediaComponentId: string
  primaryLanguageId: number
  title: string
  shortDescription: string
  longDescription: string
  metadataLanguageTag: string
  imageUrls: {
    mobileCinematicHigh: string
  }
  subType: string
  studyQuestions: string[]
}

interface MediaComponentLanguage {
  refId: string
  languageId: number
  lengthInMilliseconds: number
  subtitleUrls: {
    vtt?: Array<{
      languageId: number
      url: string
    }>
  }
  streamingUrls: {
    hls: Array<{
      url: string
    }>
  }
  downloadUrls: {
    low?: {
      url: string
      sizeInBytes: number
    }
    high?: {
      url: string
      sizeInBytes: number
    }
  }
}

interface Language {
  languageId: number
  bcp47: string
}

async function getLanguages(): Promise<Language[]> {
  const response: {
    _embedded: { mediaLanguages: Language[] }
  } = await (
    await fetch(
      `https://api.arclight.org/v2/media-languages?limit=5000&filter=default&apiKey=${
        process.env.ARCLIGHT_API_KEY ?? ''
      }`
    )
  ).json()
  return response._embedded.mediaLanguages
}

async function getMediaComponents(
  type: 'content' | 'container'
): Promise<MediaComponent[]> {
  const response: {
    _embedded: { mediaComponents: MediaComponent[] }
  } = await (
    await fetch(
      `https://api.arclight.org/v2/media-components?limit=5000&isDeprecated=false&type=${type}&contentTypes=video&apiKey=${
        process.env.ARCLIGHT_API_KEY ?? ''
      }`
    )
  ).json()
  return response._embedded.mediaComponents
}

async function getMediaComponentLanguage(
  mediaComponentId: string
): Promise<MediaComponentLanguage[]> {
  const response: {
    _embedded: { mediaComponentLanguage: MediaComponentLanguage[] }
  } = await (
    await fetch(
      `https://api.arclight.org/v2/media-components/${mediaComponentId}/languages?platform=android&apiKey=${
        process.env.ARCLIGHT_API_KEY ?? ''
      }`
    )
  ).json()
  return response._embedded.mediaComponentLanguage
}

let usedTitles: string[] = []

function getIteration(slug: string): string {
  const exists = usedTitles.find((t) => t === slug)
  if (exists != null && slug !== '') {
    const regex = slug.match(/^(.*?)-(\d+)$/)
    const iteration = parseInt(regex?.[2] ?? '1') + 1
    const title = regex?.[1] ?? slug
    const value = `${title}-${iteration}`
    return getIteration(value)
  }
  return slug
}

function createCoreSlug(title: string): string {
  return slugify(title, { lower: true, remove: /[^a-zA-Z\d\s:]/g })
}

function getSeoSlug(title: string): string {
  const slug = createCoreSlug(title)
  const newSlug = getIteration(slug)
  usedTitles.push(newSlug)
  return newSlug
}

async function digestContent(
  languages: Language[],
  mediaComponent: MediaComponent
): Promise<void> {
  const metadataLanguageId =
    languages
      .find(({ bcp47 }) => bcp47 === mediaComponent.metadataLanguageTag)
      ?.languageId.toString() ?? '529' // english by default

  console.log('content:', mediaComponent.mediaComponentId)

  const mediaComponentLanguages = await getMediaComponentLanguage(
    mediaComponent.mediaComponentId
  )

  const body: Video = {
    id: mediaComponent.mediaComponentId,
    type: VideoType.standalone,
    primaryLanguageId: mediaComponent.primaryLanguageId.toString(),
    image: mediaComponent.imageUrls.mobileCinematicHigh,
    episodeIds: [],
    noIndex: false,
    variantLanguageIds: mediaComponentLanguages.map((language) =>
      language.languageId.toString()
    )
  }
  await prisma.video.upsert({
    where: { id: mediaComponent.mediaComponentId },
    create: body,
    update: omit(body, ['id'])
  })

  for (const mediaComponentLanguage of mediaComponentLanguages) {
    await digestMediaComponentLanguage(mediaComponentLanguage, mediaComponent)
  }
  let position = 0
  for (const studyQuestion of mediaComponent.studyQuestions) {
    await prisma.videoStudyQuestionTranslation.upsert({
      where: {
        languageId_videoId_position: {
          languageId: metadataLanguageId,
          videoId: mediaComponent.mediaComponentId,
          position: position
        }
      },
      create: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId,
        value: studyQuestion,
        primary: true,
        position
      },
      update: {}
    })
    position++
  }
  await prisma.videoSlugTranslation.upsert({
    where: {
      languageId_videoId_value: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId,
        value: createCoreSlug(mediaComponent.title)
      }
    },
    create: {
      languageId: metadataLanguageId,
      videoId: mediaComponent.mediaComponentId,
      value: getSeoSlug(mediaComponent.title),
      primary: true
    },
    update: {}
  })
  await prisma.videoImageAltTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      languageId: metadataLanguageId,
      videoId: mediaComponent.mediaComponentId,
      value:
        mediaComponent.title.length <= 100
          ? mediaComponent.title
          : mediaComponent.title.substring(0, 99),
      primary: true
    },
    update: {
      value:
        mediaComponent.title.length <= 100
          ? mediaComponent.title
          : mediaComponent.title.substring(0, 99)
    }
  })
  await prisma.videoDescriptionTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      languageId: metadataLanguageId,
      videoId: mediaComponent.mediaComponentId,
      value: mediaComponent.longDescription,
      primary: true
    },
    update: {
      value: mediaComponent.longDescription
    }
  })
  await prisma.videoSnippetTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      languageId: metadataLanguageId,
      videoId: mediaComponent.mediaComponentId,
      value: mediaComponent.shortDescription,
      primary: true
    },
    update: {
      value: mediaComponent.shortDescription
    }
  })
  await prisma.videoSeoTitleTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      languageId: metadataLanguageId,
      videoId: mediaComponent.mediaComponentId,
      value: mediaComponent.title,
      primary: true
    },
    update: {
      value: mediaComponent.title
    }
  })
  await prisma.videoTitleTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      languageId: metadataLanguageId,
      videoId: mediaComponent.mediaComponentId,
      value: mediaComponent.title,
      primary: true
    },
    update: {
      value: mediaComponent.title
    }
  })
}

async function digestMediaComponentLanguage(
  mediaComponentLanguage: MediaComponentLanguage,
  mediaComponent: MediaComponent
): Promise<void> {
  if (mediaComponent.subType === 'series') {
    await prisma.videoVariant.upsert({
      where: { id: mediaComponentLanguage.refId },
      create: {
        id: mediaComponentLanguage.refId,
        videoId: mediaComponent.mediaComponentId,
        languageId: mediaComponentLanguage.languageId.toString(),
        duration: Math.round(
          mediaComponentLanguage.lengthInMilliseconds * 0.001
        )
      },
      update: {
        languageId: mediaComponentLanguage.languageId.toString(),
        duration: Math.round(
          mediaComponentLanguage.lengthInMilliseconds * 0.001
        )
      }
    })
    return
  }
  await prisma.videoVariant.upsert({
    where: {
      id: mediaComponentLanguage.refId
    },
    create: {
      id: mediaComponentLanguage.refId,
      videoId: mediaComponent.mediaComponentId,
      hls: mediaComponentLanguage.streamingUrls.hls[0].url,
      languageId: mediaComponentLanguage.languageId.toString(),
      duration: Math.round(mediaComponentLanguage.lengthInMilliseconds * 0.001)
    },
    update: {
      hls: mediaComponentLanguage.streamingUrls.hls[0].url,
      languageId: mediaComponentLanguage.languageId.toString(),
      duration: Math.round(mediaComponentLanguage.lengthInMilliseconds * 0.001)
    }
  })
  for (const [key, value] of Object.entries(
    mediaComponentLanguage.downloadUrls
  )) {
    await prisma.videoVariantDownload.upsert({
      where: {
        videoVariantId_quality: {
          quality: key as VideoVariantDownloadQuality,
          videoVariantId: mediaComponentLanguage.refId
        }
      },
      create: {
        videoVariantId: mediaComponentLanguage.refId,
        quality: key as VideoVariantDownloadQuality,
        size: value.sizeInBytes,
        url: value.url
      },
      update: {
        size: value.sizeInBytes,
        url: value.url
      }
    })
  }
  for (const subtitle of mediaComponentLanguage.subtitleUrls.vtt ?? []) {
    await prisma.videoVariantSubtitleTranslation.upsert({
      where: {
        languageId_videoVariantId: {
          languageId: subtitle.languageId.toString(),
          videoVariantId: mediaComponentLanguage.refId
        }
      },
      create: {
        languageId: subtitle.languageId.toString(),
        videoVariantId: mediaComponentLanguage.refId,
        value: subtitle.url,
        primary: subtitle.languageId === mediaComponentLanguage.languageId
      },
      update: {
        value: subtitle.url
      }
    })
  }
}

async function getMediaComponentLinks(
  mediaComponentId: string
): Promise<string[]> {
  const response: {
    linkedMediaComponentIds: { contains: string[] }
  } = await (
    await fetch(
      `https://api.arclight.org/v2/media-component-links/${mediaComponentId}?apiKey=${
        process.env.ARCLIGHT_API_KEY ?? ''
      }`
    )
  ).json()
  return response.linkedMediaComponentIds.contains
}

async function digestSeriesContainer(
  mediaComponent,
  languages,
  video
): Promise<void> {
  if (video?.slug != null)
    video.slug.forEach((title) => usedTitles.push(title.value))
  const metadataLanguageId =
    languages
      .find(({ bcp47 }) => bcp47 === mediaComponent.metadataLanguageTag)
      ?.languageId.toString() ?? '529' // english by default

  const mediaComponentLanguages = await getMediaComponentLanguage(
    mediaComponent.mediaComponentId
  )
  for (const mediaComponentLanguage of mediaComponentLanguages) {
    await digestMediaComponentLanguage(mediaComponentLanguage, mediaComponent)
  }

  const body: Video = {
    id: mediaComponent.mediaComponentId,
    type: VideoType.playlist,
    primaryLanguageId: mediaComponent.primaryLanguageId.toString(),
    image: mediaComponent.imageUrls.mobileCinematicHigh,
    episodeIds: [],
    noIndex: false,
    variantLanguageIds: mediaComponentLanguages.map((language) =>
      language.languageId.toString()
    )
  }
  await prisma.video.upsert({
    where: {
      id: mediaComponent.mediaComponentId
    },
    create: body,
    update: omit(body, ['id'])
  })
  await prisma.videoTitleTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      videoId: mediaComponent.mediaComponentId,
      value: mediaComponent.title,
      languageId: metadataLanguageId,
      primary: true
    },
    update: {
      value: mediaComponent.title
    }
  })
  await prisma.videoSeoTitleTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      videoId: mediaComponent.mediaComponentId,
      value: mediaComponent.title,
      languageId: metadataLanguageId,
      primary: true
    },
    update: {
      value: mediaComponent.title
    }
  })
  await prisma.videoSnippetTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      videoId: mediaComponent.mediaComponentId,
      value: mediaComponent.shortDescription,
      languageId: metadataLanguageId,
      primary: true
    },
    update: {
      value: mediaComponent.shortDescription
    }
  })
  await prisma.videoImageAltTranslation.upsert({
    where: {
      languageId_videoId: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId
      }
    },
    create: {
      videoId: mediaComponent.mediaComponentId,
      value:
        mediaComponent.title.length <= 100
          ? mediaComponent.title
          : mediaComponent.title.substring(0, 99),
      languageId: metadataLanguageId,
      primary: true
    },
    update: {
      value:
        mediaComponent.title.length <= 100
          ? mediaComponent.title
          : mediaComponent.title.substring(0, 99)
    }
  })
  let position = 0
  for (const studyQuestion of mediaComponent.studyQuestions) {
    await prisma.videoStudyQuestionTranslation.upsert({
      where: {
        languageId_videoId_position: {
          languageId: metadataLanguageId,
          videoId: mediaComponent.mediaComponentId,
          position: position
        }
      },
      create: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId,
        value: studyQuestion,
        primary: true,
        position
      },
      update: {
        value: studyQuestion
      }
    })
    position++
  }
  await prisma.videoSlugTranslation.upsert({
    where: {
      languageId_videoId_value: {
        languageId: metadataLanguageId,
        videoId: mediaComponent.mediaComponentId,
        value: createCoreSlug(mediaComponent.title)
      }
    },
    create: {
      languageId: metadataLanguageId,
      videoId: mediaComponent.mediaComponentId,
      value: getSeoSlug(mediaComponent.title),
      primary: true
    },
    update: {}
  })
}

async function digestContainer(
  languages: Language[],
  mediaComponent: MediaComponent
): Promise<void> {
  console.log('container:', mediaComponent.mediaComponentId)
  let series, existingSeries
  if (mediaComponent.subType === 'series') {
    existingSeries = await getVideo(mediaComponent.mediaComponentId)
    series = await digestSeriesContainer(
      mediaComponent,
      languages,
      existingSeries
    )
  } else {
    const metadataLanguageId =
      languages
        .find(({ bcp47 }) => bcp47 === mediaComponent.metadataLanguageTag)
        ?.languageId.toString() ?? '529' // english by default
    await prisma.tag.upsert({
      where: { id: mediaComponent.mediaComponentId },
      create: { id: mediaComponent.mediaComponentId },
      update: {}
    })
    await prisma.tagTitleTranslation.upsert({
      where: {
        tagId_languageId: {
          tagId: mediaComponent.mediaComponentId,
          languageId: metadataLanguageId
        }
      },
      create: {
        tagId: mediaComponent.mediaComponentId,
        value: mediaComponent.title,
        languageId: metadataLanguageId,
        primary: true
      },
      update: {
        value: mediaComponent.title
      }
    })
  }
  for (const videoId of await getMediaComponentLinks(
    mediaComponent.mediaComponentId
  )) {
    const video = await getVideo(videoId)
    if (video == null) continue

    if (mediaComponent.subType === 'series') series.episodeIds.push(videoId)

    if (
      (await prisma.videoTag.findFirst({
        where: {
          videoId: video.id,
          tagId: mediaComponent.mediaComponentId
        }
      })) != null
    )
      continue

    if (mediaComponent.subType === 'series') {
      await prisma.video.update({
        where: { id: videoId },
        data: {
          type: VideoType.episode
        }
      })
    } else {
      await prisma.videoTag.upsert({
        where: {
          videoId_tagId: {
            videoId,
            tagId: mediaComponent.mediaComponentId
          }
        },
        create: {
          videoId,
          tagId: mediaComponent.mediaComponentId
        },
        update: {}
      })
    }
  }
}

async function getVideo(videoId: string): Promise<Video | null> {
  return await prisma.video.findUnique({
    where: { id: videoId },
    include: { tags: { include: { tag: { include: { title: true } } } } }
  })
}

async function getUsedSlugs(): Promise<string[]> {
  const videos = await prisma.videoSlugTranslation.findMany({
    select: { value: true }
  })
  return videos.map((video) => video.value)
}
async function main(): Promise<void> {
  usedTitles = await getUsedSlugs()
  const languages = await getLanguages()
  for (const content of await getMediaComponents('content')) {
    await digestContent(languages, content)
  }

  for (const container of await getMediaComponents('container')) {
    await digestContainer(languages, container)
  }
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
