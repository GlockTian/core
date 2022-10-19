import { isEmpty } from 'lodash'
import fetch from 'cross-fetch'
import slugify from 'slugify'
import { PrismaClient, Language } from '.prisma/api-languages-client'

const prisma = new PrismaClient()

interface MediaLanguage {
  languageId: number
  bcp47?: string
  iso3?: string
  nameNative: string
  metadataLanguageTag: string
  name: string
}

async function getLanguage(languageId: string): Promise<Language | null> {
  return await prisma.language.findFirst({
    where: { id: languageId }
  })
}

async function getLanguageByBcp47(bcp47: string): Promise<Language | null> {
  return await prisma.language.findFirst({
    where: { bcp47: bcp47 }
  })
}

async function getMediaLanguages(): Promise<MediaLanguage[]> {
  const response: {
    _embedded: { mediaLanguages: MediaLanguage[] }
  } = await (
    await fetch(
      `https://api.arclight.org/v2/media-languages?limit=5000&apiKey=${
        process.env.ARCLIGHT_API_KEY ?? ''
      }`
    )
  ).json()
  return response._embedded.mediaLanguages
}

async function digestMediaLanguage(
  mediaLanguage: MediaLanguage
): Promise<void> {
  const { languageId, bcp47, iso3, nameNative } = mediaLanguage

  await prisma.language.upsert({
    where: { id: languageId.toString() },
    update: {
      bcp47: isEmpty(bcp47) ? null : bcp47,
      iso3: isEmpty(iso3) ? null : iso3
    },
    create: {
      bcp47: isEmpty(bcp47) ? null : bcp47,
      iso3: isEmpty(iso3) ? null : iso3,
      id: languageId.toString()
    }
  })

  await prisma.languageNameTranslation.upsert({
    where: {
      languageId_parentLanguageId: {
        languageId: languageId.toString(),
        parentLanguageId: languageId.toString()
      }
    },
    update: { value: nameNative },
    create: {
      value: nameNative,
      languageId: languageId.toString(),
      primary: true,
      parentLanguageId: languageId.toString()
    }
  })
}

async function digestMediaLanguageMetadata(
  mediaLanguage: MediaLanguage
): Promise<void> {
  const { languageId, metadataLanguageTag, name } = mediaLanguage
  const language = await getLanguage(languageId.toString())
  if (language == null) return

  const metadataLanguage = await getLanguageByBcp47(metadataLanguageTag)
  if (metadataLanguage == null) return

  await prisma.languageNameTranslation.upsert({
    where: {
      languageId_parentLanguageId: {
        languageId: metadataLanguage.id,
        parentLanguageId: language.id
      }
    },
    update: { value: name },
    create: {
      value: name,
      languageId: metadataLanguage.id,
      primary: false,
      parentLanguageId: languageId.toString()
    }
  })
}

export function getIteration(slug: string, collection: string[]): string {
  const exists = collection.find((t) => t === slug)
  if (exists != null && slug !== '') {
    const regex = slug.match(/^(.*?)-(\d+)$/)
    const iteration = parseInt(regex?.[2] ?? '1') + 1
    const title = regex?.[1] ?? slug
    const value = `${title}-${iteration}`
    return getIteration(value, collection)
  }
  return slug
}

export function getSeoSlug(title: string, collection: string[]): string {
  const slug = slugify(title, { lower: true, remove: /[^a-zA-Z\d\s:]/g })
  const newSlug = getIteration(slug, collection)
  collection.push(newSlug)
  return newSlug
}

async function main(): Promise<void> {
  const mediaLanguages = await getMediaLanguages()

  for (const mediaLanguage of mediaLanguages) {
    console.log('language:', mediaLanguage.languageId)
    await digestMediaLanguage(mediaLanguage)
  }

  for (const mediaLanguage of mediaLanguages) {
    await digestMediaLanguageMetadata(mediaLanguage)
  }
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
