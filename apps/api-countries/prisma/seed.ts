import { float } from 'aws-sdk/clients/lightsail'
import { omit } from 'lodash'
import fetch from 'cross-fetch'
import slugify from 'slugify'
import { PrismaClient, Country } from '.prisma/api-countries-client'

const prisma = new PrismaClient()

interface MediaLanguage {
  languageId: number
  bcp47?: string
  iso3?: string
  nameNative: string
  metadataLanguageTag: string
  name: string
}

interface MediaCountry {
  countryId: number
  name: string
  continentName: string
  metadataLanguageTag: string
  longitude: float
  latitude: float
  counts: {
    languageCount: {
      value: number
    }
    population: {
      value: number
    }
  }
  assets: {
    flagUrls: {
      png8: string
      webpLossy50: string
    }
  }
  languageIds: number[]
}

interface MetadataLanguageTag {
  tag: string
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

async function getCountries(language = 'en'): Promise<MediaCountry[]> {
  const response: {
    _embedded: { mediaCountries: MediaCountry[] }
  } = await (
    await fetch(
      `https://api.arclight.org/v2/media-countries?limit=5000&apiKey=${
        process.env.ARCLIGHT_API_KEY ?? ''
      }&metadataLanguageTags=${language}&expand=languageIds`
    )
  ).json()
  return response._embedded.mediaCountries
}

const usedTitles: string[] = []

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

async function digestCountries(countries: MediaCountry[]): Promise<void> {
  console.log('countries:', '529')
  for (const country of countries) {
    console.log('country:', country.countryId)
    const body: Country = {
      id: country.countryId.toString(),
      population: country.counts.population.value,
      latitude: country.latitude,
      longitude: country.longitude,
      image: country.assets.flagUrls.png8,
      languageIds: country.languageIds.map((id) => id.toString())
    }
    await prisma.country.upsert({
      where: { id: country.countryId.toString() },
      update: omit(body, ['id']),
      create: body
    })
    await prisma.countryNameTranslation.upsert({
      where: {
        countryId_languageId: {
          countryId: country.countryId.toString(),
          languageId: '529'
        }
      },
      update: {
        value: country.name
      },
      create: {
        value: country.name,
        languageId: '529',
        primary: true,
        countryId: country.countryId.toString()
      }
    })
    await prisma.countrySlugTranslation.upsert({
      where: {
        countryId_languageId: {
          countryId: country.countryId.toString(),
          languageId: '529'
        }
      },
      update: {
        value: getSeoSlug(country.name, usedTitles)
      },
      create: {
        value: getSeoSlug(country.name, usedTitles),
        languageId: '529',
        primary: true,
        countryId: country.countryId.toString()
      }
    })
    await prisma.countryContinentTranslation.upsert({
      where: {
        countryId_languageId: {
          countryId: country.countryId.toString(),
          languageId: '529'
        }
      },
      update: {
        value: country.name
      },
      create: {
        value: country.continentName,
        languageId: '529',
        primary: true,
        countryId: country.countryId.toString()
      }
    })
  }
}

async function digestTranslatedCountries(
  countries: MediaCountry[],
  languageId: string
): Promise<void> {
  if (languageId === '529') return
  console.log('countries:', languageId)
  for (const country of countries) {
    console.log('country:', country.countryId)
    await prisma.countryNameTranslation.upsert({
      where: {
        countryId_languageId: {
          countryId: country.countryId.toString(),
          languageId
        }
      },
      update: {
        value: country.name
      },
      create: {
        value: country.name,
        languageId,
        primary: false,
        countryId: country.countryId.toString()
      }
    })
    await prisma.countrySlugTranslation.upsert({
      where: {
        countryId_languageId: {
          countryId: country.countryId.toString(),
          languageId
        }
      },
      update: {
        value: getSeoSlug(country.name, usedTitles)
      },
      create: {
        value: getSeoSlug(country.name, usedTitles),
        languageId,
        primary: false,
        countryId: country.countryId.toString()
      }
    })
    await prisma.countryContinentTranslation.upsert({
      where: {
        countryId_languageId: {
          countryId: country.countryId.toString(),
          languageId
        }
      },
      update: {
        value: country.name
      },
      create: {
        value: country.continentName,
        languageId,
        primary: false,
        countryId: country.countryId.toString()
      }
    })
  }
}

async function getMetadataLanguageTags(): Promise<MetadataLanguageTag[]> {
  const response: {
    _embedded: { metadataLanguageTags: MetadataLanguageTag[] }
  } = await (
    await fetch(
      `https://api.arclight.org/v2/metadata-language-tags?limit=5000&apiKey=${
        process.env.ARCLIGHT_API_KEY ?? ''
      }`
    )
  ).json()
  return response._embedded.metadataLanguageTags
}

async function main(): Promise<void> {
  const mediaLanguages = await getMediaLanguages()

  console.log('getting countries')
  const countries = await getCountries()
  void digestCountries(countries)

  const metadataLanguages = await getMetadataLanguageTags()
  for (const metaDataLanguage of metadataLanguages) {
    const languageId = mediaLanguages.find(
      (l) => l.bcp47 === metaDataLanguage.tag
    )?.languageId
    if (languageId == null) continue
    const translatedCountries = await getCountries(metaDataLanguage.tag)
    await digestTranslatedCountries(translatedCountries, languageId.toString())
  }
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
